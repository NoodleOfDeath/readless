import React from 'react';

import {
  PaletteMode,
  Theme,
  useMediaQuery,
} from '@mui/material';
import Cookies from 'js-cookie';
import ms from 'ms';
import {
  useLocation,
  useNavigate,
  useSearchParams,
} from 'react-router-dom';

import API from '@/api';
import { ConsumptionMode } from '@/components/Post';
import { AppPathName } from '@/pages';
import { loadTheme } from '@/theme';

export type Preferences = {
  displayMode?: PaletteMode;
  consumptionMode?: ConsumptionMode;
};

export type UserData = {
  userId: number;
  jwt: string;
  isLoggedIn?: boolean;
}

export type SetSearchTextOptions = {
  clearSearchParams?: boolean;
};

export type Session = {
  theme: Theme;
  preferences: Preferences;
  userData?: UserData;
  // getters
  displayMode?: PaletteMode;
  consumptionMode?: ConsumptionMode;
  searchText: string;
  searchOptions: string[];
  // setters
  setUserData: React.Dispatch<React.SetStateAction<UserData | undefined>>;
  setDisplayMode: React.Dispatch<React.SetStateAction<PaletteMode | undefined>>;
  setConsumptionMode: React.Dispatch<
    React.SetStateAction<ConsumptionMode | undefined>
  >;
  setSearchText: (
    state: React.SetStateAction<string>,
    opts?: SetSearchTextOptions
  ) => void;
  setSearchOptions: React.Dispatch<React.SetStateAction<string[]>>;
};

type Props = React.PropsWithChildren;

export const NULL_SESSION: Session = {
  consumptionMode: 'concise',
  // getters
  displayMode: 'light',
  preferences: {},
  searchOptions: [],
  searchText: '',
  setConsumptionMode: () => {
    /* placeholder function */
  },
  setDisplayMode: () => {
    /* placeholder function */
  },
  setSearchOptions: () => {
    /* placeholder function */
  },
  setSearchText: () => {
    /* placeholder function */
  },
  setUserData: () => {
    /* placeholder function */
  },
  theme: loadTheme(),
};

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
  const [userData, setUserData] = React.useState<UserData | undefined>();

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
      const prefs = JSON.parse(Cookies.get(COOKIES.preferences) || '{}');
      setPreferences(prefs);
    } catch (e) {
      setPreferences({});
    }
    try {
      const userData = JSON.parse(Cookies.get(COOKIES.userData) || '{}');
      setUserData(userData);
    } catch (e) {
      setUserData(undefined);
    }
  }, []);

  // Update theme when user preference changes
  React.useEffect(() => {
    setTheme(loadTheme(displayMode ?? (prefersDarkMode ? 'dark' : 'light')));
  }, [displayMode, prefersDarkMode]);

  // Save preferences as cookie when they change
  React.useEffect(() => {
    Cookies.set(COOKIES.preferences, JSON.stringify(preferences), {
      expires: DEFAULT_SESSION_DURATION_MS,
      path: '/',
    });
  }, [preferences]);

  // Save userData as a cookie it changes
  React.useEffect(() => {
    Cookies.set(COOKIES.userData, JSON.stringify(userData), {
      expires: DEFAULT_SESSION_DURATION_MS,
      path: '/',
    });
  }, [userData]);
  
  const pathActions = React.useMemo<Partial<Record<AppPathName, (() => void)>>>(() => {
    return {
      '/login': () => {
        if (userData?.isLoggedIn) {
          navigate('/');
          return;
        }
      },
      '/logout': () => {
        const jwt = userData?.jwt ?? '';
        API.logout({ ...userData }, { headers: { Authorization: `Bearer ${jwt}` } })
          .catch(console.error)
          .finally(() => {
            setUserData(undefined);
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
            setUserData(data);
            navigate('/reset-password');
          }).catch((e) => {
            console.error(e);
            navigate('/error');
          });
        }
      },
    };
  }, [navigate, searchParams, userData]);
  
  React.useEffect(() => {
    // record page visit
    API.recordMetric({
      data: { path: location },
      type: 'nav',
      userAgent: navigator.userAgent,
    })
      .catch(console.error);
    const action = pathActions[location.pathname as AppPathName];
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
