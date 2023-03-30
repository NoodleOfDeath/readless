import React from 'react';
import { Button, useColorScheme } from 'react-native';

import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import axios from 'axios';
import { SearchBar } from 'react-native-elements';

import { API, SummaryResponse } from '../../api';
import FlexView from '../../components/common/FlexView';
import SafeScrollView from '../../components/common/SafeScrollView';
import { ConsumptionMode } from '../../components/post/ConsumptionModeSelector';
import Post from '../../components/post/Post';
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
  const [totalSourceCount, setTotalSourceCount] = React.useState(0);

  const [pageSize] = React.useState(10);
  const [page, setPage] = React.useState(0);
  const [searchText, setSearchText] = React.useState('');

  const load = (pageSize: number, page: number, searchText: string) => {
    setLoading(true);
    if (page === 0) {
      setRecentSummaries([]);
    }
    API.getSummaries({
      params: {
        filter: searchText,
        page,
        pageSize,
      },
    })
      .then((response) => {
        setRecentSummaries((prev) => {
          if (page === 0) {
            return response.data.rows;
          }
          return [...prev, ...response.data.rows];
        });
        setTotalSourceCount(response.data.count);
        setPage((prev) => prev + 1);
      })
      .catch((e) => {
        console.error(e);
        setRecentSummaries([]);
        setTotalSourceCount(0);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const onMount = React.useCallback(() => {
    setPage(0);
    load(pageSize, 0, searchText);
  }, [pageSize, searchText]);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => onMount(), [pageSize, searchText]);

  const loadMore = React.useCallback(() => {
    load(pageSize, page + 1, searchText);
  }, [pageSize, page, searchText]);

  const onExpandPost = React.useCallback(
    (index: number, mode?: ConsumptionMode) => {
      navigation?.navigate('Post', {
        initialMode: mode,
        summary: recentSummaries[index],
      });
    },
    [navigation, recentSummaries]
  );

  return (
    <React.Fragment>
      <FlexView style={ theme.searchBar }>
        <SearchBar
          placeholder="What's cooking in theSkoop?..."
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
            <Post
              key={ summary.id }
              summary={ summary }
              onChange={ (mode) => onExpandPost(i, mode) } />
          ))}
          {!loading && totalSourceCount > recentSummaries.length && (
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
