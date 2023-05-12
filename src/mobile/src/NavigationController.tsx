import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Badge } from 'react-native-paper';

import {
  MediaContext,
  Preferences,
  SessionContext,
} from './contexts';

import {
  ActivityIndicator,
  Icon,
  MediaPlayer,
  View,
} from '~/components';
import { useTheme } from '~/hooks';
import {
  BrowseScreen,
  CategoryScreen,
  NAVIGATION_LINKING_OPTIONS,
  OutletScreen,
  ScreenComponentType,
  SearchScreen,
  StackableTabParams,
  SummaryScreen,
  TabParams,
} from '~/screens';

export function TabViewController<T extends TabParams = TabParams>(
  tabs: { component: ScreenComponentType<T, keyof T>, name: keyof T, initialParams?: Partial<T[keyof T]> }[], 
  initialRouteName?: Extract<keyof T, string>
) {
  const Controller = () => {
    const Stack = createNativeStackNavigator<T>();
    const { currentTrack } = React.useContext(MediaContext);
    return (
      <View col>
        <Stack.Navigator initialRouteName={ initialRouteName }>
          {tabs.map(({
            component, initialParams, name, 
          }) => (
            <Stack.Screen
              key={ String(name) }
              name={ name as keyof T }
              component={ component }
              initialParams={ initialParams }
              options={ { headerShown: true } } />
          ))}
        </Stack.Navigator>
        <MediaPlayer visible={ Boolean(currentTrack) } />
      </View>
    );
  };
  return Controller;
}

type TabProps = {
  component: ReturnType<typeof TabViewController>;
  icon: string;
  name: string;
  disabled?: boolean;
  badge?: (preferences: Preferences) => number;
};

const TABS: TabProps[] = [
  {
    component: TabViewController<StackableTabParams>(
      [
        { component: SearchScreen, name:'default' }, 
        { component: SearchScreen, name: 'search' },
        { component: SummaryScreen, name: 'summary' },
        { component: OutletScreen, name: 'outlet' },
        { component: CategoryScreen, name: 'category' },
      ],
      'default'
    ),
    icon: 'newspaper',
    name: 'All News',
  },
  {
    badge: (preferences) => Object.keys(preferences.bookmarkedSummaries ?? {}).filter((summary) => !(summary in (preferences.readSummaries ?? {}))).length ?? 0,
    component: TabViewController<StackableTabParams>(
      [
        {
          component: SearchScreen, 
          initialParams: { onlyCustomNews: true }, 
          name:'default', 
        }, 
        { component: SearchScreen, name: 'search' },
        { component: SummaryScreen, name: 'summary' },
        { component: OutletScreen, name: 'outlet' },
        { component: CategoryScreen, name: 'category' },
      ],
      'default'
    ),
    icon: 'cards',
    name: 'My News',
  },
  {
    component: TabViewController<StackableTabParams>(
      [
        { component: BrowseScreen, name:'default' }, 
        { component: SearchScreen, name: 'search' },
        { component: SummaryScreen, name: 'summary' },
        { component: OutletScreen, name: 'outlet' },
        { component: CategoryScreen, name: 'category' },
      ],
      'default'
    ),
    icon: 'bookshelf',
    name: 'Browse',
  },
];

export default function NavigationController() {
  const theme = useTheme();
  const Tab = createBottomTabNavigator();
  const { ready, preferences } = React.useContext(SessionContext);
  return (
    <React.Fragment>
      {!ready ? (
        <ActivityIndicator animating />
      ) : (
        <NavigationContainer
          theme={ { 
            colors: theme.navContainerColors,
            dark: !theme.isLightMode,
          } }
          fallback={ <ActivityIndicator animating /> }
          linking={ NAVIGATION_LINKING_OPTIONS }>
          <Tab.Navigator>
            {TABS.filter((tab) => !tab.disabled).map((tab) => (
              <Tab.Screen
                key={ tab.name }
                name={ tab.name }
                component={ tab.component }
                options={ {
                  headerShown: false,
                  tabBarIcon: (props) => {
                    const badge = tab.badge ? tab.badge(preferences) : 0;
                    return (
                      <View>
                        {badge > 0 && (
                          <Badge style={ {
                            position: 'absolute', right: 0, top: 0, zIndex: 1,
                          } }>
                            {badge}
                          </Badge>
                        )}
                        <Icon name={ tab.icon } { ...props } color="primary" />
                      </View>
                    );
                  },
                } } />
            ))}
          </Tab.Navigator>
        </NavigationContainer>
      )}
    </React.Fragment>
  );
}