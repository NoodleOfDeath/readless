import React from 'react';
import {
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { ListRenderItem } from '@shopify/flash-list';
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
  ScrollView,
  Summary,
  Text,
  View,
  WalkthroughStack,
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
  showWalkthroughs?: boolean;
};

export function SummaryList({ 
  fetch,
  onFormatChange,
  filter: filter0,
  interval,
  specificIds,
  searchText,
  showWalkthroughs: showWalkthroughs0,
  ...props
}: SummaryListProps) {

  // hooks
  const { navigation } = useNavigation();
  const { handleInteraction } = useSummaryClient();
  const theme = useTheme();

  // contexts
  const { supportsMasterDetail } = React.useContext(LayoutContext);
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
  const [translationOn, setTranslationOn] = React.useState<Record<number, boolean>>({});
  const [showWalkthroughs, setShowWalkthroughs] = React.useState(showWalkthroughs0);
  const [_lastFocus, setLastFocus] = React.useState<'master'|'detail'>('master');
  const [lastActive, setLastActive] = React.useState(Date.now());

  const detailSummarySiblings = React.useMemo(() => {
    return [...(detailSummary?.siblings ?? [])].sort((a, b) => new Date(b.originalDate ?? '').valueOf() - new Date(a.originalDate ?? '').valueOf());
  }, [detailSummary?.siblings]);

  // animation state
  const resizeAnimation = React.useRef(new Animated.Value(supportsMasterDetail ? 0 : 1)).current;
  const [resizing, setResizing] = React.useState(false);

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
    if (lastFetchFailed || totalResultCount <= summaries.length) {
      return;
    }
    await load();
  }, [lastFetchFailed, totalResultCount, summaries.length, load]);

  const handleMasterScroll = React.useCallback(async (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setLastFocus('master');
    if (totalResultCount <= summaries.length) {
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
  }, [totalResultCount, summaries.length, loadMore]);

  const handleResize = React.useCallback(() => {
    if (resizing) {
      return;
    }
    setResizing(true);
    Animated.spring(resizeAnimation, {
      toValue: supportsMasterDetail ? 0 : 1,
      useNativeDriver: true,
    }).start(() => {
      setResizing(false);
    });
  }, [resizing, resizeAnimation, supportsMasterDetail]);
  
  const handleFormatChange = React.useCallback(
    (summary: PublicSummaryGroup, format?: ReadingFormat) => {
      handleInteraction(summary, InteractionType.Read, undefined, { format });
      if (supportsMasterDetail) {
        setDetailSummary(summary);
        setLastFocus('detail');
      } else if (onFormatChange) {
        onFormatChange(summary, format ?? preferredReadingFormat ?? ReadingFormat.Summary);
      } else {
        navigation?.push('summary', {
          initialFormat: format ?? preferredReadingFormat ?? ReadingFormat.Summary,
          initiallyTranslated: Boolean(translationOn[summary.id]),
          keywords: parseKeywords(searchText),
          summary,
        });
      }
    },
    [handleInteraction, navigation, onFormatChange, preferredReadingFormat, searchText, supportsMasterDetail, translationOn]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useFocusEffect(React.useCallback(() => handleResize(), [
    handleResize,
    supportsMasterDetail, 
    summaries,
  ]));
  
  useFocusEffect(React.useCallback(() => {
    if (lastFetchFailed) {
      return;
    }
    if (summaries.length === 0 || (filter !== filter0)) {
      load(true);
    }
    if (filter0) {
      navigation?.setOptions({ headerTitle: filter0 });
    }
    setFilter(filter0);
  }, [filter, filter0, lastFetchFailed, load, navigation, summaries.length]));
  
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
        big={ index % 4 === 0 }
        summary={ item }
        selected={ Boolean(supportsMasterDetail && item.id === detailSummary?.id) }
        keywords={ filter?.split(' ') }
        onFormatChange={ (format) => handleFormatChange(item, format) }
        onInteract={ (...e) => handleInteraction(item, ...e) }
        onToggleTranslate={ (onOrOff) => setTranslationOn((prev) => {
          const state = { ...prev };
          state[item.id] = onOrOff;
          return (prev = state);
        }) } />
    );
  }, [supportsMasterDetail, detailSummary?.id, filter, handleFormatChange, handleInteraction]);

  return (
    <View { ...props } col>
      <View row>
        <View style={ { width: supportsMasterDetail ? '40%' : '100%' } }>
          <FlatList
            data={ summaries }
            renderItem={ renderSummary }
            estimatedItemSize={ (114 * 3 + 350) / 4 }
            ItemSeparatorComponent={ () => <Divider mx={ 12 } my={ 6 } /> }
            ListHeaderComponent={ () => (
              <View mt={ 12 }>
                {showWalkthroughs && (
                  <WalkthroughStack
                    width="100%"
                    height={ 200 }
                    onClose={ () => setShowWalkthroughs(false) } />
                )}
              </View>
            ) }
            ListFooterComponent={ () => (
              <View mb={ 12 }>
                {!loading && totalResultCount > summaries.length && (
                  <View row justifyCenter p={ 16 } pb={ 24 }>
                    <Button 
                      outlined
                      rounded
                      p={ 8 }
                      onPress={ () => loadMore() }>
                      {strings.search_loadMore}
                    </Button>
                  </View>
                )}
                {(loading || summaries.length === 0) && (
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
                      rounded 
                      outlined 
                      p={ 8 }
                      onPress={ () => load(true) }>
                      {strings.search_reload}
                    </Button>
                  </View>
                )}
              </View>
            ) }
            refreshing={ summaries.length === 0 && loading && !loaded }
            onScroll={ handleMasterScroll }
            onRefresh={ () => {
              load(true);
            } } />
        </View>
        <Animated.View style={ {
          transform: [
            { perspective: 1000 }, 
            {
              rotateY: resizeAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: ['0deg', '360deg'],
              }),
            },
            {
              scaleX: resizeAnimation.interpolate({
                inputRange: [0, 1],
                outputRange: [1, 0],
              }),
            }, 
          ],
          width: '60%',
        } }>
          {supportsMasterDetail && detailSummary && (
            <ScrollView>
              <FlatList
                data={ detailSummarySiblings }
                renderItem={ ({ item }) => (
                  <Summary
                    mx={ 12 }
                    summary={ item } 
                    hideArticleCount
                    onFormatChange={ (format) => handleFormatChange(item, format) }
                    onInteract={ (...e) => handleInteraction(item, ...e) } />
                ) }
                keyExtractor={ (item) => `${item.id}` }
                ItemSeparatorComponent={ () => <Divider mx={ 12 } my={ 6 } /> }
                ListHeaderComponent={ (
                  <React.Fragment>
                    <Summary
                      summary={ detailSummary }
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
                ) }
                ListFooterComponentStyle={ { paddingBottom: 64 } }
                estimatedItemSize={ 114 } />
            </ScrollView>
          )}
        </Animated.View>
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
