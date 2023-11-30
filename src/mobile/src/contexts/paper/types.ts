import { StyleSheet } from 'react-native';

import { DarkTheme } from '@react-navigation/native';
import { DefaultTheme } from 'react-native-paper';

import { SYSTEM_FONT } from '~/components';

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
        divider: { backgroundColor: darkMode ? '#666' : '#ccc' },
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
        tableViewCell: { backgroundColor: darkMode ? '#2c2c2c' : '#f9f9f9' },
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

export const LIGHT_THEME = makeTheme(false);
export const DARK_THEME = makeTheme(true);
