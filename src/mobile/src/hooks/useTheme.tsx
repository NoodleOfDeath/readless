import React from 'react';
import { StyleSheet, useColorScheme } from 'react-native';

import { DarkTheme, DefaultTheme } from '@react-navigation/native';

import { Preferences, SessionContext } from '~/contexts';

const makeTheme = (darkMode: boolean, preferences: Preferences) => {
  return {
    colors: {
      contrastText: '#fff',
      error: '#f44336',
      inactive: darkMode ? '#777' : '#aaa',
      invertText: darkMode ? '#000' : '#fff',
      link: darkMode ? '#aaaaee' : '#8888ee',
      paper: darkMode ? '#424242' : '#fff',
      primary: '#8b0000',
      primaryDark: '#610000',
      primaryLight: '#a00000',
      rowEven: darkMode ? '#101010' : '#efefef',
      rowOdd: darkMode ? '#222' : '#e9e9e9',
      secondary: '#F73378',
      success: '#4caf50',
      text: darkMode ? '#fff' : '#000',
      textDark: '#000',
      textDisabled: darkMode ? '#888' : '#aaa',
      textSecondary: darkMode ? '#999' : '#888',
    },
    // containers
    components: 
      StyleSheet.create({
        card: { backgroundColor: darkMode ? '#424242' : '#fff' },
        chip: {
          alignItems: 'center',
          fontWeight: 'bold',
          justifyContent: 'center',
        },
        chipContained: {
          backgroundColor: darkMode ? '#8b0000' : '#8b0000',
          borderRadius: 500,
          color: '#fff',
          paddingBottom: 8,
          paddingLeft: 24,
          paddingRight: 24,
          paddingTop: 8,
          textTransform: 'uppercase',
        },
        chipDisabled: { 
          backgroundColor: darkMode ? '#A23333' : '#A23333',
          color: darkMode ? '#999' : '#888',
        },
        chipSelected: {
          backgroundColor: darkMode ? '#610000' : '#610000',
          borderRadius: 500,
          color: '#fff',
          fontWeight: 'bold',
          textDecorationLine: 'underline',
        },
        divider: {
          backgroundColor: darkMode ? '#BDBDBD' : '#222',
          height: StyleSheet.hairlineWidth,
          marginBottom: 3,
          marginTop: 3,
        },
        input: { 
          backgroundColor: darkMode ? '#111' : '#ddd',
          color: darkMode ? '#fff' : '#000',
        }, 
        outlined: {
          borderColor: darkMode ? '#fff' : '#000',
          borderWidth: 1,
        },
        searchBar: {
          fontFamily: preferences.fontFamily,
          overflow: 'visible',
          padding: 0,
          width: '100%',
        },
        surface: {
          backgroundColor: darkMode ? '#000' : '#fff',
          color: darkMode ? '#fff' : '#000',
        },
      }),
    isDarkMode: darkMode,   
    navContainerTheme: {
      ...(darkMode ? DarkTheme : DefaultTheme),
      colors: {
        ...(darkMode ? DarkTheme.colors : DefaultTheme),
        background: darkMode ? '#303030' : '#fafafa',
        border: darkMode ? '#757575' : '#bdbdbd',
        card: darkMode ? '#1e1e1e' : '#fff',
        notification: '#8b0000',
        primary: '#8b0000',
        text: darkMode ? '#fff' : '#212121',
      },
      dark: darkMode,
    },
  };
};

// eslint-disable-next-line @typescript-eslint/ban-types
export function useTheme() {

  const preferences = React.useContext(SessionContext);

  const LIGHT_THEME = makeTheme(false, preferences);
  const DARK_THEME = makeTheme(true, preferences);

  const colorScheme = useColorScheme();

  return ((preferences.colorScheme ?? colorScheme) === 'dark') ? DARK_THEME : LIGHT_THEME;
  
}
