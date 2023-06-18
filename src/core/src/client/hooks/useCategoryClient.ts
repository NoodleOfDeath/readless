import React from 'react';

import { ClientError } from './types';
import { SessionContext } from '../contexts';

import {
  API,
  BulkResponsePublicCategoryAttributes,
  BulkResponsePublicOutletAttributes,
} from '~/api';

export function useCategoryClient() {

  const { withHeaders } = React.useContext(SessionContext);

  const getCategories = React.useCallback(async (filter?: string) => {
    let data: BulkResponsePublicCategoryAttributes;
    let error: ClientError;
    try {
      const response = await withHeaders(API.getCategories)({ filter });
      if (response.error) {
        throw response.error;
      }
      data = response.data;
    } catch (e) {
      error = new ClientError('UNKNOWN', e);
    }
    return { data, error };
  }, [withHeaders]);

  const getOutlets = React.useCallback(async (filter?: string) => {
    let data: BulkResponsePublicOutletAttributes;
    let error: ClientError;
    try {
      const response = await withHeaders(API.getOutlets)({ filter });
      if (response.error) {
        throw response.error;
      }
      data = response.data;
    } catch (e) {
      error = new ClientError('UNKNOWN', e);
    }
    return { data, error };
  }, [withHeaders]);

  return { getCategories, getOutlets };
}