import React from 'react';
import { 
  DeviceEventEmitter,
  LayoutRectangle,
  NativeScrollEvent, 
  NativeSyntheticEvent,
  Platform,
  RefreshControl,
} from 'react-native';

import { useFocusEffect, useIsFocused } from '@react-navigation/native';
import { FlashList, ListRenderItem } from '@shopify/flash-list';
import ms from 'ms';

import {
  API,
  InteractionType,
  PublicSummaryGroup,
  ReadingFormat,
} from '~/api';
import {
  ActivityIndicator,
  Button,
  Divider,
  FlatList,
  FlatListProps,
  MeterDial,
  Popover,
  Summary,
  Text,
  View,
} from '~/components';
import {
  LayoutContext,
  MediaContext,
  StorageContext,
} from '~/contexts';
import {
  useAppState,
  useNavigation,
  useTheme,
} from '~/hooks';
import { getLocale, strings } from '~/locales';
import { SearchViewController } from '~/navigation';
import { fixedSentiment, parseKeywords } from '~/utils';

export type SummaryListProps = Partial<FlatListProps<PublicSummaryGroup[]>> & {
  summaries?: PublicSummaryGroup[];
  sortable?: boolean;
  sortBy?: 'date' | 'relevance';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetch?: typeof API.getSummaries | typeof API.getTopStories;
  fetchOnLoad?: boolean;
  onFormatChange?: (summary: PublicSummaryGroup, format: ReadingFormat) => void;
  filter?: string;
  interval?: string;
  specificIds?: number[];
  landscapeEnabled?: boolean;
  landscapeView?: boolean;
  big?: boolean;
  fancy?: boolean;
  headerComponent?: React.ReactNode;
  horizontal?: boolean;
  enableTts?: boolean;
};

export function SummaryList({ 
  summaries: summaries0 = [],
  sortBy: sortBy0,
  sortable = Boolean(sortBy0),
  fetch,
  fetchOnLoad = true,
  onFormatChange,
  filter: filter0,
  interval,
  specificIds,
  landscapeEnabled,
  landscapeView,
  big,
  fancy,
  headerComponent,
  enableTts,
  ...props
}: SummaryListProps) {

  // hooks
  const { navigate, navigation } = useNavigation();
  const theme = useTheme();
  const isFocused = useIsFocused();

  // contexts
  const { isTablet, screenWidth } = React.useContext(LayoutContext);
  const { queueStream } = React.useContext(MediaContext);
  const { 
    api: { 
      interactWithSummary,
      getSummaries,
      getTopStories,
    },
    preferredReadingFormat,
    removedSummaries,
    sentimentEnabled,
    excludeFilter,
  } = React.useContext(StorageContext);
  
  // search state
  const [loaded, setLoaded] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [filter, setFilter] = React.useState(filter0);
  const [lastFetchFailed, setLastFetchFailed] = React.useState(false);
  const [pageSize] = React.useState(10);
  const [cursor, setCursor] = React.useState(0);
  const [prevSortBy, setPrevSortBy] = React.useState(sortBy0);
  const [sortBy, setSortBy] = React.useState(sortBy0);
  
  const excludeIds = React.useMemo(() => {
    if (!removedSummaries || Object.keys(removedSummaries).length === 0) {
      return undefined;
    }
    return Object.keys(removedSummaries).map((k) => Number(k));
  }, [removedSummaries]);

  // display state
  const [layout, setLayout] = React.useState<LayoutRectangle>();
  const [summaries, setSummaries] = React.useState<PublicSummaryGroup[]>(summaries0);
  const [detailSummary, setDetailSummary] = React.useState<PublicSummaryGroup>();
  const [averageSentiment, setAverageSentiment] = React.useState<number>();
  const [totalResultCount, setTotalResultCount] = React.useState(0);
  const [lastActive, setLastActive] = React.useState(Date.now());

  const flatListRef = React.useRef<FlashList<PublicSummaryGroup>>(null);

  const fetchFn = React.useMemo(() => fetch ?? (sortBy === 'date' ? getSummaries : getTopStories), [fetch, getSummaries, getTopStories, sortBy]);
  
  // callbacks
  
  const resetState = (failed = false) => {
    setSummaries([]);
    setCursor(0);
    setTotalResultCount(0);
    setLoaded(false);
    setLastFetchFailed(failed);
  };

  const load = React.useCallback(async (reset = false, overrideFilter = filter) => {
    if (loading || (!loaded && !fetchOnLoad)) {
      return;
    }
    setLoaded(false);
    setLoading(true);
    if (reset) {
      resetState();
    }
    try {
      const { data, error } = await fetchFn({
        excludeIds: !specificIds && Boolean(excludeIds),
        filter: [excludeFilter, overrideFilter].filter(Boolean).join(' '),
        ids: specificIds ?? excludeIds,
        interval,
        locale: getLocale(),
        offset: reset ? 0 : cursor,
        pageSize,
      });
      if (error) {
        throw error;
      }
      if (!data || !data.rows) {
        throw new Error('Invalid response');
      }
      setCursor((prev) => data.next ?? (prev + data.rows.length));
      setTotalResultCount(data.count);
      setAverageSentiment(data.metadata?.sentiment);
      setDetailSummary((prev) => {
        if (!prev && data.count > 0) {
          return (prev = data.rows[0]);
        }
        return prev;
      });
      setSummaries((prev) => {
        const rows = data.rows.filter((n) => {
          return !(prev.some((p) => p.id === n.id)) && !(n.id in ({ ...removedSummaries })) ;
        });
        if (reset) {
          return (prev = rows);
        }
        return (prev = [...prev, ...rows]);
      });
      setLastFetchFailed(false);
    } catch (e) {
      console.error(e);
      resetState(true);
    } finally {
      setLoaded(true);
      setLoading(false);
    }
  }, [filter, loading, fetchFn, loaded, fetchOnLoad, specificIds, excludeIds, excludeFilter, interval, cursor, pageSize, removedSummaries]);

  const loadMore = React.useCallback(async () => {
    if (loading || lastFetchFailed || totalResultCount <= summaries.length) {
      return;
    }
    await load();
  }, [loading, lastFetchFailed, totalResultCount, summaries.length, load]);

  const handleMasterScroll = React.useCallback(async (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    if (loading || lastFetchFailed || totalResultCount <= summaries.length) {
      return;
    }
    const {
      layoutMeasurement, contentOffset, contentSize, 
    } = event.nativeEvent;
    const paddingToBottom = 400;
    if (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    ) {
      await loadMore();
    }
  }, [loading, lastFetchFailed, totalResultCount, summaries.length, loadMore]);
  
  const handleFormatChange = React.useCallback(
    (summary: PublicSummaryGroup, format?: ReadingFormat) => {
      interactWithSummary(summary.id, InteractionType.Read, { metadata: { format } });
      if (isTablet) {
        setDetailSummary(summary);
        flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
      } else if (onFormatChange) {
        onFormatChange(summary, format ?? preferredReadingFormat ?? ReadingFormat.Bullets);
      } else {
        navigate('summary', {
          initialFormat: format ?? preferredReadingFormat ?? ReadingFormat.Bullets,
          keywords: parseKeywords(filter),
          summary,
        });
      }
    },
    [interactWithSummary, isTablet, onFormatChange, preferredReadingFormat, navigate, filter]
  );
  
  useFocusEffect(React.useCallback(() => {
    const hideSummarySub = DeviceEventEmitter.addListener('hide-summary', (data) => {
      setSummaries((prev) => prev.filter((s) => s.id !== data.id));
    });
    const excludePublisherSub = DeviceEventEmitter.addListener('exclude-publisher', (data) => {
      setSummaries((prev) => prev.filter((s) => s.publisher.name !== data.name));
    });
    const excludeCategorySub = DeviceEventEmitter.addListener('exclude-category', (data) => {
      setSummaries((prev) => prev.filter((s) => s.category.name !== data.name));
    });
    if (!loading && !lastFetchFailed && ((!loaded && summaries.length === 0) || filter !== filter0)) {
      setFilter(filter0);
      navigation?.setOptions({
        headerTitle: () => {
          return <SearchViewController initialValue={ filter0 } />;
        },
      });
      load(true, filter0);
    } else
    if (Date.now() - lastActive.valueOf() > ms('10m')) {
      load(true);
      setLastActive(Date.now());
    } 
    return () => {
      hideSummarySub.remove();
      excludePublisherSub.remove();
      excludeCategorySub.remove();
    };
  }, [loading, lastActive, navigation, filter, filter0, lastFetchFailed, loaded, load, summaries.length]));
  
  React.useEffect(() => {
    if (!sortable || prevSortBy === sortBy) {
      return;
    }
    resetState();
    load(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [sortable, prevSortBy, sortBy]);
  
  useAppState({ 
    onBackground: () => {
      setLastActive(Date.now());
    },
    onForeground: React.useCallback(() => {
      if (!isFocused) {
        return;
      }
      if (Date.now() - lastActive.valueOf() > ms('10m')) {
        load(true);
      }
      setLastActive(Date.now());
    }, [isFocused, lastActive, load]),
  });

  const renderSummary: ListRenderItem<PublicSummaryGroup> = React.useCallback(({ item, index }) => {
    return (
      <Summary
        key={ item.id }
        big={ big || (index % 4 === 0 && fancy) }
        summary={ item }
        selected={ Boolean(landscapeEnabled && isTablet && item.id === detailSummary?.id) }
        keywords={ parseKeywords(filter) }
        onFormatChange={ (format) => handleFormatChange(item, format) } />
    );
  }, [big, fancy, landscapeEnabled, isTablet, detailSummary?.id, filter, handleFormatChange]);
  
  // sentiment meter object
  const sentimentMeter = React.useMemo(() => {
    if (!sentimentEnabled || averageSentiment == null || isNaN(averageSentiment)) {
      return null;
    }
    return (
      <Popover
        anchor={ (
          <View flexRow itemsCenter gap={ 6 }>
            <Text
              subscript
              adjustsFontSizeToFit>
              { fixedSentiment(averageSentiment) }
            </Text>
            <MeterDial 
              value={ averageSentiment }
              width={ 40 } />
          </View>
        ) }>
        <View p={ 12 }>
          <Text>{ `${totalResultCount} ${strings.results}` }</Text>
        </View>
      </Popover>
    );
  }, [averageSentiment, sentimentEnabled, totalResultCount]);

  const detailComponent = React.useMemo(() => (landscapeEnabled && isTablet && landscapeView && detailSummary) ? (
    <View flex={ 1 } flexGrow={ 1 } mr={ 12 }>
      <Summary
        summary={ detailSummary }
        key={ detailSummary.id }
        initialFormat={ preferredReadingFormat ?? ReadingFormat.Bullets }
        keywords={ parseKeywords(filter) }
        onFormatChange={ (format) => handleFormatChange(detailSummary, format) } />
      <Divider my={ 3 } />
      {(detailSummary?.siblings?.length ?? 0) > 0 && (
        <Text system h6 m={ 12 }>
          {`${strings.relatedNews} (${detailSummary?.siblings?.length})`}
        </Text>
      )}
    </View>
  ) : null, [landscapeEnabled, isTablet, landscapeView, detailSummary, preferredReadingFormat, filter, handleFormatChange]);

  return (
    <View { ...props } col onLayout={ ({ nativeEvent: { layout } }) => setLayout(layout) }>
      <View row>
        <View style={ { width: landscapeEnabled && isTablet ? Math.min((layout?.width ?? screenWidth) * 0.4, 400) : '100%' } }>
          <FlatList
            refreshControl={ (
              <RefreshControl 
                refreshing={ summaries.length === 0 && loading }
                onRefresh={ async () => await load(true) } />
            ) }
            data={ summaries }
            extraData={ detailSummary }
            renderItem={ renderSummary }
            estimatedItemSize={ big ? 362 : 126 }
            ListHeaderComponent={ (
              <React.Fragment>
                {headerComponent}
                {((sentimentEnabled && averageSentiment != null && !isNaN(averageSentiment)) || !fetch || sortable) && (
                  <View
                    beveled
                    flexRow
                    itemsCenter
                    justifyCenter
                    p={ 6 }
                    gap={ 6 }
                    bg={ theme.colors.headerBackground }
                    mx={ 12 }
                    mt={ 0 }
                    mb={ 6 }>
                    {sentimentMeter}
                    {(!fetch || sortable) && (
                      <Button 
                        contained 
                        gap={ 6 }
                        onPress={ () => {
                          setSortBy((prev) => {
                            const state = prev === 'relevance' ? 'date' : 'relevance';
                            setPrevSortBy(prev);
                            return state;
                          });
                        } }>
                        <Text>{ `${strings.sortBy}:` }</Text>
                        <Text capitalize>
                          {sortBy === 'relevance' ? strings.relevance : strings.date }
                        </Text>
                      </Button>
                    )}
                  </View>
                )}
              </React.Fragment>
            ) }
            ListHeaderComponentStyle={ { paddingTop: 12 } }
            ListFooterComponent={ () => (
              <View mb={ 12 }>
                {!loading && totalResultCount > summaries.length && (
                  <View row justifyCenter p={ 16 } pb={ 24 }>
                    <Button 
                      outlined
                      beveled
                      p={ 8 }
                      onPress={ async () => {
                        if (lastFetchFailed) {
                          await load(true);
                        } else {
                          await loadMore();
                        }
                      } }>
                      {strings.loadMore}
                    </Button>
                  </View>
                )}
                {(loading || summaries.length === 0) && (!loaded || cursor > 0) && (
                  <View row mb={ 64 }>
                    <View row justifyCenter p={ 16 } pb={ 24 }>
                      <ActivityIndicator size="large" color={ theme.colors.primary } />
                    </View>
                  </View>
                )}
                {summaries.length === 0 && !loading && loaded && (
                  <View col gap={ 12 } itemsCenter justifyCenter>
                    <Text textCenter mx={ 16 }>
                      {strings.noResults}
                      {' '}
                      🥺
                    </Text>
                    <Button 
                      itemsCenter
                      beveled 
                      outlined 
                      p={ 8 }
                      onPress={ async () => {
                        if (lastFetchFailed) {
                          await load(true);
                        } else {
                          await loadMore();
                        }
                      } }>
                      {strings.reload}
                    </Button>
                  </View>
                )}
              </View>
            ) }
            ItemSeparatorComponent={ () => <Divider my={ 3 } /> }
            onScroll={ handleMasterScroll } />
        </View>
        {detailComponent}
      </View>
      {enableTts && Platform.OS === 'android' && (
        <Button
          absolute
          h1
          zIndex={ 300 }
          bottom={ 30 }
          right={ 30 }
          contained
          opacity={ 0.95 }
          leftIcon="volume-high"
          onPress={ () => fetch ? queueStream(fetch, { filter, interval }) : undefined } />
      )}
    </View>
  );
}
