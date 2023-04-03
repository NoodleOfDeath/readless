import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { AppStateContextProvider } from '~/contexts';
import { useTheme } from '~/hooks';
import { NAVIGATION_LINKING_OPTIONS, WhatsNewScreen } from '~/screens';
import { TABS } from '~/tabs';

export default function App() {
  const theme = useTheme();
  const Tab = createBottomTabNavigator();
  const [showWhatsNew, setShowWhatsNew] = React.useState(false);
  return (
    <AppStateContextProvider>
      <NavigationContainer
        theme={ {
          colors: theme.navContainerColors,
          dark: !theme.isLightMode,
        } }
        linking={ NAVIGATION_LINKING_OPTIONS }>
        {showWhatsNew ? (
          <WhatsNewScreen onClose={ () => setShowWhatsNew(false) } />
        ) : (
          <Tab.Navigator
            initialRouteName="search"
            screenOptions={ { headerShown: true } }>
            {TABS.map((screen) => (
              <Tab.Screen
                key={ screen.name }
                name={ screen.name }
                component={ screen.component }
                options={ {
                  headerRight: screen.headerRight,
                  tabBarIcon: (props) => (
                    <Icon name={ screen.icon } { ...props } />
                  ),
                } } />
            ))}
          </Tab.Navigator>
        )}
      </NavigationContainer>
    </AppStateContextProvider>
  );
}
