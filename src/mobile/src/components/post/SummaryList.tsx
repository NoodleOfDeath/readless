import React from 'react';
import {
  Animated,
  DeviceEventEmitter,
  ListRenderItem,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import ms from 'ms';

import {
  AuthError,
  BulkMetadataResponsePublicSummaryGroupSentimentNumber,
  HttpResponse,
  InteractionType,
  InternalError,
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
  fetch: (...args: any[]) => Promise<HttpResponse<BulkMetadataResponsePublicSummaryGroupSentimentNumber, AuthError | InternalError>>;
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
  filter,
  interval = '100y',
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
  const {
    queueSummary, currentTrackIndex, preloadCount,
  } = React.useContext(MediaContext);
  const { 
    preferredReadingFormat,
    removedSummaries,
  } = React.useContext(SessionContext);
  
  // search state
  const [loaded, setLoaded] = React.useState(false);
  const [loading, setLoading] = React.useState(false);
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
      const { data, error } = await fetch(
        filter,
        specificIds ?? excludeIds,
        !specificIds && Boolean(excludeIds),
        undefined,
        interval,
        getLocale(),
        undefined,
        pageSize,
        reset ? 0 : cursor
      );
      if (error) {
        console.error(error);
        return;
      }
      if (!data) {
        return;
      }
      setCursor((prev) => data.next ?? (prev + pageSize));
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
  }, [loading, fetch, filter, specificIds, excludeIds, interval, pageSize, cursor, removedSummaries]);

  const loadMore = React.useCallback(async (event?: string) => {
    if (loading || totalResultCount <= summaries.length) {
      return;
    }
    await load();
    if (event) {
      DeviceEventEmitter.emit(event);
    }
  }, [load, loading, totalResultCount, summaries]);

  const loadMoreAsNeeded = React.useCallback(async () => {
    if (!currentTrackIndex) {
      return;
    }
    if (currentTrackIndex + preloadCount > summaries.length) {
      await loadMore('autoloaded-for-track');
    }
  }, [currentTrackIndex, loadMore, preloadCount, summaries]);

  const handleMasterScroll = React.useCallback(async (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setLastFocus('master');
    if (loading || totalResultCount <= summaries.length || lastFetchFailed) {
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
      await loadMore('autoloaded');
    }
  }, [loading, totalResultCount, summaries.length, loadMore, lastFetchFailed]);

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
          summary: summary.id,
        });
      }
    },
    [handleInteraction, navigation, onFormatChange, preferredReadingFormat, searchText, supportsMasterDetail, translationOn]
  );

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => handleResize(), [
    handleResize,
    supportsMasterDetail, 
    summaries,
  ]);

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
    return () => { 
      subscriber.remove();
    };
  }, [loadMore]);
  
  useFocusEffect(React.useCallback(() => {
    if (summaries.length === 0) {
      load(true);
    }
    if (filter) {
      navigation?.setOptions({ headerTitle: filter });
    }
  }, [filter, load, navigation, summaries.length]));
  
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

  const otherComponents = React.useMemo(() => {
    const components: React.ReactNode[] = [];
    if (showWalkthroughs) {
      components.push(
        <WalkthroughStack
          onClose={ () => setShowWalkthroughs(false) } />
      );
    }
    if (!loading && totalResultCount > summaries.length) {
      components.push(
        <View row justifyCenter p={ 16 } pb={ 24 }>
          <Button 
            outlined
            rounded
            p={ 8 }
            onPress={ () => loadMore() }>
            {strings.search_loadMore}
          </Button>
        </View>
      );
    }
    if (loading) {
      components.push (
        <View row mb={ 64 }>
          <View row justifyCenter p={ 16 } pb={ 24 }>
            <ActivityIndicator size="large" color={ theme.colors.primary } />
          </View>
        </View>
      );
    }
    if (summaries.length === 0 && !loading && loaded) {
      components.push (
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
      );
    }
    return components;
  }, [showWalkthroughs, loading, totalResultCount, summaries.length, loaded, loadMore, theme.colors.primary, load]);

  const renderSummary: ListRenderItem<PublicSummaryGroup> = React.useCallback(({ item, index }) => {
    return (
      <React.Fragment>
        <Summary
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
        <Divider my={ 6 } />
      </React.Fragment>
    );
  }, [supportsMasterDetail, detailSummary?.id, filter, handleFormatChange, handleInteraction]);

  return (
    <View { ...props } col>
      <View col>
        <View col>
          <View row>
            <Animated.View style={ { width: supportsMasterDetail ? '40%' : '100%' } }>
              <FlatList
                p={ 12 }
                data={ summaries }
                renderItem={ renderSummary }
                refreshing={ summaries.length === 0 && loading }
                onScroll={ handleMasterScroll }
                onRefresh={ () => {
                  load(true);
                } } />
            </Animated.View>
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
              <View
                mt={ 12 }
                px={ 12 }>
                {detailSummary && (
                  <Summary
                    summary={ detailSummary }
                    initialFormat={ preferredReadingFormat ?? ReadingFormat.Summary }
                    onFormatChange={ (format) => handleFormatChange(detailSummary, format) }
                    onInteract={ (...e) => handleInteraction(detailSummary, ...e) } />
                )}
              </View>
            </Animated.View>
          </View>
        </View>
      </View>
    </View>
  );
}
