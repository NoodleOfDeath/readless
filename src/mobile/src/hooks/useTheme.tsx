import React from 'react';
import { StyleSheet, useColorScheme } from 'react-native';

import { SessionContext } from '~/contexts';

const makeTheme = (lightMode: boolean) => {
  return {
    colors: {
      contrastText: '#fff',
      error: '#f44336',
      invertText: lightMode ? '#fff' : '#000',
      primary: '#8b0000',
      text: lightMode ? '#000' : '#fff',
      textDark: '#000',
    },
    components: {
      // containers
      ...StyleSheet.create({
        buttonGroup: {
          backgroundColor: lightMode ? '#fff' : '#000',
          marginTop: 8,
          overflow: 'hidden',
          width: '100%',
        },
        buttonGroupRow: { width: '100%' },
        buttonSelected: {
          backgroundColor: '#8b0000',
          color: '#fff',
        },
        buttonText: { padding: 4 },
        card: {
          backgroundColor: lightMode ? '#eee' : '#111',
          marginBottom: 8,
          padding: 16,
          position: 'relative',
          zIndex: 2,
        },
        category: {
          backgroundColor: '#8b0000',
          marginBottom: 8,
          padding: 8,
        },
        dialog: {
          backgroundColor: lightMode ? '#ddd' : '#111',
          borderColor: '#8b0000',
          borderRadius: 8,
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
          borderWidth: 2,
        },
        rounded: { borderRadius: 8 },
        searchBar: {
          marginBottom: 8,
          marginTop: 8,
          overflow: 'hidden',
          width: '100%',
        },
        text: { fontFamily: 'Lato' },
        toastDefault: {
          backgroundColor: lightMode ? '#ddd' : '#111',
          borderColor: '#8b0000',
          borderRadius: 8,
          borderWidth: 5,
          color: lightMode ? '#000' : '#fff',
        },
      }),
    },
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

export const LIGHT_THEME = makeTheme(true);
const DARK_THEME = makeTheme(false);

// eslint-disable-next-line @typescript-eslint/ban-types
export function useTheme() {
  const { preferences: { displayMode } } = React.useContext(SessionContext);

  const colorScheme = useColorScheme();
  
  return ((displayMode ?? colorScheme) === 'light') ? LIGHT_THEME : DARK_THEME;
  
}
