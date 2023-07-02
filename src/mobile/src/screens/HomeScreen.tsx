import React from 'react';
import {
  Animated,
  DeviceEventEmitter,
  NativeScrollEvent,
  NativeSyntheticEvent,
  SafeAreaView,
} from 'react-native';

import ms from 'ms';
import { SheetManager } from 'react-native-actions-sheet';

import {
  InteractionType,
  PublicSummaryGroup,
  PublicSummaryTranslationAttributes,
  ReadingFormat,
} from '~/api';
import {
  ActivityIndicator,
  Button,
  Icon,
  MeterDial,
  Screen,
  ScrollView,
  Summary,
  Switch,
  Text,
  View,
  WalkthroughStack,
} from '~/components';
import {
  DialogContext,
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
import { ScreenProps } from '~/screens';
import { 
  fixedSentiment, 
  lengthOf, 
  parseKeywords,
} from '~/utils';

export function HomeScreen({ 
  route,
  navigation,
}: ScreenProps<'home'>) {

  // hooks
  const { search, navigate } = useNavigation();
  const { getTopics, handleInteraction } = useSummaryClient();
  const theme = useTheme();

  // contexts
  const { shareTarget } = React.useContext(DialogContext);
  const { supportsMasterDetail } = React.useContext(LayoutContext);
  const {
    queueSummary, currentTrackIndex, preloadCount,
  } = React.useContext(MediaContext);
  const { 
    followedCategories,
    followedOutlets,
    preferredReadingFormat,
    removedSummaries,
    showOnlyCustomNews,
    sentimentEnabled,
    setPreference,
  } = React.useContext(SessionContext);
  
  // search state
  const specificIds = React.useMemo(() => (route?.params?.specificIds), [route]);
  const [loading, setLoading] = React.useState(false);
  const [lastFetchFailed, setLastFetchFailed] = React.useState(false);
  const [pageSize] = React.useState(10);
  const [page, setPage] = React.useState(0);

  const followFilter = React.useMemo(() => {
    const filters: string[] = [];
    if (lengthOf(followedCategories) > 0) {
      filters.push(['cat', Object.keys({ ...followedCategories }).join(',')].join(':'));
    }
    if (lengthOf(followedOutlets) > 0) {
      filters.push(['src', Object.keys({ ...followedOutlets }).join(',')].join(':'));
    }
    return filters.join(' ');
  }, [followedCategories, followedOutlets]);
  
  const excludeIds = React.useMemo(() => {
    if (!removedSummaries || Object.keys(removedSummaries).length === 0) {
      return undefined;
    }
    return Object.keys(removedSummaries).map((k) => Number(k));
  }, [removedSummaries]);

  // display state
  const [summaries, setSummaries] = React.useState<PublicSummaryGroup[]>([]);
  const [detailSummary, setDetailSummary] = React.useState<PublicSummaryGroup>();
  const [translations, setTranslations] = React.useState<Record<number, PublicSummaryTranslationAttributes[]>>({});
  const [translationOn, setTranslationOn] = React.useState<Record<number, boolean>>({});
  const [totalResultCount, setTotalResultCount] = React.useState(0);
  const [averageSentiment, setAverageSentiment] = React.useState<number>();
  const [showWalkthroughs, setShowWalkthroughs] = React.useState(true);
  const [_lastFocus, setLastFocus] = React.useState<'master'|'detail'>('master');
  const [lastActive, setLastActive] = React.useState(Date.now());

  // animation state
  const resizeAnimation = React.useRef(new Animated.Value(supportsMasterDetail ? 0 : 1)).current;
  const [resizing, setResizing] = React.useState(false);

  // callbacks

  const load = React.useCallback(async (page: number) => {
    if (loading) {
      return;
    }
    setLoading(true);
    if (page === 0) {
      setSummaries([]);
      setDetailSummary(undefined);
    }
    try {
      const { data, error } = await getTopics(
        undefined,
        specificIds ?? excludeIds,
        !specificIds && Boolean(excludeIds),
        undefined,
        '1d',
        getLocale(),
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
      setTotalResultCount(data.count);
      setDetailSummary((prev) => {
        if (!prev && data.count > 0) {
          return (prev = data.rows[0]);
        }
        return prev;
      });
      setSummaries((prev) => {
        const rows = data.rows.filter((n, i) => {
          return !(prev.some((p) => p.id === n.id)) && !(n.id in ({ ...removedSummaries })) ;
        });
        if (page === 0) {
          return (prev = rows);
        }
        return (prev = [...prev, ...rows]);
      });
      setPage(page);
      setAverageSentiment(data.metadata?.sentiment);
      setLastFetchFailed(false);
    } catch (e) {
      console.error(e);
      setSummaries([]);
      setTotalResultCount(0);
      setLastFetchFailed(true);
    } finally {
      setLoading(false);
    }
  }, [loading, followFilter, getTopics, specificIds, excludeIds, pageSize, removedSummaries]);
  
  const handlePlayAll = React.useCallback(async () => {
    if (summaries.length < 1) {
      return;
    }
    queueSummary(summaries);
    summaries.forEach((summary) => {
      handleInteraction(summary, InteractionType.Listen);
    });
  }, [summaries, queueSummary, handleInteraction]);

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
    (summary: PublicSummaryGroup, format?: ReadingFormat) => {
      handleInteraction(summary, InteractionType.Read, undefined, { format });
      if (supportsMasterDetail) {
        setDetailSummary(summary);
        setLastFocus('detail');
      } else {
        navigation?.push('summary', {
          initialFormat: format ?? preferredReadingFormat ?? ReadingFormat.Summary,
          initiallyTranslated: Boolean(translationOn[summary.id]),
          summary: summary.id,
        });
      }
    },
    [handleInteraction, navigation, translations, preferredReadingFormat, supportsMasterDetail, translationOn]
  );
  
  const onLocalize = React.useCallback((summary: PublicSummaryGroup, translations: PublicSummaryTranslationAttributes[]) => {
    setTranslations((prev) => {
      const state = { ...prev };
      state[summary.id] = translations;
      return (prev = state);
    });
  }, []);
  
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

  const handleDetailScroll = React.useCallback(async (_event: NativeSyntheticEvent<NativeScrollEvent>) => {
    setLastFocus('detail');
  }, []);

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

  const loadMoreAsNeeded = React.useCallback(async () => {
    if (!currentTrackIndex) {
      return;
    }
    if (currentTrackIndex + preloadCount > summaries.length) {
      await loadMore('autoloaded-for-track');
    }
  }, [currentTrackIndex, loadMore, preloadCount, summaries]);
  
  const showSearch = React.useCallback(() => {
    SheetManager.show('search', ({ payload: { onSubmit: (text?: string) => text?.trim() && search({ prefilter: text }) } }));
  }, [search]);

  const onMount = React.useCallback(() => {
    setPage(0);
    load(0);
  }, [load]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => handleResize(), [
    handleResize,
    supportsMasterDetail, 
    detailSummary, 
    loading,
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
  
  React.useEffect(() => {
    const subscriber = DeviceEventEmitter.addListener('apply-filter', (value: boolean) => {
      setOnlyCustomNews(value); 
    });
    return () => { 
      subscriber.remove();
    };
  }, [load]);
  
  useAppState({ 
    onBackground: () => {
      setLastActive(Date.now());
    },
    onForeground: React.useCallback(() => {
      if (Date.now() - lastActive.valueOf() > ms('10m')) {
        load(0);
      }
    }, [lastActive, load]),
  });

  // components

  const summaryList = React.useMemo(() => {
    return summaries.map((summary) => (
      <Summary
        key={ summary.id }
        summary={ summary }
        selected={ Boolean(supportsMasterDetail && summary.id === detailSummary?.id) }
        onFormatChange={ (format) => handleFormatChange(summary, format) }
        onInteract={ (...e) => handleInteraction(summary, ...e) }
        onLocalize={ (translations) => onLocalize(summary, translations) }
        onToggleTranslate={ (onOrOff) => setTranslationOn((prev) => {
          const state = { ...prev };
          state[summary.id] = onOrOff;
          return (prev = state);
        }) } />
    ));
  }, [detailSummary?.id, onLocalize, handleFormatChange, handleInteraction, shareTarget, summaries, supportsMasterDetail]);

  return (
    <Screen>
      <View col>
        <View col>
          <View row>
            <Animated.View style={ { width: supportsMasterDetail ? '40%' : '100%' } }>
              <ScrollView
                refreshing={ summaries.length === 0 && loading }
                onScroll={ handleMasterScroll }
                onRefresh={ () => {
                  setPage(0);
                  load(0);
                } }>
                <View col width="100%" pt={ 12 }>
                  {showWalkthroughs && (
                    <WalkthroughStack 
                      onClose={ () => setShowWalkthroughs(false) } />
                  )}
                  {summaryList}
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
                  {loading && (
                    <View row mb={ 64 }>
                      <View row justifyCenter p={ 16 } pb={ 24 }>
                        <ActivityIndicator size="large" color={ theme.colors.primary } />
                      </View>
                    </View>
                  )}
                  {summaries.length === 0 && !loading && (
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
                        onPress={ () => load(0) }>
                        {strings.search_reload}
                      </Button>
                    </View>
                  )}
                </View>
              </ScrollView>
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
      {summaries.length > 0 && (
        <SafeAreaView>
          <View absolute right={ 16 } bottom={ 24 } gap={ 12 }>          
            <Button
              elevated
              contained
              opacity={ 0.9 }
              p={ 12 }
              haptic
              leftIcon="volume-high"
              iconSize={ 32 }
              onPress={ handlePlayAll } />
            <Button
              elevated
              contained
              opacity={ 0.9 }
              p={ 12 }
              haptic
              leftIcon="magnify"
              iconSize={ 32 }
              onPress={ showSearch } />
          </View>
        </SafeAreaView>
      )}
    </Screen>
  );
}
