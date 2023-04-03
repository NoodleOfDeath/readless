import React from 'react';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { NavigationContainer } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import { AppStateContextProvider } from '~/contexts';
import { useTheme } from '~/hooks';
import { NAVIGATION_LINKING_OPTIONS, SCREENS } from '~/screens';
import { WhatsNewScreen } from '~/screens';

export default function App() {
  const theme = useTheme();
  const Tab = createBottomTabNavigator();
  const [showWhatsNew, setShowWhatsNew] = React.useState(true);
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
    </AppStateContextProvider>
  );
}
