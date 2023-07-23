import React from 'react';

import { useFocusEffect } from '@react-navigation/native';

import { RecapAttributes } from '~/api';
import { 
  Divider,
  FlatList,
  Recap,
} from '~/components';
import { SessionContext } from '~/contexts';
import { useSummaryClient } from '~/core';
import { useNavigation } from '~/hooks';

export type RecapListProps = {
  header?: React.ReactNode;
};

export function RecapList({
  header,
  ...props
}: RecapListProps = {}) {
  
  const { navigate } = useNavigation();
  const { getRecaps } = useSummaryClient();
  const { readRecap, readRecaps } = React.useContext(SessionContext);

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
          onPress={ async () => {
            if (!(item.id in ({ ...readRecaps }))) {
              await readRecap(item);
            }
            navigate('recap', { recap: item } );
          } } />
      ) }
      ListHeaderComponentStyle={ { paddingTop: 12 } }
      ListHeaderComponent={ <React.Fragment>{header}</React.Fragment> }
      ListFooterComponentStyle={ { paddingBottom: 12 } }
      ItemSeparatorComponent={ () => <Divider /> }
      estimatedItemSize={ 114 } />
  );
}