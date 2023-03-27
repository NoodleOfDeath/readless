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
  
  React.useEffect(() => {
    setCookie(COOKIES.preferences, JSON.stringify(preferences));
  }, [preferences]);

  // Convenience function to set a preference
  const preferenceSetter = React.useCallback(<Key extends keyof Preferences>(key: Key) =>
    (value?: Preferences[Key] | ((prev: Preferences[Key]) => Preferences[Key])) => {
      setPreferences((preferences) => {
        const newPrefs = { ...preferences };
        if (!value) {
          delete newPrefs[key];
        } else {
          newPrefs[key] =
            value instanceof Function ? value(preferences[key]) : value;
        }
        return (preferences = newPrefs);
      });
    }, []);

  const { setDisplayMode, setConsumptionMode } = React.useMemo(() => {
    return {
      setConsumptionMode: preferenceSetter('consumptionMode'),
      setDisplayMode: preferenceSetter('displayMode'),
    };
  }, [preferenceSetter]);
  
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
          router.push('/');
          return;
        }
      },
      '/logout': () => {
        withHeaders(API.logout)({}).then(console.log).catch(console.error).finally(() => {
          setUserData();
          router.push('/login');
        });
      },
      '/profile': () => {
        if (!userData?.isLoggedIn || !userData?.tokenString) {
          router.push('/login');
          return;
        }
      },
      '/reset-password': () => {
        if (userData?.isLoggedIn && userData?.tokenString) {
          router.push('/');
          return;
        }
        if (!userData?.userId) {
          router.push('/login');
          return;
        }
      },
      '/verify': async () => {
        const verificationCode = JSON.stringify(searchParams['vc']);
        const otp = JSON.stringify(searchParams['otp']);
        if (!verificationCode && !otp) {
          router.push('/error');
          return;
        }
        if (verificationCode) {
          try {
            const { error } = await withHeaders(API.verifyAlias)({ verificationCode });
            if (error && error.code) {
              router.push(`/error?error=${JSON.stringify(error)}`);
              return;
            }
            router.push(`/success?${new URLSearchParams({
              msg: 'Your email has been successfully verfied. Redirecting you to the login in page...',
              r: '/login',
              t: '3000',
            }).toString()}`);
          } catch (e) {
            console.error(e);
            router.push('/error');
          }
        } else if (otp) {
          try {
            const { data, error } = await withHeaders(API.verifyOtp)({ otp });
            if (error && error.code) {
              router.push(`/error?error=${JSON.stringify(error)}`);
              return;
            }
            setUserData(data, { updateCookie: true });
            router.push('/reset-password');
          } catch (e) {
            console.error(e);
            router.push('/error');
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
