import React from 'react';

import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SearchBar } from '@rneui/base';

import {
  InteractionResponse,
  InteractionType,
  ReadingFormat,
  SummaryResponse,
} from '~/api';
import {
  Button,
  SafeScrollView,
  Summary,
  View,
} from '~/components';
import { AppStateContext, SessionContext } from '~/contexts';
import { useSummaryClient, useTheme } from '~/hooks';
import { RootParamList } from '~/screens';

type Props = {
  route: RouteProp<RootParamList['search'], 'search'>;
  navigation: NativeStackNavigationProp<RootParamList['search'], 'search'>;
};

export function SearchScreen({ navigation }: Props) {
  const { setShowLoginDialog, setLoginDialogProps } = React.useContext(AppStateContext);
  const { preferences: { preferredReadingFormat } } = React.useContext(SessionContext);
  const {
    getSummaries, recordSummaryView, interactWithSummary, 
  } = useSummaryClient();
  const theme = useTheme();

  const [loading, setLoading] = React.useState(false);
  const [recentSummaries, setRecentSummaries] = React.useState<
    SummaryResponse[]
  >([]);
  const [totalResultCount, setTotalResultCount] = React.useState(0);

  const [pageSize] = React.useState(10);
  const [page, setPage] = React.useState(0);
  const [searchText, setSearchText] = React.useState('');

  const load = React.useCallback(async (pageSize: number, page: number, searchText: string) => {
    setLoading(true);
    if (page === 0) {
      setRecentSummaries([]);
    }
    try {
      const { data, error } = await getSummaries({
        filter: searchText,
        page,
        pageSize,
      });
      if (error) {
        console.log(error);
        return;
      }
      if (!data) {
        return;
      }
      setRecentSummaries((prev) => {
        if (page === 0) {
          return (prev = data.rows);
        }
        return (prev = [...prev, ...data.rows]);
      });
      setTotalResultCount(data.count);
      setPage((prev) => prev + 1);
    } catch (e) {
      console.error(e);
      setRecentSummaries([]);
      setTotalResultCount(0);
    } finally {
      setLoading(false);
    }
  }, [getSummaries]);

  const onMount = React.useCallback(() => {
    setPage(0);
    load(pageSize, 0, searchText);
  }, [load, pageSize, searchText]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => onMount(), [pageSize, searchText]);

  const loadMore = React.useCallback(async () => {
    await load(pageSize, page + 1, searchText);
  }, [load, pageSize, page, searchText]);

  const onExpandPost = React.useCallback(
    async (summary: SummaryResponse, format?: ReadingFormat) => {
      recordSummaryView(summary, undefined, { format });
      navigation?.navigate('summary', {
        initialFormat: format ?? preferredReadingFormat ?? ReadingFormat.Concise,
        summary,
      });
    },
    [navigation, preferredReadingFormat, recordSummaryView]
  );

  const updateInteractions = (summary: SummaryResponse, interactions: InteractionResponse) => {
    setRecentSummaries((prev) => {
      const newSummaries = [...prev];
      const index = newSummaries.findIndex((s) => s.id === summary.id);
      if (index < 0) {
        return (prev = newSummaries);
      }
      newSummaries[index] = {
        ...newSummaries[index],
        interactions,
      };
      return (prev = newSummaries);
    });
  };
  
  const handleInteraction = React.useCallback(async (summary: SummaryResponse, interaction: InteractionType, content?: string, metadata?: Record<string, unknown>) => {
    const { data, error } = await interactWithSummary(
      summary, 
      interaction,
      content,
      metadata
    );
    if (error) {
      console.log(error);
      if (error.name === 'NOT_LOGGED_IN') {
        setShowLoginDialog(true);
        setLoginDialogProps({ alert: 'Please log in to continue' });
      }
      return;
    }
    if (!data) {
      return;
    }
    updateInteractions(summary, data);
  }, [interactWithSummary, setLoginDialogProps, setShowLoginDialog]);

  return (
    <React.Fragment>
      <View style={ theme.components.searchBar }>
        <SearchBar
          placeholder="show me something worth reading..."
          lightTheme={ theme.isLightMode }
          onChangeText={ ((text) => 
            setSearchText(text)) }
          value={ searchText } />
      </View>
      <SafeScrollView
        refreshing={ loading }
        onRefresh={ () => load(pageSize, 0, searchText) }>
        <View>
          {recentSummaries.map((summary) => (
            <Summary
              key={ summary.id }
              summary={ summary }
              onChange={ (format) => onExpandPost(summary, format) }
              onInteract={ (...e) => handleInteraction(summary, ...e) } />
          ))}
          {!loading && totalResultCount > recentSummaries.length && (
            <View row center p={ 16 } pb={ 24 }>
              <Button onPress={ loadMore }>
                Load More
              </Button>
            </View>
          )}
        </View>
      </SafeScrollView>
    </React.Fragment>
  );
}
