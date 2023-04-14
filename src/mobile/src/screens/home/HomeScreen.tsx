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
  
  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 100);
  };
  
  const onMount = React.useCallback(() => {
    if (mounted) {
      return;
    }
    navigation?.addListener('focus', refresh);
    setActiveTab(lengthOf(bookmarkedCategories, bookmarkedOutlets) > 0 ? 1 : 0);
    setMounted(true);
  }, [mounted, navigation, bookmarkedCategories, bookmarkedOutlets]);
  
  React.useEffect(() => {
    if (!ready) {
      return;
    }
    onMount();
  }, [ready, onMount]);
  
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
