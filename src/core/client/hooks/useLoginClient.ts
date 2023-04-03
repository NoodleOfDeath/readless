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
    async (values: PartialLoginRequest) => {
      const response = await withHeaders(API.login)(values);
      const { data, error } = response;
      if (error) {
        return response;
      }
      setUserData({
        isLoggedIn: true,
        ...data,
      }, { updateCookie: true });
      return response;
    },
    [setUserData, withHeaders]
  );

  const handleSignUp = React.useCallback(
    async (values: PartialRegistrationRequest) => {
      const response = await withHeaders(API.register)(values);
      const { data, error } = response;
      if (error) {
        return response;
      }
      setUserData({
        isLoggedIn: true,
        ...data,
      }, { updateCookie: true });
      return response;
    },
    [setUserData, withHeaders]
  );
  
  return {
    handleLogIn,
    handleSignUp,
  };

}