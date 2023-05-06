import React from 'react';

import { ClientError } from './types';
import { SessionContext } from '../contexts';

import { API } from '~/api';

export const useServiceClient = () => {

  const { withHeaders } = React.useContext(SessionContext);

  const getServices = React.useCallback(async () => {
    try {
      const response = await withHeaders(API.getServices)();
      return response;
    } catch (e) {
      return { data: undefined, error: new ClientError('UNKNOWN', e) };
    }
  }, [withHeaders]);

  const getSystemMessages = React.useCallback(async () => {
    try {
      const response = await withHeaders(API.getSystemMessages)();
      return response;
    } catch (e) {
      return { data: undefined, error: new ClientError('UNKNOWN', e) };
    }
  }, [withHeaders]);

  return { 
    getServices, 
    getSystemMessages,
  };

};
