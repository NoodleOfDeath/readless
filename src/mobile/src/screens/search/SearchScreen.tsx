import React from 'react';

import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SearchBar } from 'react-native-elements';

import {
  InteractionResponse,
  InteractionType,
  ReadingFormat,
  SummaryResponse,
} from '~/api';
import {
  Button,
  FlexView,
  SafeScrollView,
  Summary,
} from '~/components';
import { useSummaryClient, useTheme } from '~/hooks';
import { RootParamList } from '~/screens';

type Props = {
  route: RouteProp<RootParamList['discover'], 'search'>;
  navigation: NativeStackNavigationProp<RootParamList['discover'], 'search'>;
};

export function SearchScreen({ navigation }: Props) {
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
      await recordSummaryView(summary);
      navigation?.navigate('summary', {
        format,
        summary,
      });
    },
    [navigation, recordSummaryView]
  );

  const updateInteractions = (summary: SummaryResponse, interactions: InteractionResponse) => {
    setRecentSummaries((prev) => {
      const newSummaries = [...prev];
      const index = newSummaries.findIndex((s) => s.id === summary.id);
      if (index === -1) {
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
    await interactWithSummary(
      summary, 
      interaction,
      content,
      metadata,
      (interactions) => updateInteractions(summary, interactions),
      (error) => console.log(error)
    );
  }, [interactWithSummary]);

  return (
    <React.Fragment>
      <FlexView style={ theme.components.searchBar }>
        <SearchBar
          placeholder="show me something worth reading..."
          lightTheme={ theme.isLightMode }
          onChangeText={ (text) => 
            setSearchText(text) }
          value={ searchText } />
      </FlexView>
      <SafeScrollView
        refreshing={ loading }
        onRefresh={ () => load(pageSize, 0, searchText) }>
        <FlexView>
          {recentSummaries.map((summary) => (
            <Summary
              key={ summary.id }
              summary={ summary }
              onChange={ (format) => onExpandPost(summary, format) }
              onInteract={ (...e) => handleInteraction(summary, ...e) } />
          ))}
          {!loading && totalResultCount > recentSummaries.length && (
            <Button onPress={ loadMore }>
              Load More
            </Button>
          )}
        </FlexView>
      </SafeScrollView>
    </React.Fragment>
  );
}
