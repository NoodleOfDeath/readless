import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import { MenuProvider } from 'react-native-popup-menu';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTheme } from './components/theme';
import SessionContextProvider from './contexts/SessionContext';
import { SCREENS } from './screens';
import OnboardingScreen from './screens/onboarding/OnboardingScreen';
import { linkingOptions } from './types';

export default function TabController() {
  const theme = useTheme();
  const Tab = createBottomTabNavigator();
  const [showOnboarding, setShowOnboarding] = React.useState(true);
  return (
    <SessionContextProvider>
      <MenuProvider>
        <NavigationContainer
          theme={ {
            colors: theme.navContainerColors,
            dark: !theme.isLightMode,
          } }
          linking={ linkingOptions }>
          {showOnboarding ? (
            <OnboardingScreen onClose={ () => setShowOnboarding(false) } />
          ) : (
            <Tab.Navigator
              initialRouteName="Discover"
              screenOptions={ { headerShown: true } }>
              {SCREENS.map((screen) => (
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
      </MenuProvider>
    </SessionContextProvider>
  );
}
