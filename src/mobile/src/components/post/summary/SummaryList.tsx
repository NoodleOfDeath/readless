import React from 'react';
import { 
  DeviceEventEmitter,
  InteractionManager,
  LayoutRectangle,
  NativeScrollEvent, 
  NativeSyntheticEvent,
  Platform,
  RefreshControl,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
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
import { parseKeywords } from '~/utils';

export type SummaryListProps = Partial<FlatListProps<PublicSummaryGroup[]>> & {
  summaries?: PublicSummaryGroup[];
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetch?: typeof API.getSummaries | typeof API.getTopStories;
  fetchOnLoad?: boolean;
  onFormatChange?: (summary: PublicSummaryGroup, format: ReadingFormat) => void;
  filter?: string;
  interval?: string;
  specificIds?: number[];
  landscapeEnabled?: boolean;
  big?: boolean;
  fancy?: boolean;
  headerComponent?: React.ReactNode;
  horizontal?: boolean;
  enableTts?: boolean;
};

export function SummaryList({ 
  summaries: summaries0 = [],
  fetch,
  fetchOnLoad = true,
  onFormatChange,
  filter: filter0,
  interval,
  specificIds,
  landscapeEnabled,
  big,
  fancy,
  headerComponent,
  enableTts,
  ...props
}: SummaryListProps) {

  // hooks
  const { navigate, navigation } = useNavigation();
  const theme = useTheme();

  // contexts
  const { isTablet, screenWidth } = React.useContext(LayoutContext);
  const { queueStream } = React.useContext(MediaContext);
  const { 
    api: { interactWithSummary },
    preferredReadingFormat,
    removedSummaries,
    excludeFilter,
  } = React.useContext(StorageContext);
  
  // search state
  const [loaded, setLoaded] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
  const [filter, setFilter] = React.useState(filter0);
  const [lastFetchFailed, setLastFetchFailed] = React.useState(false);
  const [pageSize] = React.useState(10);
  const [cursor, setCursor] = React.useState(0);
  
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
  const [totalResultCount, setTotalResultCount] = React.useState(0);
  const [lastActive, setLastActive] = React.useState(Date.now());

  const detailSummarySiblings = React.useMemo(() => {
    return [...(detailSummary?.siblings ?? [])].sort((a, b) => new Date(b.originalDate ?? '').valueOf() - new Date(a.originalDate ?? '').valueOf());
  }, [detailSummary?.siblings]);

  const flatListRef = React.useRef<FlashList<PublicSummaryGroup>>(null);

  // callbacks

  const load = React.useCallback(async (reset = false, overrideFilter = filter) => {
    if (loading) {
      return;
    }
    if (!fetch || (!loaded && !fetchOnLoad)) {
      return;
    }
    setLoaded(false);
    setLoading(true);
    if (reset) {
      setSummaries([]);
      setCursor(0);
      setDetailSummary(undefined);
    }
    try {
      const { data, error } = await fetch({
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
      setSummaries([]);
      setCursor(0);
      setTotalResultCount(0);
      setLoaded(false);
      setLastFetchFailed(true);
    } finally {
      setLoaded(true);
      setLoading(false);
    }
  }, [filter, loading, fetch, loaded, fetchOnLoad, specificIds, excludeIds, excludeFilter, interval, cursor, pageSize, removedSummaries]);

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
    const interaction = InteractionManager.runAfterInteractions(() => {
      if (!loading && !lastFetchFailed && ((!loaded && summaries.length === 0) || filter !== filter0)) {
        setFilter(filter0);
        navigation?.setOptions({
          headerTitle: () => {
            return <SearchViewController initialValue={ filter0 } />;
          },
        });
        load(true, filter0);
      }
    });
    return () => {
      hideSummarySub.remove();
      excludePublisherSub.remove();
      excludeCategorySub.remove();
      interaction.cancel();
    };
  }, [loading, navigation, filter, filter0, lastFetchFailed, loaded, load, summaries.length]));
  
  useAppState({ 
    onBackground: () => {
      setLastActive(Date.now());
    },
    onForeground: React.useCallback(() => {
      if (Date.now() - lastActive.valueOf() > ms('10m')) {
        load(true);
      }
    }, [lastActive, load]),
  });

  const renderSummary: ListRenderItem<PublicSummaryGroup> = React.useCallback(({ item, index }) => {
    return (
      <Summary
        mx={ 12 }
        mb={ 12 }
        key={ item.id }
        big={ big || (index % 4 === 0 && fancy) }
        summary={ item }
        selected={ Boolean(landscapeEnabled && isTablet && item.id === detailSummary?.id) }
        keywords={ parseKeywords(filter) }
        onFormatChange={ (format) => handleFormatChange(item, format) } />
    );
  }, [big, fancy, landscapeEnabled, isTablet, detailSummary?.id, filter, handleFormatChange]);

  const detailComponent = React.useMemo(() => (landscapeEnabled && isTablet && detailSummary) ? (
    <React.Fragment>
      <Summary
        summary={ detailSummary }
        key={ detailSummary.id }
        initialFormat={ preferredReadingFormat ?? ReadingFormat.Bullets }
        keywords={ parseKeywords(filter) }
        onFormatChange={ (format) => handleFormatChange(detailSummary, format) } />
      <Divider my={ 6 } />
      {detailSummarySiblings.length > 0 && (
        <Text system h6 m={ 12 }>
          {`${strings.relatedNews} (${detailSummarySiblings.length})`}
        </Text>
      )}
    </React.Fragment>
  ) : null, [landscapeEnabled, isTablet, detailSummary, preferredReadingFormat, filter, detailSummarySiblings.length, handleFormatChange ]);

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
            ListHeaderComponent={ <React.Fragment>{headerComponent}</React.Fragment> }
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
            onScroll={ handleMasterScroll } />
        </View>
        {landscapeEnabled && isTablet && (
          <View flex={ 1 } flexGrow={ 1 } mr={ 12 }>
            <FlatList
              ref={ flatListRef }
              data={ detailSummarySiblings }
              renderItem={ ({ item }) => (
                <Summary
                  mx={ 12 }
                  key={ item.id }
                  summary={ item } 
                  hideArticleCount
                  keywords={ parseKeywords(filter) }
                  onFormatChange={ (format) => handleFormatChange(item, format) } />
              ) }
              ItemSeparatorComponent={ () => <View my={ 6 } /> }
              ListHeaderComponent={ detailComponent }
              ListFooterComponentStyle={ { paddingBottom: 64 } } />
          </View>
        )}
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
