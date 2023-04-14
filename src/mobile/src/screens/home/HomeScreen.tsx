import React from 'react';

import { RouteProp } from '@react-navigation/native';

import {
  Screen,
  TabSwitcher,
  View,
} from '~/components';
import { SessionContext } from '~/contexts';
import {
  ScreenProps,
  SearchScreen,
  StackableTabParams,
} from '~/screens';
import { lengthOf } from '~/utils';

const routes: RouteProp<StackableTabParams, 'search'>[] = [
  {
    key: 'search',
    name: 'search',
    params: { onlyCustomNews: false },
  },
  {
    key: 'customSearch',
    name: 'search',
    params: { onlyCustomNews: true },
  },
];

export function HomeScreen({ navigation } : ScreenProps<'search'>) {
  
  const {
    preferences: {
      bookmarkedCategories,
      bookmarkedOutlets,
    },
    ready,
  } = React.useContext(SessionContext);
  
  const [activeTab, setActiveTab] = React.useState(0);
  const [mounted, setMounted] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [lastFollowCount, setLastFollowCount] = React.useState(0);
  
  const followCountChanged = React.useMemo(() => {
    const count = lengthOf(bookmarkedCategories, bookmarkedOutlets);
    console.log(lastFollowCount, count);
    return lastFollowCount !== count;
  }, [bookmarkedCategories, bookmarkedOutlets, lastFollowCount]);
  
  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 100);
  };
  
  const onMount = React.useCallback(() => {
    const lastFollowCount = lengthOf(bookmarkedCategories, bookmarkedOutlets);
    setLastFollowCount(lastFollowCount);
    setActiveTab(lastFollowCount > 0 ? 1 : 0);
    navigation?.addListener('focus',
      refresh);
    setMounted(true);
  }, [bookmarkedCategories, bookmarkedOutlets, navigation]);
  
  React.useEffect(() => {
    if (!ready || mounted) {
      return;
    }
    onMount();
  }, [ready, onMount, mounted]);
  
  const onTabChange = React.useCallback((tab: number) => {
    setActiveTab(tab);
    refresh();
  }, []);
  
  return (
    <Screen 
      onRefresh={ () => refresh() }>
      <View col mh={ 16 }>
        <TabSwitcher
          activeTab={ activeTab }
          onTabChange={ onTabChange }
          titles={ ['All News', 'My News'] }>
          <View mh={ -16 }>
            {!refreshing && (
              <SearchScreen 
                route={ routes[0] }
                navigation={ navigation } />
            )}
          </View>
          <View mh={ -16 }>
            {!refreshing && (
              <SearchScreen 
                route={ routes[1] }
                navigation={ navigation } />
            )}
          </View>
        </TabSwitcher>
      </View>
    </Screen>
  );
}
