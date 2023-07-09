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
import { strings } from '~/locales';
import { ScreenProps } from '~/screens';

function YourNewsTab({ 
  route: _route,
  navigation: _navigation,
}: ScreenProps<'search'>) {
  const { getSummaries } = useSummaryClient();
  const { followFilter } = React.useContext(SessionContext);
  return ( 
    <SummaryList
      fetch={ getSummaries }
      filter={ followFilter } />
  );
}

function TopStoriesTab({ 
  route: _route,
  navigation: _navigation,
}: ScreenProps<'search'>) {
  const { getTopStories } = useSummaryClient();
  return ( 
    <SummaryList
      fetch={ getTopStories }
      interval='1d' />
  );
}

function LivestreamTab({ 
  route: _route,
  navigation: _navigation,
}: ScreenProps<'search'>) {
  const { getSummaries } = useSummaryClient();
  return ( 
    <SummaryList fetch={ getSummaries } />
  );
}

const Tab = createMaterialTopTabNavigator();

export function HomeScreen({ 
  route: _route,
  navigation: _navigation,
}: ScreenProps<'home'>) {

  const theme = useTheme();
  const { followCount } = React.useContext(SessionContext);

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
            name={ strings.tabs_yourNews }
            component={ YourNewsTab } 
            options={ {
              tabBarIcon: ({ color }) => (
                <Icon 
                  name={ 'account-heart' } 
                  color={ color } />
              ),
            } } />
        )}
        <Tab.Screen 
          name={ strings.tabs_topStories }
          component={ TopStoriesTab } 
          options={ {
            tabBarIcon: ({ color }) => (
              <Icon 
                name={ 'bulletin-board' } 
                color={ color } />
            ),
          } } />
        <Tab.Screen 
          name={ strings.tabs_live }
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
