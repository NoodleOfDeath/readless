import React from 'react';
import { Button, StyleSheet, useColorScheme } from 'react-native';

import { API_BASE_URL } from '@env';

import { Api, SourceAttr } from '../api/Api';

import Post from '../components/Post';
import Screen from '../components/Screen';

export default function HomeScreen() {

  const isLightMode = useColorScheme() === 'light';
  const styles = createStyles(isLightMode);

  const api = new Api({
    baseURL: API_BASE_URL,
  }).v1;

  const [recentSources, setRecentSources] = React.useState<SourceAttr[]>([]);
  const [totalSourceCount, setTotalSourceCount] = React.useState(0);

  const [pageSize] = React.useState(10);
  const [page, setPage] = React.useState(1);

  React.useEffect(() => {
    setPage(1);
    api.getSources({
      pageSize,
      page: 0
    })
      .then((response) => {
        setRecentSources(response.data.rows);
        setTotalSourceCount(response.data.count);
      })
      .catch(console.error)
      .finally(() => {
        setRecentSources([]);
        setTotalSourceCount(0);
      });
  }, [pageSize]);

  const loadMore = React.useCallback(() => {
    api.getSources({
      pageSize,
      page
    })
      .then((response) => {
        setRecentSources((prev) => [...prev, ...response.data.rows]);
        setTotalSourceCount(response.data.count);
      })
      .catch((error) => {
        console.error(error);
      })
      .finally(() => {
        setRecentSources([]);
        setTotalSourceCount(0);
      });
  }, [pageSize]);

  return (
    <Screen>
      {recentSources.map((source) => (
        <Post key={source.id} />
      ))}
      <Button title="Load More" color={styles.button.color}></Button>
    </Screen>
  );
}

function createStyles(isLightMode: boolean) {
  return StyleSheet.create({
    text: {
      color: isLightMode ? '#000' : '#fff',
    },
    button: {
      color: isLightMode ? '#000' : '#fff',
    }
  });
}