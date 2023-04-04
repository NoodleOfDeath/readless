import React from 'react';

import {
  CssBaseline,
  ThemeProvider,
  useMediaQuery,
} from '@mui/material';

import { DEFAULT_APP_STATE_CONTEXT } from './types';

import LoginDialog from '~/components/login/LoginDialog';
import { SessionContext } from '~/contexts';
import { loadTheme } from '~/theme';

type Props = React.PropsWithChildren;

export const AppStateContext = React.createContext(DEFAULT_APP_STATE_CONTEXT);

export function AppStateContextProvider({ children }: Props) {
  
  const { preferences: { displayMode } } = React.useContext(SessionContext);
  
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  
  const [theme, setTheme] = React.useState(loadTheme(prefersDarkMode ? 'dark' : 'light'));
  const [deferredAction, setDeferredAction] = React.useState<() => void | undefined>();
  const [showLoginDialog, setShowLoginDialog] = React.useState(false);
  const [searchText, setSearchText] = React.useState<string>('');
  const [searchSuggestions, setSearchSuggestions] = React.useState<string[]>([]);

  // Update theme when user preference changes
  React.useEffect(() => {
    setTheme(loadTheme(displayMode ?? (prefersDarkMode ? 'dark' : 'light')));
  }, [displayMode, prefersDarkMode]);
  
  return (
    <AppStateContext.Provider
      value={ {
        deferredAction,
        searchSuggestions,
        searchText,
        setDeferredAction,
        setSearchSuggestions,
        setSearchText,
        setShowLoginDialog,
        showLoginDialog,
        theme,
      } }>
      <ThemeProvider theme={ theme }>
        <CssBaseline />
        {children}
        <LoginDialog 
          defaultAction="logIn" 
          deferredAction={ deferredAction }
          alert='PLEASE_LOG_IN' 
          open={ showLoginDialog } 
          onClose={ () => setShowLoginDialog(false) } 
          onSuccess={ () => setShowLoginDialog(false) } />
      </ThemeProvider>
    </AppStateContext.Provider>
  );
}
