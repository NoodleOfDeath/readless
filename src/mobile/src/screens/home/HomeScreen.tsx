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
  
  const onMount = React.useCallback(async () => {
    const url = await Linking.getInitialURL();
    if (url) {
      router({ url });
    }
    Linking.addEventListener('url', router);
    const followCount = lengthOf(bookmarkedCategories, bookmarkedOutlets);
    setActiveTab(followCount > 0 ? 1 : 0);
    setMounted(true);
  }, [bookmarkedCategories, bookmarkedOutlets, router]);
  
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
    <Screen onRefresh={ () => refresh() }>
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
          <View ph={ -16 }>
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
