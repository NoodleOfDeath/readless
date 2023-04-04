import React from 'react';

import { UserData, UserDataProps } from './UserData';
import {
  clearCookie,
  getCookie,
  setCookie,
} from './cookies';
import {
  DEFAULT_SESSION_CONTEXT,
  FunctionWithRequestParams,
  Preferences,
  SessionSetOptions,
} from './types';

import { LoginResponse } from '~/api';

type Props = React.PropsWithChildren;

export const COOKIES = {
  preferences: 'preferences',
  userData: 'userData',
};

export const SessionContext = React.createContext(DEFAULT_SESSION_CONTEXT);

export function SessionContextProvider({ children }: Props) {

  const [preferences, setPreferences] = React.useState<Preferences>({});
  const [userDataRaw, setUserDataRaw] = React.useState<UserDataProps>();

  const userData = React.useMemo(() => userDataRaw ? new UserData(userDataRaw) : undefined, [userDataRaw]);

  const setUserData = 
  (state?: UserDataProps | ((prev?: UserDataProps) => UserDataProps | undefined), options?: SessionSetOptions) => {
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
  
  const addUserToken = (token: LoginResponse['token']) => {
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
  const setPreference = <Key extends keyof Preferences>(key: Key) =>
    (value?: Preferences[Key] | ((prev: Preferences[Key]) => Preferences[Key])) => {
      setPreferences((prev) => {
        const newPrefs = { ...prev };
        if (!value) {
          delete newPrefs[key];
        } else {
          newPrefs[key] =
            value instanceof Function ? value(prev[key]) : value;
        }
        setCookie(COOKIES.preferences, JSON.stringify(newPrefs));
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
        setPreference,
        setUserData,
        userData,
        withHeaders,
      } }>
      {children}
    </SessionContext.Provider>
  );
}
