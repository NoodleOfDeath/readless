import React from 'react';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { SessionContext } from '../core';

import {
  Header,
  Icon,
  SYSTEM_FONT,
  Screen,
  SearchMenu,
  SummaryList,
} from '~/components';
import { useSummaryClient, useTheme } from '~/hooks';
import { ChannelScreen, ScreenProps } from '~/screens';

const Tab = createMaterialTopTabNavigator();

function HeadlinesTab({ 
  route,
  navigation: _navigation,
}: ScreenProps<'search'>) {
  const { getTopics } = useSummaryClient();
  return ( 
    <SummaryList
      fetch={ getTopics }
      showWalkthroughs
      filter={ route?.params?.prefilter }
      interval={ '1d' } />
  );
}

function LivestreamTab({ 
  route,
  navigation: _navigation,
}: ScreenProps<'search'>) {
  const { getSummaries } = useSummaryClient();
  return ( 
    <SummaryList
      fetch={ getSummaries }
      filter={ route?.params?.prefilter } />
  );
}

export function HomeScreen({ 
  route: _route,
  navigation,
}: ScreenProps<'home'>) {

  const theme = useTheme();
  const { 
    followedCategories,
    followCount,
    followFilter,
  } = React.useContext(SessionContext);

  const categoryTabs = React.useMemo(() => {
    return Object.values({ ...followedCategories }).filter((c) => typeof c === 'object').map((category) => (
      <Tab.Screen 
        key={ category.name }
        name={ category.name }
        component={ ChannelScreen }
        options={ {
          tabBarIcon: ({ color }) => (
            <Icon 
              name={ category.icon } 
              color={ color } />
          ),
        } }
        initialParams={ { 
          attributes: category,
          type: 'category',
        } } />
    ));
  }, [followedCategories]);

  return (
    <Screen>
      <Tab.Navigator 
        screenListeners={ () => ({
          focus: () => navigation?.setOptions({
            header: () => ( 
              <Header>
                <SearchMenu flexGrow={ 1 } />
              </Header>
            ), 
          }),
        }) }
        screenOptions={ {
          tabBarAllowFontScaling: true,
          tabBarLabelStyle: { fontFamily: SYSTEM_FONT },
          tabBarScrollEnabled: true,
          tabBarStyle: { backgroundColor: theme.navContainerTheme.colors.background },
        } }>
        {followCount > 0 && (
          <Tab.Screen 
            name="Your News" 
            component={ LivestreamTab } 
            options={ {
              tabBarIcon: ({ color }) => (
                <Icon 
                  name={ 'account-heart' } 
                  color={ color } />
              ),
            } }
            initialParams={ { prefilter: followFilter } } />
        )}
        <Tab.Screen 
          name="Headlines" 
          component={ HeadlinesTab } 
          options={ {
            tabBarIcon: ({ color }) => (
              <Icon 
                name={ 'bulletin-board' } 
                color={ color } />
            ),
          } } />
        <Tab.Screen 
          name="Livestream" 
          component={ LivestreamTab }
          options={ {
            tabBarIcon: ({ color }) => (
              <Icon 
                name={ 'rss' } 
                color={ color } />
            ),
          } } />
        {categoryTabs}
      </Tab.Navigator>
    </Screen>
  );

}
