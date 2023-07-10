import { createTheme } from '@mui/material';

import { ColorScheme } from './contexts';

export const loadTheme = (scheme: ColorScheme = 'light') => {
  const darkMode = scheme === 'dark';
  return createTheme({
    breakpoints: {
      values: {
        lg: 900,
        md: 750,
        sm: 400,
        xl: 1200,
        xs: 0,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: ({ theme, ownerState }) => {
            if (theme.palette.mode === 'light') {
              return { color: ownerState.variant === 'contained' ? '#FFFFFF' : theme.palette.primary.main };
            } else {
              return { color: ownerState.variant === 'contained' ? '#FFFFFF' : theme.palette.primary.light };
            }
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: ({ theme }) => {
            if (theme.palette.mode === 'light') {
              return {
                background: 
                'linear-gradient(to bottom, #FFFFFF, #FEFEFE, #F5F5F5)', 
              };
            } else {
              return { background: 'linear-gradient(to bottom, #1E1E1E, #121212, #0A0A0A)' };
            }
          },
        },
      },
    },
    palette: {
      background: {
        paper: darkMode
          ? 'linear-gradient(to bottom, #1E1E1E, #121212, #0A0A0A)'
          : 'linear-gradient(to bottom, #FFFFFF, #FEFEFE, #F5F5F5)',
      },
      mode: scheme === 'dark' ? 'dark' : 'light',
      primary: {
        dark: '#440000',
        light: '#aa2424',
        main: '#8b0000',
      },
      secondary: { main: '#e8b61e' },
      text: {
        disabled: darkMode ? '#757575' : '#bdbdbd',
        primary: darkMode ? '#FFFFFF' : '#212121',
        secondary: darkMode ? '#BDBDBD' : '#757575',
      },
    },
    typography: { fontFamily: 'AnekLatin' },
  });
};
