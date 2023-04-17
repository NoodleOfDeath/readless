import React from 'react';

import { UserData, UserDataProps } from './UserData';
import {
  DEFAULT_PREFERENCES,
  DEFAULT_SESSION_CONTEXT,
  FunctionWithRequestParams,
  Preferences,
  SessionSetOptions,
} from './types';

import { JwtTokenResponse } from '~/api';
import {
  clearCookie,
  getCookie,
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
    getCookie(COOKIES.preferences)
      .then((cookie) => { 
        setPreferences({ ...DEFAULT_PREFERENCES, ...JSON.parse(cookie ?? '{}') });
        setReadyFlags((prev) => ({ ...prev, preferences: true }));
      })
      .catch((e) => {
        console.error(e);
        setPreferences({});
      });
  }, []);

  React.useEffect(() => {
    getCookie(COOKIES.userData)
      .then((cookie) => { 
        setUserData(JSON.parse(cookie ?? '{}'));
        setReadyFlags((prev) => ({ ...prev, userData: true }));
      })
      .catch((e) => {
        console.error(e);
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
