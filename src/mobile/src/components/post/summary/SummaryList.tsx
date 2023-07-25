import React from 'react';
import { NativeScrollEvent, NativeSyntheticEvent } from 'react-native';

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
  ChildlessViewProps,
  Divider,
  FlatList,
  Summary,
  Text,
  View,
} from '~/components';
import {
  LayoutContext,
  MediaContext,
  SessionContext,
} from '~/contexts';
import {
  useAppState,
  useNavigation,
  useSummaryClient,
  useTheme,
} from '~/hooks';
import { getLocale, strings } from '~/locales';
import { parseKeywords } from '~/utils';

export type SummaryListProps = ChildlessViewProps & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  fetch: typeof API.getSummaries | typeof API.getTopStories;
  onFormatChange?: (summary: PublicSummaryGroup, format: ReadingFormat) => void;
  filter?: string;
  interval?: string;
  specificIds?: number[];
  searchText?: string;
  flow?: 'fluid' | 'fixed';
  fluid?: boolean;
  fixed?: boolean;
  headerComponent?: React.ReactNode;
};

export function SummaryList({ 
  fetch,
  onFormatChange,
  filter: filter0,
  interval,
  specificIds,
  searchText,
  fixed,
  fluid = !fixed,
  flow = fluid ? 'fluid' : 'fixed',
  headerComponent,
  ...props
}: SummaryListProps) {

  // hooks
  const { navigation } = useNavigation();
  const { handleInteraction } = useSummaryClient();
  const theme = useTheme();

  // contexts
  const { isTablet, dimensions: { width: screenWidth } } = React.useContext(LayoutContext);
  const { queueStream } = React.useContext(MediaContext);
  const { 
    preferredReadingFormat,
    removedSummaries,
  } = React.useContext(SessionContext);
  
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
  const [summaries, setSummaries] = React.useState<PublicSummaryGroup[]>([]);
  const [detailSummary, setDetailSummary] = React.useState<PublicSummaryGroup>();
  const [totalResultCount, setTotalResultCount] = React.useState(0);
  const [lastActive, setLastActive] = React.useState(Date.now());

  const detailSummarySiblings = React.useMemo(() => {
    return [...(detailSummary?.siblings ?? [])].sort((a, b) => new Date(b.originalDate ?? '').valueOf() - new Date(a.originalDate ?? '').valueOf());
  }, [detailSummary?.siblings]);

  const flatListRef = React.useRef<FlashList<PublicSummaryGroup>>(null);

  // callbacks

  const load = React.useCallback(async (reset = false) => {
    if (loading) {
      return;
    }
    setLoading(true);
    if (reset) {
      setSummaries([]);
      setCursor(0);
      setDetailSummary(undefined);
    }
    try {
      const { data, error } = await fetch({
        excludeIds: !specificIds && Boolean(excludeIds),
        filter,
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
  }, [loading, fetch, specificIds, excludeIds, filter, interval, cursor, pageSize, removedSummaries]);

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
      handleInteraction(summary, InteractionType.Read, undefined, { format });
      if (isTablet) {
        setDetailSummary(summary);
        flatListRef.current?.scrollToOffset({ animated: true, offset: 0 });
      } else if (onFormatChange) {
        onFormatChange(summary, format ?? preferredReadingFormat ?? ReadingFormat.Summary);
      } else {
        navigation?.push('summary', {
          initialFormat: format ?? preferredReadingFormat ?? ReadingFormat.Summary,
          keywords: parseKeywords(searchText),
          summary,
        });
      }
    },
    [handleInteraction, navigation, onFormatChange, preferredReadingFormat, searchText, isTablet]
  );
  
  useFocusEffect(React.useCallback(() => {
    if (!loading && !lastFetchFailed && !loaded && (summaries.length === 0 || filter !== filter0)) {
      load(true);
      setFilter(filter0);
    }
  }, [loading, filter, filter0, lastFetchFailed, loaded, load, summaries.length]));
  
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
        key={ item.id }
        big={ Boolean(flow === 'fluid' && index % 4 === 0 && item.media?.imageArticle) }
        summary={ item }
        selected={ Boolean(isTablet && item.id === detailSummary?.id) }
        keywords={ filter?.split(' ') }
        onFormatChange={ (format) => handleFormatChange(item, format) }
        onInteract={ (...e) => handleInteraction(item, ...e) } />
    );
  }, [flow, isTablet, detailSummary?.id, filter, handleFormatChange, handleInteraction]);

  const detailComponent = React.useMemo(() => detailSummary && (
    <React.Fragment>
      <Summary
        summary={ detailSummary }
        key={ detailSummary.id }
        initialFormat={ preferredReadingFormat ?? ReadingFormat.Summary }
        keywords={ searchText?.split(' ') }
        onFormatChange={ (format) => handleFormatChange(detailSummary, format) }
        onInteract={ (...e) => handleInteraction(detailSummary, ...e) } />
      <Divider my={ 6 } />
      {detailSummarySiblings.length > 0 && (
        <Text system h6 m={ 12 }>
          {`${strings.summary_relatedNews} (${detailSummarySiblings.length})`}
        </Text>
      )}
    </React.Fragment>
  ), [detailSummary, detailSummarySiblings.length, handleFormatChange, handleInteraction, preferredReadingFormat, searchText]);

  return (
    <View { ...props } col>
      <View row>
        <View style={ { width: isTablet ? Math.min(screenWidth * 0.4, 400) : '100%' } }>
          <FlatList
            data={ summaries }
            extraData={ detailSummary }
            renderItem={ renderSummary }
            estimatedItemSize={ flow === 'fluid' ? (114 * 3 + 350) / 4 : 114 }
            ItemSeparatorComponent={ () => <Divider mx={ 12 } my={ 6 } /> }
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
                      {strings.search_loadMore}
                    </Button>
                  </View>
                )}
                {(loading || summaries.length === 0) && !loaded && (
                  <View row mb={ 64 }>
                    <View row justifyCenter p={ 16 } pb={ 24 }>
                      <ActivityIndicator size="large" color={ theme.colors.primary } />
                    </View>
                  </View>
                )}
                {summaries.length === 0 && !loading && loaded && (
                  <View col gap={ 12 } itemsCenter justifyCenter>
                    <Text textCenter mx={ 16 }>
                      {strings.search_noResults}
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
                      {strings.search_reload}
                    </Button>
                  </View>
                )}
              </View>
            ) }
            refreshing={ summaries.length === 0 && loading && !loaded }
            onScroll={ handleMasterScroll }
            onRefresh={ async () => {
              await load(true);
            } } />
        </View>
        {isTablet && (
          <View flexGrow={ 1 } mr={ 12 }>
            <FlatList
              ref={ flatListRef }
              data={ detailSummarySiblings }
              renderItem={ ({ item }) => (
                <Summary
                  mx={ 12 }
                  key={ item.id }
                  summary={ item } 
                  hideArticleCount
                  onFormatChange={ (format) => handleFormatChange(item, format) }
                  onInteract={ (...e) => handleInteraction(item, ...e) } />
              ) }
              ItemSeparatorComponent={ () => <Divider mx={ 12 } my={ 6 } /> }
              ListHeaderComponent={ detailComponent }
              ListFooterComponentStyle={ { paddingBottom: 64 } }
              estimatedItemSize={ 114 } />
          </View>
        )}
      </View>
      <Button
        absolute
        h1
        zIndex={ 300 }
        bottom={ 30 }
        right={ 30 }
        contained
        opacity={ 0.95 }
        leftIcon="volume-high"
        onPress={ () => queueStream(fetch, { filter, interval }) } />
    </View>
  );
}
