import React from 'react';

import { Searchbar } from 'react-native-paper';

import {
  InteractionType,
  PublicSummaryAttributes,
  ReadingFormat,
} from '~/api';
import {
  ActivityIndicator,
  Button,
  Screen,
  ScrollView,
  Summary,
  Text,
  View,
} from '~/components';
import { SessionContext, ToastContext } from '~/contexts';
import { useSummaryClient, useTheme } from '~/hooks';
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
      favoritedSummaries, 
      readSummaries,
      removedSummaries,
      preferredReadingFormat,
      sortOrder,
    },
    ready,
    setPreference,
  } = React.useContext(SessionContext);
  const toast = React.useContext(ToastContext);
  const { getSummaries, handleInteraction } = useSummaryClient();
  const theme = useTheme();
  
  const [prefilter, setPrefilter] = React.useState(route?.params?.prefilter ?? '');
  
  const onlyCustomNews = React.useMemo(() => Boolean(route?.params?.onlyCustomNews), [route]);
  
  React.useEffect(() => {
    setPrefilter(route?.params?.prefilter ?? '');
  }, [route]);
  
  React.useEffect(() => {
    navigation?.setOptions({ headerShown: false });
  }, [prefilter, navigation]);

  const [loading, setLoading] = React.useState(false);
  const [summaries, setSummaries] = React.useState<PublicSummaryAttributes[]>([]);
  const [totalResultCount, setTotalResultCount] = React.useState(0);
  const [pendingReload, setPendingReload] = React.useState(false);

  const [pageSize] = React.useState(10);
  const [page, setPage] = React.useState(0);
  const [searchText, setSearchText] = React.useState('');

  const categoryOutletCount = React.useMemo(() => lengthOf(bookmarkedCategories, bookmarkedOutlets), [bookmarkedCategories, bookmarkedOutlets]);

  const followFilter = React.useMemo(() => {
    if (categoryOutletCount === 0) {
      return '';
    }
    return [`cat:${Object.values(bookmarkedCategories ?? {})
      .map((c) => c.item.name.toLowerCase().replace(/\s/g, '-')).join(',')}`, 
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
        filter,
        excludeIds,
        Boolean(excludeIds),
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
      setSummaries((prev) => {
        if (page === 0) {
          return (prev = data.rows);
        }
        return (prev = [...prev, ...data.rows]);
      });
      setTotalResultCount(data.count);
      setPage((prev) => prev + 1);
    } catch (e) {
      console.error(e);
      toast.alert(String(e));
      setSummaries([]);
      setTotalResultCount(0);
    } finally {
      setLoading(false);
    }
  }, [excludeIds, pageSize, onlyCustomNews, followFilter, searchText, prefilter, getSummaries, sortOrder, toast]);

  const onMount = React.useCallback(() => {
    if (!ready) {
      return;
    }
    setPage(0);
    load(0);
    if (prefilter) {
      navigation?.setOptions({ headerShown: true, headerTitle: prefilter });
    }
  }, [load, navigation, prefilter, ready]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(
    () => onMount(), 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pageSize, prefilter, ready, sortOrder, searchText]
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
  }, [pendingReload, load, removedSummaries]);
  
  const removeReadSummaries = React.useCallback(() => {
    setPreference('removedSummaries', (prev) => (prev = ({ ...prev, ...readSummaries })));
    setPendingReload(true);
  }, [setPreference, readSummaries]);

  const loadMore = React.useCallback(async () => {
    await load(page + 1);
  }, [load, page]);

  const handleFormatChange = React.useCallback(
    (summary: PublicSummaryAttributes, format?: ReadingFormat) => {
      handleInteraction(summary, InteractionType.Read, undefined, { format });
      navigation?.push('summary', {
        initialFormat: format ?? preferredReadingFormat ?? ReadingFormat.Summary,
        summary,
      });
    },
    [handleInteraction, navigation, preferredReadingFormat]
  );
  
  const handleReferSearch = React.useCallback((newPrefilter: string) => {
    if (prefilter === newPrefilter) {
      return;
    }
    navigation?.push('search', { prefilter: newPrefilter });
  }, [navigation, prefilter]);

  return (
    <Screen
      refreshing={ loading }
      onRefresh={ () => load(0) }>
      <View col mh={ 16 }>
        {!prefilter && (
          <View mb={ 8 }>
            <Searchbar
              placeholder="show me something worth reading..."
              onChangeText={ ((text) => 
                setSearchText(text)) }
              inputStyle={ theme.components.searchBar }
              value={ searchText } />
          </View>
        )}
        <View row mb={ 8 }>
          <Text mr={ 8 }>Sort By:</Text>
          <ScrollView horizontal>
            <View row>
              <View mr={ 8 }>
                <Button 
                  row
                  alignCenter
                  startIcon={ (sortOrder ?? []).length > 0 ? 'check' : undefined }
                  underline={ (sortOrder ?? []).length > 0 }
                  spacing={ 4 }
                  onPress={ () => setPreference('sortOrder', ['originalDate:desc', 'createdAt:desc']) }>
                  Publication Date
                </Button>
              </View>
              <View>
                <Button 
                  row
                  alignCenter
                  startIcon={ (sortOrder ?? []).length === 0 ? 'check' : undefined }
                  underline={ (sortOrder ?? []).length === 0 }
                  spacing={ 4 }
                  onPress={ () => setPreference('sortOrder', []) }>
                  Generation Date
                </Button>
              </View>
            </View>
          </ScrollView>
          <Button 
            ml={ 16 }
            onPress={ () => removeReadSummaries() }>
            Clear Read
          </Button>
        </View>
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
              onPress={ () => navigation?.getParent()?.navigate('Sections') }>
              Go to Sections
            </Button>
          </View>
        )}
        {summaries.map((summary) => (
          <Summary
            key={ summary.id }
            summary={ summary }
            bookmarked={ Boolean(bookmarkedSummaries?.[summary.id]) }
            favorited={ Boolean(favoritedSummaries?.[summary.id]) }
            onFormatChange={ (format) => handleFormatChange(summary, format) }
            onInteract={ (...e) => handleInteraction(summary, ...e) }
            onReferSearch={ handleReferSearch } />
        ))}
        {!loading && !noResults && totalResultCount > summaries.length && (
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
        {loading && (
          <View row mb={ 64 }>
            <View row justifyCenter p={ 16 } pb={ 24 }>
              <ActivityIndicator size="large" color={ theme.colors.primary } />
            </View>
          </View>
        )}
      </View>
    </Screen>
  );
}
