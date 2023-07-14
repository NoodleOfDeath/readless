import React from 'react';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useFocusEffect } from '@react-navigation/native';

import { SessionContext } from '../core';

import {
  SYSTEM_FONT,
  Screen,
  SummaryList,
} from '~/components';
import { useSummaryClient, useTheme } from '~/hooks';
import { strings } from '~/locales';
import { OldNewsScreen, ScreenProps } from '~/screens';

function OldNewsTab({
  route: _route,
  navigation: _navigation,
}: ScreenProps<'search'>) {
  return <OldNewsScreen />;
}

function YourNewsTab({ 
  route: _route,
  navigation: _navigation,
}: ScreenProps<'search'>) {
  const { getSummaries } = useSummaryClient();
  const { followFilter } = React.useContext(SessionContext);
  const [filter, setFilter] = React.useState(followFilter);
  useFocusEffect(React.useCallback(() => setFilter(followFilter), [followFilter]));
  return ( 
    <SummaryList
      fetch={ getSummaries }
      filter={ filter } />
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
        } }
        initialRouteName={ followCount > 0 ? strings.tabs_yourNews : strings.tabs_topStories }>
        <Tab.Screen
          name={ strings.tabs_oldNews }
          component={ OldNewsTab } />
        {followCount > 0 && (
          <Tab.Screen 
            name={ strings.tabs_yourNews }
            component={ YourNewsTab } />
        )}
        <Tab.Screen 
          name={ strings.tabs_topStories }
          component={ TopStoriesTab } />
        <Tab.Screen 
          name={ strings.tabs_live }
          component={ LivestreamTab } />
      </Tab.Navigator>
    </Screen>
  );

}
