import React from 'react';

import { ClientError } from './types';
import { SessionContext } from '../contexts';

import { API } from '~/api';

export function useStatusClient() {

  const { withHeaders } = React.useContext(SessionContext);
  
  const getStatus = React.useCallback(async (name: string) => {
    try {
      return await withHeaders(API.getStatus)(name);
    } catch (e) {
      return { data: undefined, error: new ClientError('UNKNOWN', e) };
    }
  }, [withHeaders]);

  const getStatuses = React.useCallback(async () => {
    try {
      return await withHeaders(API.getStatuses)();
    } catch (e) {
      return { data: undefined, error: new ClientError('UNKNOWN', e) };
    }
  }, [withHeaders]);

  return {
    getStatus,
    getStatuses,
  };

}