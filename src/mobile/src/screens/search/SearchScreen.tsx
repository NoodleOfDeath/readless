import React from 'react';

import { SearchBar } from '@rneui/base';

import {
  InteractionResponse,
  InteractionType,
  ReadingFormat,
  SummaryResponse,
} from '~/api';
import {
  Button,
  Screen,
  Summary,
  View,
} from '~/components';
import {
  AppStateContext,
  SessionContext,
  SummaryBookmark,
  SummaryBookmarkKey,
} from '~/contexts';
import { useSummaryClient, useTheme } from '~/hooks';
import { ScreenProps } from '~/screens';

export function SearchScreen({ 
  route,
  navigation,
}: ScreenProps<'search'>) {
  const { 
    setShowLoginDialog, 
    setLoginDialogProps,
  } = React.useContext(AppStateContext);
  const { 
    preferences: {
      bookmarks, compactMode, preferredReadingFormat, 
    },
    setPreference,
  } = React.useContext(SessionContext);
  const {
    getSummaries, recordSummaryView, interactWithSummary, 
  } = useSummaryClient();
  const theme = useTheme();
  
  const prefilter = React.useMemo(() => route?.params?.prefilter, [route]);
  const title = React.useMemo(() => route?.params?.title, [route]);
  
  React.useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [prefilter, navigation]);

  const [loading, setLoading] = React.useState(false);
  const [recentSummaries, setRecentSummaries] = React.useState<
    SummaryResponse[]
  >([]);
  const [totalResultCount, setTotalResultCount] = React.useState(0);

  const [pageSize] = React.useState(10);
  const [page, setPage] = React.useState(0);
  const [searchText, setSearchText] = React.useState(route?.params?.prefilter ?? '');

  const load = React.useCallback(async (pageSize: number, page: number, searchText: string) => {
    setLoading(true);
    if (page === 0) {
      setRecentSummaries([]);
    }
    try {
      const { data, error } = await getSummaries(
        searchText,
        undefined,
        page,
        pageSize
      );
      if (error) {
        console.error(error);
        return;
      }
      if (!data) {
        return;
      }
      setRecentSummaries((prev) => {
        if (page === 0) {
          return (prev = data.rows);
        }
        return (prev = [...prev, ...data.rows.filter((r) => !prev.some((p) => r.id === p.id))]);
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
    load(pageSize, 0, prefilter ?? searchText);
    if (prefilter) {
      navigation?.setOptions({ headerShown: true, headerTitle: title ?? prefilter });
    }
  }, [load, navigation, pageSize, prefilter, searchText, title]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => onMount(), [pageSize, prefilter, searchText]);

  const loadMore = React.useCallback(async () => {
    await load(pageSize, page + 1, prefilter ?? searchText);
  }, [load, pageSize, page, prefilter, searchText]);

  const handleFormatChange = React.useCallback(
    async (summary: SummaryResponse, format?: ReadingFormat) => {
      recordSummaryView(summary, undefined, { format });
      navigation?.push('summary', {
        initialFormat: format ?? preferredReadingFormat ?? ReadingFormat.Concise,
        summary,
      });
    },
    [navigation, preferredReadingFormat, recordSummaryView]
  );
  
  const handleReferSearch = React.useCallback((newPrefilter: string) => {
    if (prefilter === newPrefilter) {
      return;
    }
    navigation?.push('search', { prefilter: newPrefilter });
  }, [navigation, prefilter]);

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
    if (interaction === InteractionType.Bookmark) {
      setPreference('bookmarks', (prev) => {
        const bookmarks = { ...prev };
        const key: SummaryBookmarkKey = `summary:${summary.id}`;
        if (bookmarks[key]) {
          delete bookmarks[key];
        } else {
          bookmarks[key] = new SummaryBookmark(summary);
        }
        return (prev = bookmarks);
      });
      return;
    }
    const { data, error } = await interactWithSummary(
      summary, 
      interaction,
      content,
      metadata
    );
    if (error) {
      console.error(error);
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
  }, [interactWithSummary, setLoginDialogProps, setShowLoginDialog, setPreference]);

  return (
    <React.Fragment>
      {!prefilter && (
        <View style={ theme.components.searchBar }>
          <SearchBar
            placeholder="show me something worth reading..."
            lightTheme={ theme.isLightMode }
            onChangeText={ ((text) => 
              setSearchText(text)) }
            value={ searchText } />
        </View>
      )}
      <Screen
        refreshing={ loading }
        onRefresh={ () => load(pageSize, 0, prefilter ?? searchText) }>
        <View>
          {recentSummaries.map((summary) => (
            <Summary
              key={ summary.id }
              summary={ summary }
              forceCompact={ compactMode }
              bookmarked={ Boolean(bookmarks?.[`summary:${summary.id}`]) }
              onFormatChange={ (format) => handleFormatChange(summary, format) }
              onReferSearch={ handleReferSearch }
              onInteract={ (...e) => handleInteraction(summary, ...e) } />
          ))}
          {!loading && totalResultCount > recentSummaries.length && (
            <View row justifyCenter p={ 16 } pb={ 24 }>
              <Button 
                outlined
                rounded
                p={ 8 }
                selectable
                onPress={ loadMore }>
                Load More
              </Button>
            </View>
          )}
        </View>
      </Screen>
    </React.Fragment>
  );
}
