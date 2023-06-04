import React from 'react';
import { StyleSheet, useColorScheme } from 'react-native';

import { DarkTheme, DefaultTheme } from '@react-navigation/native';

import { Preferences, SessionContext } from '~/contexts';

const makeTheme = (lightMode: boolean, preferences: Preferences) => {
  return {
    colors: {
      contrastText: '#fff',
      error: '#f44336',
      inactive: lightMode ? '#aaa' : '#777',
      invertText: lightMode ? '#fff' : '#000',
      primary: '#8b0000',
      rowEven: lightMode ? '#eaeaea' : '#202020',
      rowOdd: lightMode ? '#e9e9e9' : '#222',
      text: lightMode ? '#000' : '#fff',
      textDark: '#000',
      textDisabled: lightMode ? '#aaa' : '#888',
      textSecondary: lightMode ? '#888' : '#999',
    },
    // containers
    components: 
      StyleSheet.create({
        button: { backgroundColor: lightMode ? '#eee' : '#2a2a2a' },
        buttonDisabled: { 
          backgroundColor: lightMode ? '#ddd' : '#333',
          color: lightMode ? '#888' : '#999',
        },
        buttonSelected: {
          backgroundColor: '#8b0000',
          color: '#fff',
        },
        buttonText: { padding: 4 },
        card: { backgroundColor: lightMode ? '#fefefe' : '#010101' },
        dialog: {
          backgroundColor: lightMode ? '#ddd' : '#111',
          borderColor: '#8b0000',
          borderRadius: 12,
          borderWidth: 5,
        },
        divider: {
          backgroundColor: lightMode ? '#222' : '#ddd',
          height: StyleSheet.hairlineWidth,
          marginBottom: 3,
          marginTop: 3,
        },
        flexCol: {
          flex: 1,
          flexDirection: 'column',
          flexGrow: 1,
        },
        flexRow: {
          flex: 1,
          flexDirection: 'row',
          flexGrow: 1,
        },
        input: { 
          backgroundColor: lightMode ? '#ddd' : '#111',
          color: lightMode ? '#000' : '#fff',
        }, 
        menu: {
          backgroundColor: lightMode ? '#fefefe' : '#010101',
          borderColor: '#888',
          borderWidth: 1,
          marginBottom: 12,
          maxWidth: 300,
          overflow: 'scroll',
          padding: 12,
        },
        outlined: {
          borderColor: lightMode ? '#8b0000' : '#fff',
          borderWidth: 1,
        },
        rounded: { borderRadius: 12 },
        sampler: { backgroundColor: lightMode ? '#aaa' : '#444' },
        searchBar: {
          fontFamily: preferences.fontFamily,
          overflow: 'visible',
          padding: 0,
          width: '100%',
        },
        speedDialButton: {
          backgroundColor: lightMode ? '#eee' : '#2a2a2a',
          bottom: 32,
          padding: 12,
          position: 'absolute',
          right: 32,
          zIndex: 300,
        },
        surface: {
          backgroundColor: lightMode ? '#fff' : '#000',
          color: lightMode ? '#000' : '#fff',
        },
        tabSwitcher: {
          backgroundColor: lightMode ? '#eee' : '#2a2a2a',
          color: lightMode ? '#000' : '#fff',
        },
      }),
    isLightMode: lightMode,   
    navContainerTheme: {
      ...(lightMode ? DefaultTheme : DarkTheme),
      colors: {
        ...(lightMode ? DefaultTheme : DarkTheme).colors,
        background: lightMode ? '#efefef' : '#1e1e1e',
        border: lightMode ? '#bdbdbd' : '#757575',
        card: lightMode ? '#fff' : '#1e1e1e',
        notification: '#8b0000',
        primary: '#8b0000',
        text: lightMode ? '#212121' : '#fff',
      },
      dark: !lightMode,
    },
  };
};

// eslint-disable-next-line @typescript-eslint/ban-types
export function useTheme() {

  const preferences = React.useContext(SessionContext);

  const LIGHT_THEME = makeTheme(true, preferences);
  const DARK_THEME = makeTheme(false, preferences);

  const colorScheme = useColorScheme();

  return ((preferences.displayMode ?? colorScheme) === 'dark') ? DARK_THEME : LIGHT_THEME;
  
}
