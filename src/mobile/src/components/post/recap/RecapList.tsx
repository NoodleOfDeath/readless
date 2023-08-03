import React from 'react';

import { useFocusEffect } from '@react-navigation/native';

import { RecapAttributes } from '~/api';
import { 
  FlatList,
  Recap,
  View,
} from '~/components';
import { useSummaryClient } from '~/core';

export type RecapListProps = {
  header?: React.ReactNode;
};

export function RecapList({ header }: RecapListProps = {}) {
  
  const { getRecaps } = useSummaryClient();

  const [recaps, setRecaps] = React.useState<RecapAttributes[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [lastFetchFailed, setLastFetchFailed] = React.useState(false);
  
  const load = React.useCallback(async () => {
    if (loading) {
      return;
    }
    setLoading(true);
    try {
      const { data: recaps } = await getRecaps();
      if (!recaps) {
        return;
      }
      setRecaps(recaps.rows);
      setLastFetchFailed(false);
    } catch (error) {
      console.log(error);
      setLastFetchFailed(true);
    } finally {
      setLoading(false);
    }
  }, [loading, getRecaps]);

  useFocusEffect(React.useCallback(() => {
    if (recaps.length === 0 && !lastFetchFailed) {
      load();
    } 
  }, [load, recaps, lastFetchFailed]));

  return (
    <FlatList
      refreshing={ recaps.length === 0 && loading }
      onRefresh={ () => {
        load();
      } }
      data={ recaps }
      renderItem={ ({ item }) => (
        <Recap
          key={ item.id }
          recap={ item }
          mx={ 12 } />
      ) }
      ListHeaderComponentStyle={ { paddingTop: 12 } }
      ListHeaderComponent={ <React.Fragment>{header}</React.Fragment> }
      ListFooterComponentStyle={ { paddingBottom: 12 } }
      ItemSeparatorComponent={ () => <View mx={ 12 } my={ 6 } /> }
      estimatedItemSize={ 114 } />
  );
}