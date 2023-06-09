import React from 'react';

import { ClientError } from './types';
import { SessionContext } from '../contexts';

import { API } from '~/api';

export function useCategoryClient() {

  const { withHeaders } = React.useContext(SessionContext);

  const getCategories = React.useCallback(async (filter?: string) => {
    try {
      return await withHeaders(API.getCategories)({ filter });
    } catch (e) {
      return { data: undefined, error: new ClientError('UNKNOWN', e) };
    }
  }, [withHeaders]);

  const getOutlets = React.useCallback(async (filter?: string) => {
    try {
      return await withHeaders(API.getOutlets)({ filter });
    } catch (e) {
      return { data: undefined, error: new ClientError('UNKNOWN', e) };
    }
  }, [withHeaders]);

  return { getCategories, getOutlets };
}