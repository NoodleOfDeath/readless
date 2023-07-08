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
import { ScreenProps } from '~/screens';

const Tab = createMaterialTopTabNavigator();

function HeadlinesTab({ 
  route,
  navigation: _navigation,
}: ScreenProps<'search'>) {
  const { getTopStories } = useSummaryClient();
  return ( 
    <SummaryList
      fetch={ getTopStories }
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
    followCount,
    followFilter,
  } = React.useContext(SessionContext);

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
      </Tab.Navigator>
    </Screen>
  );

}
