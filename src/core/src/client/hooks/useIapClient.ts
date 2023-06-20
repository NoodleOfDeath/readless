import React from 'react';

import { ClientError } from './types';
import { SessionContext } from '../contexts';

import { API, PurchaseRequest } from '~/api';

export const useIapClient = () => {

  const { withHeaders } = React.useContext(SessionContext);

  const processPurchase = React.useCallback(async (purchase: PurchaseRequest) => {
    try {
      const response = await withHeaders(API.processPurchase)(purchase);
      return response;
    } catch (e) {
      return { data: undefined, error: new ClientError('UNKNOWN', e) };
    }
  }, [withHeaders]);

  return { processPurchase };

};
