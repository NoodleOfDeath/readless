import React from 'react';
import { Button, useColorScheme } from 'react-native';

import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { SearchBar } from 'react-native-elements';

import {
  API,
  ReadingFormat,
  SummaryResponse,
} from '../../api';
import FlexView from '../../components/common/FlexView';
import SafeScrollView from '../../components/common/SafeScrollView';
import Summary from '../../components/post/Summary';
import { useTheme } from '../../components/theme';
import { RootParamList } from '../../types';

type Props = {
  route: RouteProp<RootParamList['Discover'], 'Home'>;
  navigation: NativeStackNavigationProp<RootParamList['Discover'], 'Home'>;
};

export default function ResultsView({ navigation }: Props) {
  const isLightMode = useColorScheme() === 'light';
  const theme = useTheme({
    searchBar: {
      background: isLightMode ? '#fff' : '#8B0000',
      marginBottom: 10,
    },
  });

  const [loading, setLoading] = React.useState(false);
  const [recentSummaries, setRecentSummaries] = React.useState<
    SummaryResponse[]
  >([]);
  const [totalResultCount, setTotalResultCount] = React.useState(0);

  const [pageSize] = React.useState(10);
  const [page, setPage] = React.useState(0);
  const [searchText, setSearchText] = React.useState('');

  const load = async (pageSize: number, page: number, searchText: string) => {
    setLoading(true);
    if (page === 0) {
      setRecentSummaries([]);
    }
    try {
      const { data, error } = await API.getSummaries({
        params: {
          filter: searchText,
          page,
          pageSize,
        },
      });
      if (error) {
        console.log(error);
        return;
      }
      if (!data) {
        return;
      }
      setRecentSummaries((prev) => {
        if (page === 0) {
          return (prev = data.rows);
        }
        return (prev = [...prev, ...data.rows]);
      });
      setTotalResultCount(data.count);
      setPage((prev) => prev + 1);
    } catch (e) {
      console.error(e);
      setRecentSummaries([]);
      setTotalResultCount(0);
    } finally {
      setLoading(false);
    }
  };

  const onMount = React.useCallback(() => {
    setPage(0);
    load(pageSize, 0, searchText);
  }, [pageSize, searchText]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => onMount(), [pageSize, searchText]);

  const loadMore = React.useCallback(async () => {
    await load(pageSize, page + 1, searchText);
  }, [pageSize, page, searchText]);

  const onExpandPost = React.useCallback(
    (index: number, format?: ReadingFormat) => {
      navigation?.navigate('Summary', {
        format,
        summary: recentSummaries[index],
      });
    },
    [navigation, recentSummaries]
  );

  return (
    <React.Fragment>
      <FlexView style={ theme.searchBar }>
        <SearchBar
          placeholder="show me something worth reading..."
          lightTheme={ isLightMode }
          onChangeText={ (text) => 
            setSearchText(text) }
          value={ searchText } />
      </FlexView>
      <SafeScrollView
        refreshing={ loading }
        onRefresh={ () => load(pageSize, 0, searchText) }>
        <FlexView>
          {recentSummaries.map((summary, i) => (
            <Summary
              key={ summary.id }
              summary={ summary }
              onChange={ (format) => onExpandPost(i, format) } />
          ))}
          {!loading && totalResultCount > recentSummaries.length && (
            <Button
              title="Load More"
              color={ theme.components.button.color }
              onPress={ loadMore } />
          )}
        </FlexView>
      </SafeScrollView>
    </React.Fragment>
  );
}
