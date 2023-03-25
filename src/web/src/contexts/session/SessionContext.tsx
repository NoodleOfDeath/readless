import React from 'react';

import { useMediaQuery } from '@mui/material';
import ms from 'ms';
import {
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

import {
  clearCookie,
  getCookie,
  setCookie,
} from './cookies';
import {
  NULL_SESSION,
  Preferences,
  SetSearchTextOptions,
  SetSessionOptions,
  UserData,
  UserDataProps,
} from './types';

import API, { headers } from '@/api';
import { AppPathName } from '@/pages';
import { loadTheme } from '@/theme';

type Props = React.PropsWithChildren;

export const COOKIES = {
  preferences: 'preferences',
  userData: 'userData',
};

// 2 days
export const DEFAULT_SESSION_DURATION_MS = ms('2d');

export const SessionContext = React.createContext(NULL_SESSION);

export function SessionContextProvider({ children }: Props) {
  
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
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
      if (!newData && options?.updateCookie) {
        return (prev = undefined);
      }
      if (options?.updateCookie) {
        setCookie(COOKIES.userData, JSON.stringify(newData), {
          expires: DEFAULT_SESSION_DURATION_MS,
          path: '/',
        });
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
      console.log(userData);
      setUserData(userData);
    } catch (e) {
      setUserData();
    }
  }, []);

  // Update theme when user preference changes
  React.useEffect(() => {
    setTheme(loadTheme(displayMode ?? (prefersDarkMode ? 'dark' : 'light')));
  }, [displayMode, prefersDarkMode]);

  // Save preferences as cookie when they change
  React.useEffect(() => {
    setCookie(COOKIES.preferences, JSON.stringify(preferences), {
      expires: DEFAULT_SESSION_DURATION_MS,
      path: '/',
      sameSite: 'None',
      secure: true,
    });
  }, [preferences]);
  
  const pathActions = React.useMemo<Partial<Record<AppPathName, (() => void)>>>(() => {
    return {
      '/login': () => {
        if (userData?.isLoggedIn) {
          navigate('/');
          return;
        }
      },
      '/logout': () => {
        API.logout({}, { headers: headers({ token: userData?.tokenString }) })
          .catch(console.error)
          .finally(() => {
            setUserData();
            navigate('/login');
          });
      },
      '/profile': () => {
        if (!userData?.isLoggedIn) {
          navigate('/login');
          return;
        }
      },
      '/reset-password': () => {
        if (userData?.isLoggedIn) {
          navigate('/');
          return;
        }
        if (!userData?.userId) {
          navigate('/login');
          return;
        }
      },
      '/verify': () => {
        const verificationCode = searchParams.get('vc');
        const otp = searchParams.get('otp');
        if (!verificationCode && !otp) {
          navigate('/error');
          return;
        }
        if (verificationCode) {
          API.verifyAlias({ verificationCode }).then(({ error }) => {
            if (error && error.code) {
              navigate(`/error?error=${JSON.stringify(error)}`);
              return;
            }
            navigate(`/success?${new URLSearchParams({
              msg: 'Your email has been successfully verfied. Redirecting you to the login in page...',
              r: '/login',
              t: '3000',
            }).toString()}`);
          }).catch((e) => {
            console.error(e);
            navigate('/error');
          });
        } else if (otp) {
          API.verifyOtp({ otp }).then(({ data, error }) => {
            if (error && error.code) {
              navigate(`/error?error=${JSON.stringify(error)}`);
              return;
            }
            setUserData(data, { updateCookie: true });
            navigate('/reset-password');
          }).catch((e) => {
            console.error(e);
            navigate('/error');
          });
        }
      },
    };
  }, [navigate, searchParams, userData?.isLoggedIn, userData?.tokenString, userData?.userId]);
  
  React.useEffect(() => {
    // record page visit
    API.recordMetric({
      data: { path: location },
      type: 'nav',
      userAgent: navigator.userAgent,
    })
      .catch(console.error);
    const action = pathActions[location.pathname];
    action?.();
  }, [location, pathActions]);

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
      } }>
      {children}
    </SessionContext.Provider>
  );
}
