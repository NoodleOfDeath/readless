import React from 'react';

import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { useColorScheme } from 'react-native';

import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import SettingsScreen from './screens/SettingsScreen';

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
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ color, size }) => {
            const icons: {[key:string]: string} = {
              Home: 'home',
              Profile: 'user',
              Settings: 'cog',
            };
            return (
              <Icon
                name={icons[route.name]}
                color={color}
                size={size}
              />
            );
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
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