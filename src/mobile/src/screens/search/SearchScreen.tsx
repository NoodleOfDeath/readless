import React from 'react';
import {
  Animated,
  DeviceEventEmitter,
  NativeScrollEvent,
  NativeSyntheticEvent,
  SafeAreaView,
} from 'react-native';

import { SearchMenu } from './SearchMenu';

import {
  InteractionType,
  PublicSummaryGroups,
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
  TopicSampler,
  View,
} from '~/components';
import {
  DialogContext,
  LayoutContext,
  MediaContext,
  SessionContext,
} from '~/contexts';
import {
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

export function SearchScreen({ 
  route,
  navigation,
}: ScreenProps<'search'>) {
  const { 
    bookmarkedCategories,
    bookmarkedOutlets,
    preferredReadingFormat,
    removedSummaries,
    showOnlyCustomNews,
    setPreference,
  } = React.useContext(SessionContext);
  const {
    queueSummary, currentTrackIndex, preloadCount,
  } = React.useContext(MediaContext);
  const { shareTarget } = React.useContext(DialogContext);
  const { getSummaries, handleInteraction } = useSummaryClient();
  const { supportsMasterDetail } = React.useContext(LayoutContext);
  const { search, openBrowse } = useNavigation();
  const theme = useTheme();
  
  const prefilter = React.useMemo(() => route?.params?.prefilter, [route?.params?.prefilter]);
  const specificIds = React.useMemo(() => (route?.params?.specificIds), [route]);

  const [onlyCustomNews, setOnlyCustomNews] = React.useState(Boolean((!prefilter && showOnlyCustomNews) || route?.params?.onlyCustomNews));
  const [loading, setLoading] = React.useState(false);
  const [lastFetchFailed, setLastFetchFailed] = React.useState(false);
  const [summaries, setSummaries] = React.useState<PublicSummaryGroups[]>([]);
  const [translations, setTranslations] = React.useState<Record<number, PublicSummaryTranslationAttributes[]>>({});
  const [translationOn, setTranslationOn] = React.useState<Record<number, boolean>>({});
  const [totalResultCount, setTotalResultCount] = React.useState(0);
  const [averageSentiment, setAverageSentiment] = React.useState<number>();

  const [pageSize] = React.useState(10);
  const [page, setPage] = React.useState(0);
  const [searchText, setSearchText] = React.useState('');
  const [keywords, setKeywords] = React.useState<string[]>([]);
  const [detailSummary, setDetailSummary] = React.useState<PublicSummaryGroups>();

  const resizeAnimation = React.useRef(new Animated.Value(supportsMasterDetail ? 0 : 1)).current;
  const [resizing, setResizing] = React.useState(false);

  const [_lastFocus, setLastFocus] = React.useState<'master'|'detail'>('master');

  const followFilter = React.useMemo(() => {
    const filters: string[] = [];
    if (lengthOf(bookmarkedCategories) > 0) {
      filters.push(['cat', Object.values(bookmarkedCategories ?? {})
        .map((c) => c?.item?.name).filter(Boolean).join(',')].join(':'));
    }
    if (lengthOf(bookmarkedOutlets) > 0) {
      filters.push(['src', Object.values(bookmarkedOutlets ?? {})
        .map((o) => o?.item?.name).filter(Boolean).join(',')].join(':'));
    }
    return filters.join(' ');
  }, [bookmarkedCategories, bookmarkedOutlets]);
  
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
    if (loading) {
      return;
    }
    setLoading(true);
    if (page === 0) {
      setSummaries([]);
      setDetailSummary(undefined);
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
        undefined,
        undefined,
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
        const rows = data.rows.reverse().filter((n, i) => {
          const children = [...data.rows].slice(i).map((r) => r.siblings ?? []).flat();
          return !(prev.some((p) => p.id === n.id || (!prefilter && p.siblings?.some((s) => n.id === s.id))) || (!prefilter && children.some((c) => n.id === c.id)));
        }).reverse();
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
  }, [loading, onlyCustomNews, followFilter, searchText, prefilter, getSummaries, specificIds, excludeIds, pageSize]);

  React.useEffect(() => {
    if (prefilter) {
      setSearchText(prefilter + ' ');
      navigation?.setOptions({ 
        headerBackTitle: '',
        headerBackVisible: true,
        headerShown: true,
        headerTitle: () => (
          <View row gap={ 6 }>
            <Icon name="magnify" size={ 24 } />
            <Text>{prefilter}</Text>
          </View>
        ),
      });
      setKeywords(parseKeywords(prefilter));
    } else {
      setSearchText('');
      navigation?.setOptions({ 
        headerBackVisible: false,
        headerShown: true,
        headerTitle: () => (
          <Switch 
            leftLabel={ <Icon name="filter-off" size={ 24 } /> }
            rightLabel={ <Icon name="filter-check" size={ 24 } /> }
            value={ onlyCustomNews }
            onValueChange={ (value) => {
              setOnlyCustomNews(value);
              if (!prefilter) {
                setPreference('showOnlyCustomNews', value);
              }
            } } />
        ),
      });
    }
  }, [navigation, route, prefilter, handlePlayAll, summaries.length, onlyCustomNews, setPreference]);
  
  const onMount = React.useCallback(() => {
    setPage(0);
    load(0);
  }, [load]);

  React.useEffect(() => {
    onMount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefilter, onlyCustomNews]);
  
  React.useEffect(() => {
    setSummaries((prev) => {
      const newState = prev.filter((p) => !(p.id in (removedSummaries ?? {})));
      return (prev = newState);
    });
  }, [removedSummaries]);

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
    (summary: PublicSummaryGroups, format?: ReadingFormat) => {
      handleInteraction(summary, InteractionType.Read, undefined, { format });
      if (supportsMasterDetail) {
        setDetailSummary(summary);
        setLastFocus('detail');
      } else {
        navigation?.push('summary', {
          initialFormat: format ?? preferredReadingFormat ?? ReadingFormat.Summary,
          initiallyTranslated: Boolean(translationOn[summary.id]),
          keywords: parseKeywords(searchText),
          summary: {
            ...summary,
            translations: translations[summary.id] ?? summary.translations ?? [],
          },
        });
      }
    },
    [handleInteraction, navigation, translations, preferredReadingFormat, searchText, supportsMasterDetail, translationOn]
  );
  
  const onLocalize = React.useCallback((summary: PublicSummaryGroups, translations: PublicSummaryTranslationAttributes[]) => {
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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => handleResize(), [
    handleResize,
    supportsMasterDetail, 
    detailSummary, 
    loading,
    summaries,
  ]);

  const loadMoreAsNeeded = React.useCallback(async () => {
    if (!currentTrackIndex) {
      return;
    }
    if (currentTrackIndex + preloadCount > summaries.length) {
      await loadMore('autoloaded-for-track');
    }
  }, [currentTrackIndex, loadMore, preloadCount, summaries]);

  const summaryList = React.useMemo(() => {
    return summaries.map((summary) => (
      <Summary
        key={ summary.id }
        summary={ summary }
        selected={ Boolean(supportsMasterDetail && summary.id === detailSummary?.id) }
        keywords={ shareTarget?.id === summary.id ? undefined : keywords }
        onFormatChange={ (format) => handleFormatChange(summary, format) }
        onInteract={ (...e) => handleInteraction(summary, ...e) }
        onLocalize={ (translations) => onLocalize(summary, translations) }
        onToggleTranslate={ (onOrOff) => setTranslationOn((prev) => {
          const state = { ...prev };
          state[summary.id] = onOrOff;
          return (prev = state);
        }) } />
    ));
  }, [detailSummary?.id, onLocalize, handleFormatChange, handleInteraction, keywords, shareTarget, summaries, supportsMasterDetail]);

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

  return (
    <Screen>
      <SafeAreaView style={ { flexGrow: 1 } }>
        <View col gap={ 3 }>
          {!prefilter && (<TopicSampler horizontal />)}
          {summaries.length > 0 && averageSentiment && (
            <View 
              elevated 
              height={ 30 } 
              borderRadiusBL={ 16 }
              borderRadiusBR={ 16 }
              p={ 4 }>
              <View row gap={ 12 } justifyCenter alignCenter>
                <MeterDial value={ averageSentiment } width={ 30 } height={ 20 } />
                <Text caption>{`${fixedSentiment(averageSentiment)}`}</Text>
                <Text caption>{`${totalResultCount} ${strings.search.results}`}</Text>
              </View>
            </View>
          )}
          {!loading && onlyCustomNews && summaries.length === 0 && (
            <View col justifyCenter p={ 16 } gap={ 8 }>
              <Text subtitle1>
                {strings.search.filtersTooSpecific}
              </Text>
              <Button 
                alignCenter
                rounded 
                outlined 
                p={ 8 }
                selectable
                onPress={ openBrowse }>
                {strings.search.goToBrowse}
              </Button>
              <Button 
                alignCenter
                rounded 
                outlined 
                p={ 8 }
                selectable
                onPress={ () => setOnlyCustomNews(false) }>
                {strings.search.turnOffFilters}
              </Button>
            </View>
          )}
          {!prefilter && onlyCustomNews && (
            <View>
              <Text caption textCenter mh={ 12 }>{strings.search.customNewsSearch}</Text>
              <Button 
                alignCenter
                rounded 
                outlined 
                p={ 8 }
                selectable
                onPress={ () => setOnlyCustomNews(false) }>
                {strings.search.turnOffFilters}
              </Button>
            </View>
          )}
          <View col>
            <View row>
              <Animated.View style={ { width: supportsMasterDetail ? '40%' : '100%' } }>
                <ScrollView
                  refreshing={ loading }
                  onScroll={ handleMasterScroll }
                  onRefresh={ () => {
                    setPage(0);
                    load(0);
                  } }>
                  <View col width="100%" pt={ 12 }>
                    {summaryList}
                    {!loading && !noResults && totalResultCount > summaries.length && (
                      <View row justifyCenter p={ 16 } pb={ 24 }>
                        <Button 
                          outlined
                          rounded
                          p={ 8 }
                          selectable
                          onPress={ () => loadMore() }>
                          {strings.search.loadMore}
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
                      <View col gap={ 12 } alignCenter justifyCenter>
                        <Text textCenter mh={ 16 }>
                          {strings.search.noResults}
                          {' '}
                          🥺
                        </Text>
                        <Button 
                          alignCenter
                          rounded 
                          outlined 
                          p={ 8 }
                          selectable
                          onPress={ () => load(0) }>
                          {strings.search.reload}
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
                <ScrollView 
                  refreshing={ loading }
                  onScroll={ handleDetailScroll }
                  mt={ 12 }
                  ph={ 12 }>
                  {detailSummary && (
                    <Summary
                      summary={ detailSummary }
                      initialFormat={ preferredReadingFormat ?? ReadingFormat.Summary }
                      keywords={ shareTarget?.id === detailSummary.id ? undefined : keywords }
                      onFormatChange={ (format) => handleFormatChange(detailSummary, format) }
                      onInteract={ (...e) => handleInteraction(detailSummary, ...e) } />
                  )}
                </ScrollView>
              </Animated.View>
            </View>
          </View>
        </View>
        {summaries.length > 0 && (
          <Button
            absolute
            right={ 32 }
            bottom={ 96 }
            elevated
            rounded
            opacity={ 0.95 }
            p={ 12 }
            haptic
            touchable
            startIcon="volume-high"
            iconSize={ 32 }
            onPress={ handlePlayAll } />
        )}
        {summaries.length > 0 && (
          <SearchMenu
            initialValue={ prefilter ?? searchText }
            onSubmit={ (text) => text?.trim() && search({ onlyCustomNews, prefilter: text }) } />
        )}
      </SafeAreaView>
    </Screen>
  );
}
