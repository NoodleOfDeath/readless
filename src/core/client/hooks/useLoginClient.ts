import React from 'react';

import {
  API,
  PartialLoginRequest,
  PartialRegistrationRequest,
} from '~/api';
import { SessionContext } from '~/contexts';

export function useLoginClient() {

  const { setUserData, withHeaders } = React.useContext(SessionContext);

  const handleLogIn = React.useCallback(
    async (values: PartialLoginRequest, onSuccess?: () => void, onFailure?: (error: Error) => void) => {
      try {
        const { data, error } = await withHeaders(API.login)(values);
        if (error) {
          onFailure?.(error);
          return;
        }
        setUserData({
          isLoggedIn: true,
          ...data,
        }, { updateCookie: true });
        onSuccess?.();
      } catch (e) {
        console.error(e);
      }
    },
    [setUserData, withHeaders]
  );

  const handleSignUp = React.useCallback(
    async (values: PartialRegistrationRequest, onSuccess?: () => void, onFailure?: (error: Error) => void) => {
      try {
        const { data, error } = await withHeaders(API.register)(values);
        if (error) {
          onFailure?.(error);
          return;
        }
        setUserData({
          isLoggedIn: true,
          ...data,
        }, { updateCookie: true });
        onSuccess?.();
      } catch (e) {
        console.error(e);
      }
    },
    [setUserData, withHeaders]
  );
  
  return {
    handleLogIn,
    handleSignUp,
  };

}