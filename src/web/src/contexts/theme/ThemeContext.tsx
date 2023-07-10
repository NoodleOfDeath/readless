import React from 'react';

import {
  CssBaseline,
  ThemeProvider,
  useMediaQuery,
} from '@mui/material';

import { DEFAULT_THEME_CONTEXT } from './types';

import { SessionContext } from '~/contexts';
import { loadTheme } from '~/theme';

type Props = React.PropsWithChildren;

export const ThemeContext = React.createContext(DEFAULT_THEME_CONTEXT);

export function ThemeContextProvider({ children }: Props) {
  
  const { colorScheme } = React.useContext(SessionContext);
  
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  
  const [theme, setTheme] = React.useState(loadTheme(prefersDarkMode ? 'dark' : 'light'));
  const [searchText, setSearchText] = React.useState<string>('');
  const [searchSuggestions, setSearchSuggestions] = React.useState<string[]>([]);

  // Update theme when user preference changes
  React.useEffect(() => {
    setTheme(loadTheme(colorScheme ?? (prefersDarkMode ? 'dark' : 'light')));
  }, [colorScheme, prefersDarkMode]);

  return (
    <ThemeContext.Provider
      value={ {
        searchSuggestions,
        searchText,
        setSearchSuggestions,
        setSearchText,
        theme,
      } }>
      <ThemeProvider theme={ theme }>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
}
