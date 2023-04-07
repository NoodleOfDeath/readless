import React from 'react';
import { StyleSheet, useColorScheme } from 'react-native';

import { SessionContext } from '~/contexts';

const makeTheme = (isLightMode: boolean) => {
  return {
    colors: {
      contrastText: '#fff',
      error: '#f44336',
      primary: '#8b0000',
      text: isLightMode ? '#000' : '#fff',
      textDark: '#000',
    },
    isLightMode,
    ...StyleSheet.create({
      components: {
        // containers
        buttonGroup: {
          backgroundColor: isLightMode ? '#fff' : '#000',
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
          backgroundColor: isLightMode ? '#eee' : '#111',
          marginBottom: 8,
          marginLeft: 16,
          marginRight: 16,
          padding: 16,
        },
        category: {
          backgroundColor: '#8b0000',
          marginBottom: 8,
          padding: 8,
        },
        dialog: {
          backgroundColor: isLightMode ? '#eee' : '#111',
          borderColor: '#8b0000',
          borderRadius: 8,
          borderWidth: 5,
          minHeight: '60%',
          minWidth: '70%',
        },
        dialogBackdrop: {
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.3)',
          height: '100%',
          justifyContent: 'center',
          position: 'absolute',
          width: '100%',
        },
        divider: {
          height: StyleSheet.hairlineWidth,
          marginBottom: 6,
          marginTop: 6,
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
        input: { color: isLightMode ? '#000' : '#fff' },
        outlined: {
          borderColor: '#8b0000',
          borderWidth: 2,
        },
        rounded: { borderRadius: 8 },
        searchBar: {
          backgroundColor: isLightMode ? '#fff' : '#000',
          borderRadius: 8,
          marginBottom: 8,
          marginTop: 8,
          overflow: 'hidden',
          width: '100%',
        },
      },
      typography: {
        // typographies
        base: { fontFamily: 'Lato' },
        body1: {
          fontFamily: 'Lato',
          fontSize: 16, // normal
        },
        body2: {
          fontFamily: 'Lato',
          fontSize: 14,
        },
        caption: {
          fontFamily: 'Lato',
          fontSize: 13,
        },
        code: { fontFamily: 'DM Mono' },
        subtitle1: {
          fontFamily: 'Lato',
          fontSize: 16,
          paddingBottom: 2,
          paddingTop: 2,
        },
        subtitle1Center: {
          fontFamily: 'Lato',
          fontSize: 16,
          justifyContent: 'center',
          paddingBottom: 2,
          paddingTop: 2,
          textAlign: 'center',
        },
        subtitle2: {
          fontFamily: 'Lato',
          fontSize: 15, 
          paddingBottom: 2,
          // normal
          paddingTop: 2,
        },
        title1: {
          fontFamily: 'Lato',
          fontSize: 20,
          paddingBottom: 2,
          paddingTop: 2,
        },
        title2: {
          fontFamily: 'Lato',
          fontSize: 18,
          paddingBottom: 2,
          paddingTop: 2,
        },
        titleBold: {
          fontFamily: 'Lato',
          fontSize: 20,
          fontWeight: 'bold',
        },
      },
    }),
    navContainerColors: {
      background: isLightMode ? '#fff' : '#1e1e1e',
      border: isLightMode ? '#bdbdbd' : '#757575',
      card: isLightMode ? '#fff' : '#1e1e1e',
      notification: '#8b0000',
      primary: '#8b0000',
      text: isLightMode ? '#212121' : '#fff',
    },
  };
};

const LIGHT_THEME = makeTheme(true);
const DARK_THEME = makeTheme(false);

export const CATEGORY_ICONS = {
  Art: 'palette',
  'Artificial Intelligence': 'brain',
  Automotive: 'car',
  Books: 'book-open-variant',
  Business: 'domain',
  Crime: 'police-badge',
  Cryptocurrency: 'bitcoin',
  Culture: 'cannabis',
  Disasters: 'weather-tornado',
  Economics: 'cash',
  Education: 'school',
  Energy: 'barrel',
  Entertainment: 'popcorn',
  Environment: 'sprout',
  Fashion: 'shoe-heel',
  Finance: 'currency-usd',
  Food: 'food',
  Gaming: 'controller-classic',
  Geopolitics: 'handshake',
  Health: 'weight-lifter',
  Healthcare: 'medical-bag',
  History: 'pillar',
  'Home Improvement': 'home-heart',
  Inspiration: 'lightbulb-on',
  Journalism: 'feather',
  Labor: 'briefcase',
  Legal: 'gavel',
  Lifestyle: 'shoe-sneaker',
  Media: 'account-group',
  Medicine: 'needle',
  Music: 'music',
  Obituary: 'grave-stone',
  Other: 'progress-question',
  Pandemic: 'virus',
  Parenting: 'human-male-child',
  Pets: 'dog',
  Philosophy: 'head-dots-horizontal',
  Politics: 'bank-outline',
  'Pop Culture': 'bullhorn',
  Productivity: 'tools',
  'Real Estate': 'home-group',
  Religion: 'cross',
  Robotics: 'robot-industrial',
  Royalty: 'crown',
  Scandal: 'alert',
  Science: 'flask',
  Shopping: 'shopping',
  Space: 'space-station',
  Sports: 'basketball',
  Technology: 'chip',
  Television: 'television-classic',
  Tragedy: 'drama-masks',
  Transportation: 'bike',
  Travel: 'airplane',
  'U.S. News': 'star-circle',
  Weather: 'weather-partly-cloudy',
  Wildlife: 'rabbit',
  'World News': 'earth',
};

// eslint-disable-next-line @typescript-eslint/ban-types
export function useTheme() {
  const { preferences: { displayMode } } = React.useContext(SessionContext);

  const colorScheme = useColorScheme();
  
  return (displayMode ?? colorScheme) === 'light' ? LIGHT_THEME : DARK_THEME;
  
}
