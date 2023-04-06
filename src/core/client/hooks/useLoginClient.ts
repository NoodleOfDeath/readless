import React from 'react';

import { ClientError } from './types';
import { SessionContext } from '../contexts';

import {
  API,
  PartialGenerateOTPRequest,
  PartialLoginRequest,
  PartialRegistrationRequest,
  PartialUpdateCredentialRequest,
  PartialVerifyAliasRequest,
  PartialVerifyOTPRequest,
} from '~/api';

export function useLoginClient() {

  const { setUserData, withHeaders } = React.useContext(SessionContext);

  const logIn = React.useCallback(
    async (values: PartialLoginRequest) => {
      try {
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
      } catch (e) {
        return { data: undefined, error: new ClientError('UNKNOWN', e) };
      }
    },
    [setUserData, withHeaders]
  );

  const logOut = React.useCallback(async () => {
    console.log('jesus fucking christ');
    try {
      const response = await withHeaders(API.logout)({});
      const { error } = response;
      if (error) {
        return response;
      }
      return response;
    } catch (e) {
      return { data: undefined, error: new ClientError('UNKNOWN', e) };
    } finally {
      setUserData();
    }
  }, [setUserData, withHeaders]);

  const register = React.useCallback(
    async (values: PartialRegistrationRequest) => {
      try {
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
      } catch (e) {
        return { data: undefined, error: new ClientError('UNKNOWN', e) };
      }
    },
    [setUserData, withHeaders]
  );
  
  const requestPasswordReset = React.useCallback(async (values: PartialGenerateOTPRequest) => {
    try {
      return await withHeaders(API.generateOtp)(values);
    } catch (e) {
      console.error(e);
      return { data: undefined, error: new ClientError('UNKNOWN', e) };
    }
  }, [withHeaders]);

  const updateCredential = React.useCallback(async (values: PartialUpdateCredentialRequest) => {
    try {
      return await withHeaders(API.updateCredential)(values);
    } catch (e) {
      console.error(e);
      return { data: undefined, error: new ClientError('UNKNOWN', e) };
    }
  }, [withHeaders]);

  const verifyAlias = React.useCallback(async (values: PartialVerifyAliasRequest) => {
    try {
      return await withHeaders(API.verifyAlias)(values);
    } catch (e) {
      console.error(e);
      return { data: undefined, error: new ClientError('UNKNOWN', e) };
    }
  }, [withHeaders]);

  const verifyOtp = React.useCallback(async (values: PartialVerifyOTPRequest) => {
    try {
      const response = await withHeaders(API.verifyOtp)(values);
      const { data, error } = response;
      if (error) {
        return response;
      }
      if (data) {
        setUserData({
          isLoggedIn: false,
          ...data,
        }, { updateCookie: true });
      }
      return response;
    } catch (e) {
      console.error(e);
      return { data: undefined, error: new ClientError('UNKNOWN', e) };
    }
  }, [setUserData, withHeaders]);
  
  return {
    logIn,
    logOut,
    register,
    requestPasswordReset,
    updateCredential,
    verifyAlias,
    verifyOtp,
  };

}