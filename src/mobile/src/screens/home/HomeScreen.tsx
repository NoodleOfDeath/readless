import React from 'react';
import { Linking } from 'react-native';

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
import { SummaryUtils, lengthOf } from '~/utils';

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
  
  const router = React.useCallback(({ url }: { url: string }) => {
    // http://localhost:6969/read/?s=158&f=casual
    // https://dev.readless.ai/read/?s=158&f=casual
    // https://www.readless.ai/read/?s=4070&f=bullets
    // readless://read/?s=4070
    const [path, query] = url.split('?');
    const expr = /^(?:readless|https?):\/\/(?:(?:dev|www\.)?readless\.ai\/)?(\w+)\/?/;
    const [, route] = path.match(expr) ?? [];
    const params: Record<string, string> = {};
    if (query) {
      query.split('&').forEach((pair) => {
        const [key, value] = pair.split('=');
        params[decodeURIComponent(key)] = decodeURIComponent(value || '');
      });
    }
    const summary = Number.parseInt(params['s'] ?? '0');
    if (!summary) {
      return;
    }
    const initialFormat = SummaryUtils.format(params['f']);
    if (route === 'read' && summary) {
      navigation?.navigate('summary', { initialFormat, summary });
    }
  }, [navigation]);
  
  const {
    preferences: {
      bookmarkedCategories,
      bookmarkedOutlets,
      homeTab,
    },
    setPreference,
    ready,
  } = React.useContext(SessionContext);
  
  const [activeTab, setActiveTab] = React.useState(0);
  const [mounted, setMounted] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  
  const refresh = () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 100);
  };
  
  const onMount = React.useCallback(async () => {
    const url = await Linking.getInitialURL();
    if (url) {
      router({ url });
      return;
    }
    Linking.removeAllListeners('url');
    Linking.addEventListener('url', router);
    if (homeTab === 'All News') {
      setActiveTab(0);
    } else if (homeTab === 'My News') {
      setActiveTab(1);
    }
    const followCount = lengthOf(bookmarkedCategories, bookmarkedOutlets);
    if (!homeTab && followCount > 0) {
      setActiveTab(1);
    } 
    setMounted(true);
  }, [bookmarkedCategories, bookmarkedOutlets, homeTab, router]);
  
  React.useEffect(() => {
    if (!ready || mounted) {
      return;
    }
    onMount();
  }, [ready, onMount, mounted]);
  
  const onTabChange = React.useCallback((tab: number) => {
    setActiveTab(tab);
    const followCount = lengthOf(bookmarkedCategories, bookmarkedOutlets);
    if (followCount === 0) {
      setPreference('homeTab', undefined);
    } else {
      setPreference('homeTab', tab === 0 ? 'All News' : 'My News');
    }
    refresh();
  }, [bookmarkedCategories, bookmarkedOutlets, setPreference]);
  
  return (
    <Screen onRefresh={ () => refresh() }>
      <View col>
        <TabSwitcher
          tabHeight={ 48 }
          activeTab={ activeTab }
          onTabChange={ onTabChange }
          titles={ ['All News', 'My News'] }>
          <View>
            {!refreshing && (
              <SearchScreen  
                route={ routes[0] }
                navigation={ navigation } />
            )}
          </View>
          <View>
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
