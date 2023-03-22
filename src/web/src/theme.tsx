import { PaletteMode, createTheme } from '@mui/material';

export const loadTheme = (mode: PaletteMode = 'light') => {
  const lightMode = mode === 'light';
  return createTheme({
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
        paper: lightMode
          ? 'linear-gradient(to bottom, #FFFFFF, #FEFEFE, #F5F5F5)'
          : 'linear-gradient(to bottom, #1E1E1E, #121212, #0A0A0A)',
      },
      mode,
      primary: {
        dark: '#440000',
        light: '#aa2424',
        main: '#8B0000',
      },
      secondary: { main: '#1E88E5' },
      text: {
        disabled: lightMode ? '#bdbdbd' : '#757575',
        primary: lightMode ? '#212121' : '#FFFFFF',
        secondary: lightMode ? '#757575' : '#BDBDBD',
      },
    },
    typography: { fontFamily: 'Lato' },
  });
};
