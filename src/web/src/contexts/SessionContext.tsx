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

import API, { FeatureAttributes } from '@/api';
import { ConsumptionMode } from '@/components/Post';
import { loadTheme } from '@/theme';

export type Preferences = {
  displayMode?: PaletteMode;
  consumptionMode?: ConsumptionMode;
};

export type UserData = {
  userId: number;
  jwt: string;
}

export type SetSearchTextOptions = {
  clearSearchParams?: boolean;
};

export type Session = {
  enabledFeatures: Record<string, FeatureAttributes>,
  pathIsEnabled: (path: string) => boolean,
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
  enabledFeatures: {},
  pathIsEnabled: () => false,
  theme: loadTheme(),
  preferences: {},
  // getters
  displayMode: 'light',
  consumptionMode: 'concise',
  searchText: '',
  searchOptions: [],
  // setters
  setUserData: () => {
    /* placeholder function */
  },
  setDisplayMode: () => {
    /* placeholder function */
  },
  setConsumptionMode: () => {
    /* placeholder function */
  },
  setSearchText: () => {
    /* placeholder function */
  },
  setSearchOptions: () => {
    /* placeholder function */
  },
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
  
  const [enabledFeatures, setEnabledFeatures] = React.useState<Record<string, FeatureAttributes>>({});
  const [theme, setTheme] = React.useState(
    loadTheme(prefersDarkMode ? 'dark' : 'light'),
  );
  const [preferences, setPreferences] = React.useState<Preferences>({});
  const [userData, setUserData] = React.useState<UserData | undefined>();

  const { displayMode, consumptionMode } = React.useMemo(
    () => preferences,
    [preferences],
  );
  const [searchText, setSearchText] = React.useState('');
  const [searchOptions, setSearchOptions] = React.useState<string[]>([]);

  // Convenience function to set a preference
  const preferenceSetter = React.useCallback(<Key extends keyof Preferences>(key: Key) =>
    (
      value?: Preferences[Key] | ((prev: Preferences[Key]) => Preferences[Key]),
    ) => {
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
      setDisplayMode: preferenceSetter('displayMode'),
      setConsumptionMode: preferenceSetter('consumptionMode'),
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
    try {
      API.getFeatures()
        .then((response) => {
          setEnabledFeatures(Object.fromEntries(response.data.map((feature) => [feature.name, feature])));
        })
        .catch(console.error);
    } catch (e) {
      console.error(e);
    }
  }, []);

  // Update theme when user preference changes
  React.useEffect(() => {
    setTheme(loadTheme(displayMode ?? (prefersDarkMode ? 'dark' : 'light')));
  }, [displayMode, prefersDarkMode]);

  // Save preferences as cookie when they change
  React.useEffect(() => {
    Cookies.set(COOKIES.preferences, JSON.stringify(preferences), {
      path: '/',
      expires: DEFAULT_SESSION_DURATION_MS,
    });
  }, [preferences]);

  // Save userData as a cookie it changes
  React.useEffect(() => {
    Cookies.set(COOKIES.userData, JSON.stringify(userData), {
      path: '/',
      expires: DEFAULT_SESSION_DURATION_MS,
    });
  }, [userData]);
  
  const pathIsEnabled = React.useCallback((path: string) => enabledFeatures[path]?.enabled === true, [enabledFeatures]);
  
  React.useEffect(() => {
    // record page visit
    API.recordMetric({
      type: 'nav',
      data: { path: location },
      userAgent: navigator.userAgent,
    })
      .catch(console.error);
    // if path is not enabled redirect to home
    switch (location.pathname) {
    case '/login':
      if (userData?.userId) {
        navigate('/');
        return;
      }
      break;
    case '/logout':
      API.logout({ ...userData })
        .then(() => {
          setUserData(undefined);
          navigate('/login');
        }).catch(console.error);
      break;
    case '/profile':
      if (!userData?.userId) {
        navigate('/login');
        return;
      }
      break;
    case '/search':
      if (!pathIsEnabled(location.pathname)) {
        navigate('/');
      }
      break;
    case '/verify/alias': {
      const verificationCode = searchParams.get('v');
      if (!verificationCode) {
        navigate('/error');
        return;
      }
      API.verifyAlias({ verificationCode }).then(({ error }) => {
        if (error) {
          navigate(`/error?error=${JSON.stringify(error)}`);
          return;
        }
        navigate(`/success?${new URLSearchParams({
          msg: 'Your email has been successfully verfied. Redirecting you to the login in page...',
          t: '3000',
          r: '/login',
        }).toString()}`);
      }).catch(console.error);
      break;
    }
    }
  }, [pathIsEnabled, location, navigate, searchParams, userData]);

  return (
    <SessionContext.Provider
      value={ {
        enabledFeatures,
        pathIsEnabled,
        theme,
        preferences,
        userData,
        displayMode,
        consumptionMode,
        searchText,
        searchOptions,
        setUserData,
        setDisplayMode,
        setConsumptionMode,
        setSearchText: (
          state,
          { clearSearchParams }: SetSearchTextOptions = {},
        ) => {
          setSearchText(state);
          if (clearSearchParams) {
            setSearchParams({});
          }
        },
        setSearchOptions,
      } }>
      {children}
    </SessionContext.Provider>
  );
}
