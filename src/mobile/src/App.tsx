import React from 'react';

import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useColorScheme } from 'react-native';

import AudioScreen from './screens/AudioScreen';
import DiscoverScreen from './screens/DiscoverScreen';
import ProfileScreen from './screens/ProfileScreen';
import SearchScreen from './screens/SearchScreen';
import SkoopScreen from './screens/SkoopScreen';

const SCREENS = [
  {
    name: 'Discover',
    component: DiscoverScreen,
    icon: 'home',
  },
  {
    name: 'Skoop+',
    component: SkoopScreen,
    icon: 'plus',
  },
  {
    name: 'Audio',
    component: AudioScreen,
    icon: 'headphones',
  },
  {
    name: 'Profile',
    component: ProfileScreen,
    icon: 'user',
  },
  {
    name: 'Search',
    component: SearchScreen,
    icon: 'search',
  },
] as const;

function App() {

  const isLightMode = useColorScheme() === 'light';
  const styles = createStyles(isLightMode);

  const Tab = createBottomTabNavigator();

  return (
    <NavigationContainer
      theme={{
        dark: !isLightMode,
        colors: styles.navContainerColors,
      }}
    >
      <Tab.Navigator initialRouteName="Discover">
        {SCREENS.map((screen) => <Tab.Screen key={screen.name} name={screen.name} component={screen.component}
          options={{
            tabBarIcon: (props) => (
              <Icon
                name={screen.icon}  
                {...props}
              />
            ),
          }}
        />)}
      </Tab.Navigator>
    </NavigationContainer>
  );
}

export default App;

function createStyles(isLightMode: boolean) {
  return {
    navContainerColors: {
      primary: '#8B0000',
      background: isLightMode ? 'linear-gradient(to bottom, #FFFFFF, #FEFEFE, #F5F5F5)' : 'linear-gradient(to bottom, #1E1E1E, #121212, #0A0A0A)',
      card: isLightMode ? '#FFFFFF' : '#1E1E1E',
      text: isLightMode ? '#212121' : '#FFFFFF',
      border: isLightMode ? '#bdbdbd' : '#757575',
      notification: '#8B0000',
    }
  };
}