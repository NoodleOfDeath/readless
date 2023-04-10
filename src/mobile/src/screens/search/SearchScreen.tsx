import React from 'react';
import { ActivityIndicator } from 'react-native';

import { SearchBar, Switch } from '@rneui/base';

import {
  InteractionResponse,
  InteractionType,
  PublicSummaryAttributes,
  ReadingFormat,
} from '~/api';
import {
  Button,
  Screen,
  ScrollView,
  Summary,
  Text,
  View,
} from '~/components';
import {
  AppStateContext,
  Bookmark,
  SessionContext,
} from '~/contexts';
import { useSummaryClient, useTheme } from '~/hooks';
import { ScreenProps } from '~/screens';

export function SearchScreen({ 
  route,
  navigation,
}: ScreenProps<'search'>) {
  const { 
    setShowNotFollowingDialog,
    setShowLoginDialog, 
    setLoginDialogProps,
    setNavigation,
  } = React.useContext(AppStateContext);
  const { 
    preferences: {
      bookmarkedCategories,
      bookmarkedOutlets,
      bookmarkedSummaries, 
      compactMode, 
      preferredReadingFormat, 
      showOnlyBookmarkedNews,
    },
    setPreference,
  } = React.useContext(SessionContext);
  const {
    getSummaries, recordSummaryView, interactWithSummary, 
  } = useSummaryClient();
  const theme = useTheme();
  
  const [prefilter, setPrefilter] = React.useState(route?.params?.prefilter ?? '');
  
  React.useEffect(() => {
    setPrefilter(route?.params?.prefilter);
    if (route?.params?.prefilter) {
      setSearchText(`${route.params?.prefilter} `);
    } else {
      setSearchText('');
    }
  }, [route]);
  
  React.useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [prefilter, navigation]);

  const [loading, setLoading] = React.useState(false);
  const [recentSummaries, setRecentSummaries] = React.useState<
    PublicSummaryAttributes[]
  >([]);
  const [totalResultCount, setTotalResultCount] = React.useState(0);

  const [pageSize] = React.useState(10);
  const [page, setPage] = React.useState(0);
  const [searchText, setSearchText] = React.useState(route?.params?.prefilter ?? '');

  const categoryCount = React.useMemo(() => Object.values(bookmarkedCategories ?? {}).length, [bookmarkedCategories]);
  const outletCount = React.useMemo(() => Object.values(bookmarkedOutlets ?? {}).length, [bookmarkedOutlets]);

  const followFilter = React.useMemo(() => [`cat:${Object.values(bookmarkedCategories ?? {}).map((c) => c.item.name.toLowerCase().replace(/\s/g, '-')).join(',')}`, `src:${Object.values(bookmarkedOutlets ?? {}).map((o) => o.item.name).join(',')}`].join(' '), [bookmarkedCategories, bookmarkedOutlets]);

  const load = React.useCallback(async (pageSize: number, page: number) => {
    setLoading(true);
    if (page === 0) {
      setRecentSummaries([]);
    }
    const filter = prefilter ?? showOnlyBookmarkedNews ? [followFilter, searchText].join(' ') : searchText;
    try {
      const { data, error } = await getSummaries(
        filter,
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
  }, [showOnlyBookmarkedNews, followFilter, searchText, prefilter, getSummaries]);

  const onMount = React.useCallback(() => {
    setPage(0);
    load(pageSize, 0);
    if (prefilter) {
      navigation?.setOptions({ headerShown: true, headerTitle: prefilter });
    }
  }, [load, navigation, pageSize, prefilter]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => onMount(), [pageSize, prefilter, searchText, showOnlyBookmarkedNews, bookmarkedOutlets, bookmarkedCategories]);

  const loadMore = React.useCallback(async () => {
    await load(pageSize, page + 1);
  }, [load, pageSize, page]);

  const setShowOnlyBookmarkedNews = React.useCallback((value: boolean) => {
    if (value && categoryCount + outletCount === 0) {
      setNavigation(navigation);
      setShowNotFollowingDialog(true);
      return;
    }
    setPreference('showOnlyBookmarkedNews', value);
  }, [categoryCount, navigation, outletCount, setNavigation, setPreference, setShowNotFollowingDialog]);

  const handleFormatChange = React.useCallback(
    async (summary: PublicSummaryAttributes, format?: ReadingFormat) => {
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

  const updateInteractions = (summary: PublicSummaryAttributes, interactions: InteractionResponse) => {
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
  
  const handleInteraction = React.useCallback(async (summary: PublicSummaryAttributes, interaction: InteractionType, content?: string, metadata?: Record<string, unknown>) => {
    if (interaction === InteractionType.Bookmark) {
      setPreference('bookmarkedSummaries', (prev) => {
        const bookmarks = { ...prev };
        if (bookmarks[summary.id]) {
          delete bookmarks[summary.id];
        } else {
          bookmarks[summary.id] = new Bookmark(summary);
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
    <Screen
      refreshing={ loading }
      onRefresh={ () => load(pageSize, 0) }>
      {!prefilter && (
        <React.Fragment>
          <View style={ theme.components.searchBar }>
            <SearchBar
              placeholder="show me something worth reading..."
              lightTheme={ theme.isLightMode }
              onChangeText={ ((text) => 
                setSearchText(text)) }
              value={ searchText } />
          </View>
          <View height={ 48 } p={ 16 }>
            <View row alignCenter>
              <Text mr={ 4 }>News you follow</Text>
              <Switch 
                color={ theme.colors.primary } 
                value={ !showOnlyBookmarkedNews }
                onChange={ () => setShowOnlyBookmarkedNews(!showOnlyBookmarkedNews) } />
              <Text ml={ 4 }>All News</Text>
            </View>
          </View>
        </React.Fragment>
      )}
      <ScrollView>
        <View col>
          {loading && recentSummaries.length === 0 && (
            <View row justifyCenter p={ 16 }>
              <ActivityIndicator size="large" />
            </View>
          )}
          {!loading && showOnlyBookmarkedNews && recentSummaries.length === 0 && (
            <View col justifyCenter p={ 16 }>
              <Text fontSize={ 20 } pb={ 8 }>It seems your filters are too specific. You may want to consider adding more categories and new sources to your follow list.</Text>
              <Button 
                alignCenter
                rounded 
                outlined 
                p={ 8 }
                selectable
                onPress={ () => navigation?.getParent()?.navigate('Sections') }>
                Go to Sections
              </Button>
            </View>
          )}
          {recentSummaries.map((summary) => (
            <Summary
              key={ summary.id }
              summary={ summary }
              compact={ compactMode }
              bookmarked={ Boolean(bookmarkedSummaries?.[summary.id]) }
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
      </ScrollView>
    </Screen>
  );
}
