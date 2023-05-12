import React from 'react';

import { UserData, UserDataProps } from './UserData';
import {
  Bookmark,
  DEFAULT_PREFERENCES,
  DEFAULT_SESSION_CONTEXT,
  FunctionWithRequestParams,
  OVERRIDDEN_INITIAL_PREFERENCES,
  Preferences,
  SessionSetOptions,
} from './types';

import {
  JwtTokenResponse,
  PublicCategoryAttributes,
  PublicOutletAttributes,
} from '~/api';
import {
  clearCookie,
  getCookie,
  getUserAgent,
  setCookie,
} from '~/utils';

type Props = React.PropsWithChildren;

export const COOKIES = {
  preferences: 'preferences',
  userData: 'userData',
};

export const SessionContext = React.createContext(DEFAULT_SESSION_CONTEXT);

export function SessionContextProvider({ children }: Props) {
  
  const [readyFlags, setReadyFlags] = React.useState({
    preferences: false,
    userData: false,
  });
  const ready = React.useMemo(() => Object.values(readyFlags).every((flag) => flag), [readyFlags]);

  const [preferences, setPreferences] = React.useState<Preferences>({});
  const [userDataRaw, setUserDataRaw] = React.useState<UserDataProps>();
  
  const userData = React.useMemo(() => userDataRaw ? new UserData(userDataRaw) : undefined, [userDataRaw]);

  const setUserData = 
  (state?: UserDataProps | ((prev?: UserDataProps) => UserDataProps | undefined), options?: SessionSetOptions) => {
    if (!state) {
      setUserDataRaw(undefined);
      clearCookie(COOKIES.userData)
        .catch(console.error);
      return;
    }
    setUserDataRaw((prev) => {
      const newData = state instanceof Function ? state(prev) : new UserData(state);
      if (!newData) {
        clearCookie(COOKIES.userData)
          .catch(console.error);
        return (prev = undefined);
      }
      if (options?.updateCookie) {
        setCookie(COOKIES.userData, JSON.stringify(newData))
          .catch(console.error);
      }
      return (prev = newData);
    });
  };
  
  const addUserToken = (token: JwtTokenResponse) => {
    setUserData((prev) => {
      if (!prev) {
        return;
      }
      const newState = new UserData(prev);
      newState.addToken(token);
      return (prev = newState);
    });
  };

  // Convenience function to set a preference
  const setPreference = <Key extends keyof Preferences>(key: Key, value?: Preferences[Key] | ((prev: Preferences[Key]) => Preferences[Key])) => {
    setPreferences((prev) => {
      const newPrefs = { ...prev };
      if (!value) {
        delete newPrefs[key];
      } else {
        newPrefs[key] =
            value instanceof Function ? value(prev[key]) : value;
      }
      setCookie(COOKIES.preferences, JSON.stringify(newPrefs))
        .catch(console.error);
      return (prev = newPrefs);
    });
  };

  const followOutlet = (outlet: PublicOutletAttributes) => {
    setPreference('bookmarkedOutlets', (prev) => {
      const state = { ...prev };
      if (state[outlet.name]) {
        delete state[outlet.name];
      } else {
        state[outlet.name] = new Bookmark(outlet);
      }
      return (prev = state);
    });
  };

  const followCategory = (category: PublicCategoryAttributes) => {
    setPreference('bookmarkedCategories', (prev) => {
      const state = { ...prev };
      if (state[category.name]) {
        delete state[category.name];
      } else {
        state[category.name] = new Bookmark(category);
      }
      return (prev = state);
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const withHeaders = React.useCallback(<T extends any[], R>(fn: FunctionWithRequestParams<T, R>): ((...args: T) => R) => {
    const headers: HeadersInit = { 'X-App-Version': getUserAgent().currentVersion };
    if (userData?.tokenString) {
      headers.Authorization = `Bearer ${userData.tokenString}`;
    }
    return (...args: T) => {
      return fn(...args, { headers });
    };
  }, [userData?.tokenString]);

  // Load preferences on mount
  React.useEffect(() => {
    getCookie(COOKIES.preferences)
      .then((cookie) => { 
        setPreferences({
          ...DEFAULT_PREFERENCES, ...JSON.parse(cookie ?? '{}'), ...OVERRIDDEN_INITIAL_PREFERENCES,
        });
      })
      .catch((e) => {
        console.error(e);
        setPreferences({});
      })
      .finally(() => {
        setReadyFlags((prev) => ({ ...prev, preferences: true }));
      });
  }, []);

  // Load user data on mount
  React.useEffect(() => {
    getCookie(COOKIES.userData)
      .then((cookie) => { 
        setUserData(JSON.parse(cookie ?? '{}'));
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        setReadyFlags((prev) => ({ ...prev, userData: true }));
      });
  }, []);

  React.useEffect(() => {
    if (userData?.expired === true) {
      setUserData();
    }
  }, [userData?.expired]);
  
  return (
    <SessionContext.Provider
      value={ {
        addUserToken,
        followCategory,
        followOutlet,
        preferences,
        ready,
        setPreference,
        setUserData,
        userData,
        withHeaders,
      } }>
      {children}
    </SessionContext.Provider>
  );
}
