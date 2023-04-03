import React from 'react';

import {
  CssBaseline,
  ThemeProvider,
  useMediaQuery,
} from '@mui/material';

import {
  SetSearchTextOptions,
  SetSessionOptions,
} from './types';

import LoginDialog from '~/components/login/LoginDialog';
import { SessionContext } from '~/contexts';
import { useRouter } from '~/next/router';
import { loadTheme } from '~/theme';

type Props = React.PropsWithChildren;

export const AppStateContext = React.createContext(NULL_SESSION);

export function AppStateContextProvider({ children }: Props) {
  
  const router = useRouter();
  const { searchParams, setSearchParams } = React.useMemo(() => router, [router]);

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  
  const [theme, setTheme] = React.useState(loadTheme(prefersDarkMode ? 'dark' : 'light'));
  const [showLoginDialog, setShowLoginDialogRaw] = React.useState(false);

  const setShowLoginDialog = (show: React.SetStateAction<boolean>, deferredAction?: () =>void) => {
    setShowLoginDialogRaw((prev) => {
      const result = show instanceof Function ? show(prev) : show;
      if (result) {
        setDeferredAction(() => deferredAction);
      }
      return result;
    });
  };

  const [deferredAction, setDeferredAction] = React.useState<() => void | undefined>();

  // Update theme when user preference changes
  React.useEffect(() => {
    setTheme(loadTheme(displayMode ?? (prefersDarkMode ? 'dark' : 'light')));
  }, [displayMode, prefersDarkMode]);
  
  const pathActions = React.useMemo<Partial<Record<string, (() => void)>>>(() => {
    return {
      '/login': () => {
        if (userData?.isLoggedIn && userData?.tokenString) {
          return router.push('/');
        }
      },
      '/logout': async () => {
        try {
          await withHeaders(API.logout)({});
        } catch (e) {
          console.error(e);
        } finally {
          setUserData();
          router.push('/login');
        }
      },
      '/profile': () => {
        if (!userData?.isLoggedIn || !userData?.tokenString) {
          return router.push('/logout');
        }
      },
      '/reset-password': () => {
        if (userData?.isLoggedIn && userData?.tokenString) {
          return router.push('/');
        }
        if (!userData?.userId) {
          return router.push('/logout');
        }
      },
      '/verify': async () => {
        const verificationCode = searchParams.get('vc');
        const otp = searchParams.get('otp');
        if (!verificationCode && !otp) {
          return router.push('/error');
        }
        if (verificationCode) {
          try {
            const { error } = await withHeaders(API.verifyAlias)({ verificationCode });
            if (error && error.code) {
              return router.push(`/error?error=${JSON.stringify(error)}`);
            }
            router.push(`/success?${new URLSearchParams({
              msg: 'Your email has been successfully verfied. Redirecting you to the login in page...',
              r: '/login',
              t: '3000',
            }).toString()}`);
          } catch (e) {
            console.error(e);
            return router.push('/error');
          }
        } else if (otp) {
          try {
            const { data, error } = await withHeaders(API.verifyOtp)({ otp });
            if (error && error.code) {
              return router.push(`/error?error=${JSON.stringify(error)}`);
            }
            setUserData(data, { updateCookie: true });
            return router.push('/reset-password');
          } catch (e) {
            console.error(e);
            return router.push('/error');
          }
        }
      },
    };
  }, [router, searchParams, userData?.isLoggedIn, userData?.tokenString, userData?.userId, withHeaders]);
  
  const onPathChange = React.useCallback(() => {
    // record page visit
    withHeaders(API.recordMetric)({
      data: { path: router.pathname },
      type: 'nav',
      userAgent: navigator.userAgent,
    }).catch(console.error);
    const action = pathActions[router.pathname];
    action?.();
  }, [pathActions, router.pathname, withHeaders]);
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => onPathChange(), [userData, router.pathname]);
  
  return (
    <AppStateContext.Provider
      value={ {
        searchOptions,
        searchText,
        setSearchOptions,
        setSearchText: (
          state,
          { clearSearchParams }: SetSearchTextOptions = {}
        ) => {
          setSearchText(state);
          if (clearSearchParams) {
            setSearchParams({});
          }
        },
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
