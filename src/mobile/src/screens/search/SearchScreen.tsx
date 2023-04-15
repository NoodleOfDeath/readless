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
      removedSummaries,
      preferredReadingFormat,
    },
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
  const [recentSummaries, setRecentSummaries] = React.useState<PublicSummaryAttributes[]>([]);
  const [totalResultCount, setTotalResultCount] = React.useState(0);

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
  
  const noResults = React.useMemo(() => onlyCustomNews && !followFilter, [onlyCustomNews, followFilter]);

  const load = React.useCallback(async (pageSize: number, page: number) => {
    setLoading(true);
    if (page === 0) {
      setRecentSummaries([]);
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
        undefined,
        page,
        pageSize
      );
      if (error) {
        console.error(error);
        toast.alert(error.message);
        return;
      }
      if (!data) {
        return;
      }
      setRecentSummaries((prev) => {
        if (page === 0) {
          return (prev = data.rows.filter((r) => !(r.id in (removedSummaries ?? {}))));
        }
        return (prev = [...prev, ...data.rows.filter((r) => !prev.some((p) => r.id === p.id) && !(r.id in (removedSummaries ?? {})))]);
      });
      setTotalResultCount(data.count);
      setPage((prev) => prev + 1);
    } catch (e) {
      console.error(e);
      toast.alert(String(e));
      setRecentSummaries([]);
      setTotalResultCount(0);
    } finally {
      setLoading(false);
    }
  }, [
    onlyCustomNews, 
    followFilter, 
    searchText, 
    prefilter, 
    getSummaries, 
    removedSummaries,
    toast,
  ]);

  const onMount = React.useCallback(() => {
    setPage(0);
    load(pageSize, 0);
    if (prefilter) {
      navigation?.setOptions({ headerShown: true, headerTitle: prefilter });
    }
  }, [load, navigation, pageSize, prefilter]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(
    () => onMount(), 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [pageSize, prefilter, searchText]
  );

  const loadMore = React.useCallback(async () => {
    await load(pageSize, page + 1);
  }, [load, pageSize, page]);

  const handleFormatChange = React.useCallback(
    async (summary: PublicSummaryAttributes, format?: ReadingFormat) => {
      const { data: interactions, error } = await handleInteraction(summary, InteractionType.Read, undefined, { format });
      if (error) {
        console.error(error);
        toast.alert(error.message);
      } else if (interactions) {
        setRecentSummaries((prev) => prev.map((s) => s.id === summary.id ? { ...s, interactions } : s));
      }
      navigation?.push('summary', {
        initialFormat: format ?? preferredReadingFormat ?? ReadingFormat.Concise,
        summary,
      });
    },
    [handleInteraction, navigation, preferredReadingFormat, toast]
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
      onRefresh={ () => load(pageSize, 0) }>
      <View col mh={ 16 }>
        {!prefilter && (
          <View style={ theme.components.searchBar }>
            <Searchbar
              placeholder="show me something worth reading..."
              onChangeText={ ((text) => 
                setSearchText(text)) }
              value={ searchText } />
          </View>
        )}
        {loading && recentSummaries.length === 0 && (
          <View justifyCenter p={ 16 }>
            <ActivityIndicator size="large" />
          </View>
        )}
        {!loading && onlyCustomNews && recentSummaries.length === 0 && (
          <View col justifyCenter p={ 16 }>
            <Text fontSize={ 20 } pb={ 8 }>
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
        {recentSummaries.map((summary) => (
          <Summary
            key={ summary.id }
            summary={ summary }
            bookmarked={ Boolean(bookmarkedSummaries?.[summary.id]) }
            favorited={ Boolean(favoritedSummaries?.[summary.id]) }
            onFormatChange={ (format) => handleFormatChange(summary, format) }
            onInteract={ (...e) => handleInteraction(summary, ...e) }
            onReferSearch={ handleReferSearch } />
        ))}
        {!loading && !noResults && totalResultCount > recentSummaries.length && (
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
    </Screen>
  );
}
