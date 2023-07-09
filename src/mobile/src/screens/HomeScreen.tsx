import React from 'react';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { SessionContext } from '../core';

import {
  Icon,
  SYSTEM_FONT,
  Screen,
  SummaryList,
} from '~/components';
import { useSummaryClient, useTheme } from '~/hooks';
import { ScreenProps } from '~/screens';

function TopStoriesTab({ 
  route,
  navigation: _navigation,
}: ScreenProps<'search'>) {
  const { getTopStories } = useSummaryClient();
  return ( 
    <SummaryList
      fetch={ getTopStories }
      filter={ route?.params?.prefilter }
      interval='1d' />
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

const Tab = createMaterialTopTabNavigator();

export function HomeScreen({ 
  route: _route,
  navigation: _navigation,
}: ScreenProps<'home'>) {

  const theme = useTheme();
  const { 
    followCount,
    followFilter,
  } = React.useContext(SessionContext);

  return (
    <Screen>
      <Tab.Navigator 
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
          name="Top Stories" 
          component={ TopStoriesTab } 
          options={ {
            tabBarIcon: ({ color }) => (
              <Icon 
                name={ 'bulletin-board' } 
                color={ color } />
            ),
          } } />
        <Tab.Screen 
          name="Live" 
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
