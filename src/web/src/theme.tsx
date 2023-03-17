import { PaletteMode, createTheme } from '@mui/material';

export const loadTheme = (mode: PaletteMode = 'light') => {
  const lightMode = mode === 'light';
  return createTheme({
    palette: {
      mode,
      primary: {
        main: '#8B0000',
        light: '#aa2424',
        dark: '#440000',
      },
      secondary: { main: '#1E88E5' },
      text: {
        primary: lightMode ? '#212121' : '#FFFFFF',
        secondary: lightMode ? '#757575' : '#BDBDBD',
        disabled: lightMode ? '#bdbdbd' : '#757575',
      },
      background: {
        paper: lightMode
          ? 'linear-gradient(to bottom, #FFFFFF, #FEFEFE, #F5F5F5)'
          : 'linear-gradient(to bottom, #1E1E1E, #121212, #0A0A0A)',
      },
    },
    typography: { fontFamily: 'Lato' },
    components: {
      MuiPaper: {
        styleOverrides: {
          root: ({ theme }) => {
            if (theme.palette.mode === 'light') {
              return {
                background: 
                'linear-gradient(to bottom, #FFFFFF, #FEFEFE, #F5F5F5)', 
              };
            } else {
              return { background:'linear-gradient(to bottom, #1E1E1E, #121212, #0A0A0A)' };
            }
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: ({ theme, ownerState }) => {
            if (theme.palette.mode === 'light') {
              return { color: ownerState.variant === 'contained' ? '#FFFFFF' : theme.palette.primary.light };
            } else {
              return { color: ownerState.variant === 'contained' ? '#FFFFFF' : theme.palette.primary.light };
            }
          },
        },
      },
    },
  });
};
