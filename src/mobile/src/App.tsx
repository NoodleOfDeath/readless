import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MenuProvider } from 'react-native-popup-menu';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import OnboardingScreen from './screens/onboarding/OnboardingScreen';
import { SCREENS } from './screens';
import SessionContextProvider from './contexts/SessionContext';
import { linkingOptions } from './types';
import { useTheme } from './components/theme';

export default function TabController() {
  const theme = useTheme();
  const Tab = createBottomTabNavigator();
  const [showOnboarding, setShowOnboarding] = React.useState(true);
  return (
    <SessionContextProvider>
      <MenuProvider>
        <NavigationContainer
          theme={{
            dark: !theme.isLightMode,
            colors: theme.navContainerColors,
          }}
          linking={linkingOptions}
        >
          {showOnboarding ? (
            <OnboardingScreen onClose={() => setShowOnboarding(false)} />
          ) : (
            <Tab.Navigator
              initialRouteName="Discover"
              screenOptions={{ headerShown: true }}
            >
              {SCREENS.map((screen) => (
                <Tab.Screen
                  key={screen.name}
                  name={screen.name}
                  component={screen.component}
                  options={{
                    tabBarIcon: (props) => (
                      <Icon name={screen.icon} {...props} />
                    ),
                    headerRight: screen.headerRight,
                  }}
                />
              ))}
            </Tab.Navigator>
          )}
        </NavigationContainer>
      </MenuProvider>
    </SessionContextProvider>
  );
}
