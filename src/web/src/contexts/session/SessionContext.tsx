import React from 'react';

import {
  CssBaseline,
  ThemeProvider,
  useMediaQuery,
} from '@mui/material';

import {
  clearCookie,
  getCookie,
  setCookie,
} from './cookies';
import {
  FunctionWithRequestParams,
  NULL_SESSION,
  Preferences,
  SetSearchTextOptions,
  SetSessionOptions,
  UserData,
  UserDataProps,
} from './types';

import API from '@/api';
import { useRouter } from '@/next/router';
import { loadTheme } from '@/theme';

type Props = React.PropsWithChildren;

export const COOKIES = {
  preferences: 'preferences',
  userData: 'userData',
};

export const SessionContext = React.createContext(NULL_SESSION);

export function SessionContextProvider({ children }: Props) {
  
  const router = useRouter();
  const { searchParams, setSearchParams } = React.useMemo(() => router, [router]);

  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  
  const [theme, setTheme] = React.useState(loadTheme(prefersDarkMode ? 'dark' : 'light'));
  const [preferences, setPreferences] = React.useState<Preferences>({});
  const [userDataRaw, setUserDataRaw] = React.useState<UserDataProps | undefined>();

  const userData = React.useMemo(() => userDataRaw ? new UserData(userDataRaw) : undefined, [userDataRaw]);

  const setUserData = 
  (state?: UserDataProps | ((prev?: UserDataProps) => UserDataProps | undefined), options?: SetSessionOptions) => {
    if (!state) {
      setUserDataRaw(undefined);
      clearCookie(COOKIES.userData);
      return;
    }
    setUserDataRaw((prev) => {
      const newData = state instanceof Function ? state(prev) : new UserData(state);
      if (!newData) {
        clearCookie(COOKIES.userData);
        return (prev = undefined);
      }
      if (options?.updateCookie) {
        setCookie(COOKIES.userData, JSON.stringify(newData));
      }
      return (prev = newData);
    });
  };

  const { displayMode, consumptionMode } = React.useMemo(
    () => preferences,
    [preferences]
  );
  const [searchText, setSearchText] = React.useState('');
  const [searchOptions, setSearchOptions] = React.useState<string[]>([]);

  // Convenience function to set a preference
  const preferenceSetter = <Key extends keyof Preferences>(key: Key) =>
    (value?: Preferences[Key] | ((prev: Preferences[Key]) => Preferences[Key])) => {
      setPreferences((preferences) => {
        const newPrefs = { ...preferences };
        if (!value) {
          delete newPrefs[key];
        } else {
          newPrefs[key] =
            value instanceof Function ? value(preferences[key]) : value;
        }
        setCookie(COOKIES.preferences, JSON.stringify(newPrefs));
        return (preferences = newPrefs);
      });
    };

  const setConsumptionMode = preferenceSetter('consumptionMode');
  const setDisplayMode = preferenceSetter('displayMode');
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const withHeaders = React.useCallback(<T extends any[], R>(fn: FunctionWithRequestParams<T, R>): ((...args: T) => R) => {
    if (!userData?.tokenString) {
      return (...args: T) => fn(...args, {});
    }
    return (...args: T) => {
      const requestParams = { headers: { Authorization: `Bearer ${userData.tokenString}` } };
      return fn(...args, requestParams);
    };
  }, [userData?.tokenString]);

  // Load cookies on mount
  React.useEffect(() => {
    try {
      const prefs = JSON.parse(getCookie(COOKIES.preferences) || '{}');
      console.log('shit', prefs);
      setPreferences(prefs);
    } catch (e) {
      setPreferences({});
    }
  }, []);

  React.useEffect(() => {
    try {
      const userData = JSON.parse(getCookie(COOKIES.userData) || '{}');
      setUserData(userData);
    } catch (e) {
      setUserData();
    }
  }, []);

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
          return router.push('/login');
        }
      },
      '/reset-password': () => {
        if (userData?.isLoggedIn && userData?.tokenString) {
          return router.push('/');
        }
        if (!userData?.userId) {
          return router.push('/login');
        }
      },
      '/verify': async () => {
        const verificationCode = typeof searchParams['verificationCode'] === 'string' ? searchParams['verificationCode'] : undefined;
        const otp = typeof searchParams['otp'] === 'string' ? searchParams['otp'] : undefined;
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
            const { error } = await withHeaders(API.verifyOtp)({ otp });
            if (error && error.code) {
              return router.push(`/error?error=${JSON.stringify(error)}`);
            }
            return router.push('/reset-password');
          } catch (e) {
            console.error(e);
            return router.push('/error');
          }
        }
      },
    };
  }, [router, searchParams, userData?.isLoggedIn, userData?.tokenString, userData?.userId, withHeaders]);
  
  React.useEffect(() => {
    // record page visit
    withHeaders(API.recordMetric)({
      data: { path: router.pathname },
      type: 'nav',
      userAgent: navigator.userAgent,
    }).catch(console.error);
    const action = pathActions[router.pathname];
    action?.();
  }, [pathActions, router.pathname, withHeaders]);

  return (
    <SessionContext.Provider
      value={ {
        consumptionMode,
        displayMode,
        preferences,
        searchOptions,
        searchText,
        setConsumptionMode,
        setDisplayMode,
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
        setUserData,
        theme,
        userData,
        withHeaders,
      } }>
      <ThemeProvider theme={ theme }>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </SessionContext.Provider>
  );
}
