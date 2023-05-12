import React from 'react';
import {
  DeviceEventEmitter,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';

import { Badge } from 'react-native-paper';

import { DisplaySettingsMenu } from './DisplaySettingsMenu';
import { SearchMenu } from './SearchMenu';

import {
  InteractionType,
  PublicSummaryAttributes,
  ReadingFormat,
} from '~/api';
import {
  ActivityIndicator,
  Button,
  Screen,
  Summary,
  Text,
  View,
} from '~/components';
import {
  DialogContext,
  MediaContext,
  SessionContext,
  ToastContext,
} from '~/contexts';
import {
  useNavigation,
  useSummaryClient,
  useTheme,
} from '~/hooks';
import { ScreenProps } from '~/screens';
import { lengthOf } from '~/utils';

export function SearchScreen({ 
  route,
  navigation,
}: ScreenProps<'search'>) {
  const { 
    preferences: {
      bookmarkedCategories,
      bookmarkedOutlets,
      bookmarkedSummaries,
      preferredReadingFormat,
      readSummaries,
      removedSummaries,
      sortOrder,
      searchCanMatchAny,
    },
    ready,
  } = React.useContext(SessionContext);
  const toast = React.useContext(ToastContext);
  const {
    queueSummary, currentTrackIndex, preloadCount,
  } = React.useContext(MediaContext);
  const { showShareDialog } = React.useContext(DialogContext);
  const { getSummaries, handleInteraction } = useSummaryClient();
  const { search, router } = useNavigation();
  const theme = useTheme();
  
  const [prefilter, setPrefilter] = React.useState(route?.params?.prefilter);
  const onlyCustomNews = React.useMemo(() => Boolean(route?.params?.onlyCustomNews), [route]);
  const specificIds = React.useMemo<number[] | undefined>(() => (route?.params?.specificIds), [route]);

  React.useEffect(() => {
    if (route?.params?.prefilter) {
      setPrefilter(route?.params?.prefilter);
    }
  }, [route]);

  const [loading, setLoading] = React.useState(false);
  const [loaded, setLoaded] = React.useState(false);
  const [summaries, setSummaries] = React.useState<PublicSummaryAttributes[]>([]);
  const [totalResultCount, setTotalResultCount] = React.useState(0);
  const [pendingReload, setPendingReload] = React.useState(false);

  const [pageSize] = React.useState(10);
  const [page, setPage] = React.useState(0);
  const [searchText, setSearchText] = React.useState('');
  const [keywords, setKeywords] = React.useState<string[]>([]);
   
  const categoryOutletCount = React.useMemo(() => lengthOf(bookmarkedCategories, bookmarkedOutlets), [bookmarkedCategories, bookmarkedOutlets]);
  
  const bookmarkCount = React.useMemo(() => Object.keys(bookmarkedSummaries ?? {}).filter((summary) => !(summary in (readSummaries ?? {}))).length ?? 0, [bookmarkedSummaries, readSummaries]);

  const followFilter = React.useMemo(() => {
    if (categoryOutletCount === 0) {
      return '';
    }
    return [`cat:${Object.values(bookmarkedCategories ?? {})
      .map((c) => c.item.name).join(',')}`, 
    `src:${Object.values(bookmarkedOutlets ?? {})
      .map((o) => o.item.name).join(',')}`]
      .join(' ');
  }, [categoryOutletCount, bookmarkedCategories, bookmarkedOutlets]);
  
  const excludeIds = React.useMemo(() => {
    if (!removedSummaries || Object.keys(removedSummaries).length === 0) {
      return undefined;
    }
    return Object.keys(removedSummaries).map((k) => Number(k));
  }, [removedSummaries]);
  
  const noResults = React.useMemo(() => onlyCustomNews && !followFilter, [onlyCustomNews, followFilter]);

  const handlePlayAll = React.useCallback(async () => {
    if (summaries.length < 1) {
      return;
    }
    queueSummary(summaries);
    summaries.forEach((summary) => {
      handleInteraction(summary, InteractionType.Listen);
    });
  }, [summaries, queueSummary, handleInteraction]);

  const load = React.useCallback(async (page: number) => {
    setLoading(true);
    if (page === 0) {
      setSummaries([]);
    }
    if (onlyCustomNews && !followFilter) {
      setLoading(false);
      return;
    }
    let filter = searchText;
    if (prefilter) {
      filter = [prefilter, searchText].join(' ');
    } else if (onlyCustomNews) {
      filter = [followFilter, searchText].join(' ');
    }
    try {
      const { data, error } = await getSummaries(
        filter.trim(),
        specificIds ?? excludeIds,
        !specificIds && Boolean(excludeIds),
        searchCanMatchAny ? 'any' : 'all',
        page,
        pageSize,
        sortOrder
      );
      if (error) {
        console.error(error);
        toast.alert(error.message);
        return;
      }
      if (!data) {
        return;
      }
      setTotalResultCount(data.count);
      setSummaries((prev) => {
        if (page === 0) {
          return (prev = data.rows);
        }
        return (prev = [...prev, ...data.rows.filter((r) => !prev.some((p) => r.id === p.id))]);
      });
      setPage((prev) => prev + 1);
    } catch (e) {
      console.error(e);
      setSummaries([]);
      setTotalResultCount(0);
    } finally {
      setLoading(false);
      setLoaded(true);
    }
  }, [onlyCustomNews, followFilter, searchText, prefilter, getSummaries, specificIds, excludeIds, pageSize, sortOrder, toast, searchCanMatchAny]);
  
  const headerLeft = React.useMemo(() => {
    return (
      <SearchMenu 
        initialValue={ prefilter }
        onChangeText={ (text) => setSearchText(text) }
        onSubmit={ (value) => search({ onlyCustomNews, prefilter: value }) } />
    );
  }, [prefilter, search, onlyCustomNews]);
  
  React.useEffect(() => {
    if (prefilter) {
      setSearchText(prefilter + ' ');
      navigation?.setOptions({ 
        headerBackVisible: true,
        headerLeft: () => headerLeft,
        headerRight: () => (
          <View>
            <View row gap={ 12 } alignCenter>
              <Button startIcon="volume-high" iconSize={ 24 } onPress={ handlePlayAll } />
              <DisplaySettingsMenu />
            </View>
          </View>
        ),
        headerTitle: '',
      });
      setKeywords(prefilter.replace(/['"]/g, '').split(' ').filter((s) => s.trim()));
    } else {
      setSearchText('');
      navigation?.setOptions({
        headerBackTitleVisible: false,
        headerBackVisible: true,
        headerLeft: () => !route?.params?.noHeader && headerLeft,
        headerRight: () => !route?.params?.noHeader && (
          <View>
            <View row gap={ 12 } alignCenter>
              <View onPress={ () => navigation?.push('bookmarks') }>
                {bookmarkCount > 0 && (
                  <Badge style={ {
                    position: 'absolute', right: -5, top: -5, zIndex: 1,
                  } }>
                    {bookmarkCount}
                  </Badge>
                )}
                <Button startIcon="bookmark-outline" iconSize={ 24 } />
              </View>
              <Button startIcon="volume-high" iconSize={ 24 } onPress={ handlePlayAll } />
              <DisplaySettingsMenu />
            </View>
          </View>
        ),
      });
    }
  }, [navigation, route, router, headerLeft, handlePlayAll, prefilter, bookmarkCount, onlyCustomNews]);
  
  const onMount = React.useCallback(() => {
    if (!ready) {
      return;
    }
    setPage(0);
    load(0);
  }, [ready, load]);
  
  React.useEffect(
    () => onMount(), 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [prefilter, ready]
  );
  
  React.useEffect(() => {
    setSummaries((prev) => {
      const newState = prev.filter((p) => !(p.id in (removedSummaries ?? {})));
      return (prev = newState);
    });
  }, [removedSummaries]);
  
  React.useEffect(() => {
    if (!pendingReload) {
      return;
    }
    setPendingReload(false);
    load(0);
  }, [pendingReload, load, removedSummaries, searchText]);

  const loadMore = React.useCallback(async (event?: string) => {
    if (loading || totalResultCount <= summaries.length) {
      return;
    }
    await load(page + 1);
    if (event) {
      DeviceEventEmitter.emit(event);
    }
  }, [load, loading, page, totalResultCount, summaries]);

  const handleFormatChange = React.useCallback(
    (summary: PublicSummaryAttributes, format?: ReadingFormat) => {
      handleInteraction(summary, InteractionType.Read, undefined, { format });
      navigation?.push('summary', {
        initialFormat: format ?? preferredReadingFormat ?? ReadingFormat.Summary,
        keywords: searchText ? searchText.replace(/['"]/g, '').split(' ').filter((s) => s.trim()) : [],
        summary,
      });
    },
    [handleInteraction, navigation, preferredReadingFormat, searchText]
  );
  
  const handleScroll = React.useCallback(async (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if ( !loading && event.nativeEvent.contentOffset.y + 
        event.nativeEvent.layoutMeasurement.height > 
        event.nativeEvent.contentSize.height - 400) {
      await loadMore();
    }
  }, [loading, loadMore]);

  const loadMoreAsNeeded = React.useCallback(async () => {
    if (!currentTrackIndex) {
      return;
    }
    if (currentTrackIndex + preloadCount > summaries.length) {
      await loadMore('autoloaded-for-track');
    }
  }, [currentTrackIndex, loadMore, preloadCount, summaries]);

  React.useEffect(() => {
    loadMoreAsNeeded();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackIndex]);
  
  React.useEffect(() => {
    const subscriber = DeviceEventEmitter.addListener('autoloaded-for-track', () => {
      queueSummary(summaries);
    });
    return () => {
      subscriber.remove();
    };
  }, [queueSummary, summaries]);
  
  React.useEffect(() => {
    const subscriber = DeviceEventEmitter.addListener('load-more', loadMore);
    return () => subscriber.remove();
  }, [loadMore]);

  return (
    <Screen
      refreshing={ loading }
      onRefresh={ () => load(0) }
      onScroll={ handleScroll }>
      <View col mh={ 16 } mt={ 12 }>
        {!loading && onlyCustomNews && summaries.length === 0 && (
          <View col justifyCenter p={ 16 }>
            <Text subtitle1 pb={ 8 }>
              It seems your filters are too specific. You may want to consider 
              adding more categories and/or news sources to your follow list.
            </Text>
            <Button 
              alignCenter
              rounded 
              outlined 
              p={ 8 }
              selectable
              onPress={ () => navigation?.getParent()?.navigate('Browse') }>
              Go to Browse
            </Button>
          </View>
        )}
      </View>
      {prefilter && onlyCustomNews && (
        <Text caption textCenter mb={ 6 } mh={ 12 }>Note: This is searching within only your custom news feed and not all news articles</Text>
      )}
      {summaries.map((summary) => (
        <Summary
          key={ summary.id }
          summary={ summary }
          keywords={ showShareDialog ? undefined : keywords }
          onFormatChange={ (format) => handleFormatChange(summary, format) }
          onInteract={ (...e) => handleInteraction(summary, ...e) } />
      ))}
      {!loading && !noResults && totalResultCount > summaries.length && (
        <View row justifyCenter p={ 16 } pb={ 24 }>
          <Button 
            outlined
            rounded
            p={ 8 }
            selectable
            onPress={ () => loadMore() }>
            Load More
          </Button>
        </View>
      )}
      {loading && (summaries.length > 0 || !loaded) && (
        <View row mb={ 64 }>
          <View row justifyCenter p={ 16 } pb={ 24 }>
            <ActivityIndicator size="large" color={ theme.colors.primary } />
          </View>
        </View>
      )}
      {summaries.length === 0 && !loading && (
        <Text textCenter mh={ 16 }>No results found 🥺</Text>
      )}
    </Screen>
  );
}
