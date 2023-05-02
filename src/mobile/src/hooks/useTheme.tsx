import React from 'react';
import { StyleSheet, useColorScheme } from 'react-native';

import { Preferences, SessionContext } from '~/contexts';

const makeTheme = (lightMode: boolean, preferences: Preferences) => {
  return {
    colors: {
      contrastText: '#fff',
      error: '#f44336',
      inactive: lightMode ? '#888' : '#999',
      invertText: lightMode ? '#fff' : '#000',
      primary: '#8b0000',
      rowEven: lightMode ? '#fcfcfc' : '#202020',
      rowOdd: lightMode ? '#fafafa' : '#222',
      text: lightMode ? '#000' : '#fff',
      textDark: '#000',
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
        card: {
          backgroundColor: lightMode ? '#fefefe' : '#010101',
          marginBottom: 12,
          overflow: 'visible',
          padding: 12,
        },
        dialog: {
          backgroundColor: lightMode ? '#ddd' : '#111',
          borderColor: '#8b0000',
          borderRadius: 12,
          borderWidth: 5,
        },
        divider: {
          backgroundColor: lightMode ? '#222' : '#ddd',
          height: StyleSheet.hairlineWidth,
          marginBottom: 6,
          marginTop: 6,
        },
        fab: {
          bottom: 96,
          position: 'absolute',
          right: 32,
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
        outlined: {
          borderColor: '#8b0000',
          borderWidth: 1,
        },
        rounded: { borderRadius: 12 },
        searchBar: {
          fontFamily: preferences.fontFamily,
          overflow: 'visible',
          width: '100%',
        },
        surface: {
          backgroundColor: lightMode ? '#fff' : '#000',
          color: lightMode ? '#000' : '#fff',
        },
        tabSwitcher: {
          backgroundColor: lightMode ? '#eee' : '#2a2a2a',
          color: lightMode ? '#000' : '#fff',
        },
        toastDefault: {
          backgroundColor: lightMode ? '#ddd' : '#111',
          borderColor: '#8b0000',
          borderRadius: 12,
          borderWidth: 5,
          color: lightMode ? '#000' : '#fff',
        },
      }),
    isLightMode: lightMode,   
    navContainerColors: {
      background: lightMode ? '#fff' : '#1e1e1e',
      border: lightMode ? '#bdbdbd' : '#757575',
      card: lightMode ? '#fff' : '#1e1e1e',
      notification: '#8b0000',
      primary: '#8b0000',
      text: lightMode ? '#212121' : '#fff',
    },
  };
};

// eslint-disable-next-line @typescript-eslint/ban-types
export function useTheme() {

  const { preferences } = React.useContext(SessionContext);

  const LIGHT_THEME = makeTheme(true, preferences);
  const DARK_THEME = makeTheme(false, preferences);

  const colorScheme = useColorScheme();
  
  return ((preferences.displayMode ?? colorScheme) === 'light') ? LIGHT_THEME : DARK_THEME;
  
}
