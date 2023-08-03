import React from 'react';
import { StyleSheet, useColorScheme } from 'react-native';

import { DarkTheme, DefaultTheme } from '@react-navigation/native';

import { SYSTEM_FONT } from '~/components';
import { SessionContext } from '~/contexts';

const makeTheme = (darkMode: boolean) => {
  return {
    colors: {
      backgroundTranslucent: 'rgba(255, 255, 255, 0.3)',
      contrastText: '#fff',
      destructive: darkMode ? '#ff0000' : '#ff0000',
      error: '#f44336',
      headerBackground: darkMode ? '#303030' : '#f0f0f0',
      inactive: darkMode ? '#777' : '#aaa',
      invertText: darkMode ? '#000' : '#fff',
      link: darkMode ? '#aaaaee' : '#8888ee',
      paper: darkMode ? '#242424' : '#fff',
      primary: '#c00000',
      primaryDark: '#8b0000',
      primaryDisabled: '#A23333',
      primaryLight: '#d90000',
      rowEven: darkMode ? '#101010' : '#efefef',
      rowOdd: darkMode ? '#222' : '#e9e9e9',
      secondary: '#F73378',
      shadowColor: darkMode ? '#fff' : '#000',
      success: '#4caf50',
      text: darkMode ? '#fff' : '#000',
      textDark: '#000',
      textDisabled: darkMode ? '#888' : '#aaa',
      textHighlightBackground: 'yellow',
      textSecondary: darkMode ? '#ccc' : '#888',
    },
    // containers
    components: 
      StyleSheet.create({
        card: { backgroundColor: darkMode ? '#242424' : '#fff' },
        cardBig: { backgroundColor: darkMode ? '#242424' : '#fff' },
        chip: {
          alignItems: 'center',
          justifyContent: 'center',
        },
        chipContained: {
          backgroundColor: darkMode ? '#242424' : '#fff',
          borderRadius: 500,
          color: darkMode ? '#fff' : '#000',
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
          backgroundColor: darkMode ? '#800000' : '#800000',
          borderRadius: 500,
          color: '#fff',
        },
        divider: {
          backgroundColor: darkMode ? '#888' : '#888',
          height: StyleSheet.hairlineWidth,
          marginBottom: 1,
          marginTop: 1,
          opacity: 0.5,
        },
        input: { 
          backgroundColor: darkMode ? '#111' : '#ddd',
          borderRadius: 500,
          color: darkMode ? '#fff' : '#000',
        }, 
        outlined: {
          borderColor: darkMode ? '#fff' : '#000',
          borderWidth: 1,
        },
        searchBar: { fontFamily: SYSTEM_FONT },
      }),
    isDarkMode: darkMode,   
    navContainerTheme: {
      ...(darkMode ? DarkTheme : DefaultTheme),
      colors: {
        ...(darkMode ? DarkTheme.colors : DefaultTheme),
        background: darkMode ? '#030303' : '#e4e4e4',
        border: darkMode ? '#757575' : '#bdbdbd',
        card: darkMode ? '#1e1e1e' : '#fff',
        notification: '#c00000',
        primary: '#c00000',
        text: darkMode ? '#fff' : '#212121',
      },
      dark: darkMode,
    },
  };
};

// eslint-disable-next-line @typescript-eslint/ban-types
export function useTheme() {
  const preferences = React.useContext(SessionContext);
  const LIGHT_THEME = makeTheme(false);
  const DARK_THEME = makeTheme(true);
  const colorScheme = useColorScheme();
  return ((preferences.colorScheme && preferences.colorScheme !== 'system' ? preferences.colorScheme : colorScheme) === 'dark') ? DARK_THEME : LIGHT_THEME;
  
}
