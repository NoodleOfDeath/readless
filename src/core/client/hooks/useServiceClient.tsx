import React from 'react';

import { ClientError } from './types';
import { SessionContext } from '../contexts';

import { API, PublicSummaryAttributes } from '~/api';

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

  const localizeSummary = React.useCallback(async (summary: PublicSummaryAttributes, locale: string) => {
    try {
      const response = await withHeaders(API.localize)({
        locale, resourceId: summary.id, resourceType: 'summary', 
      });
      return response;
    } catch (e) {
      return { data: undefined, error: new ClientError('UNKNOWN', e) };
    }
  });

  return { 
    getServices, 
    getSystemMessages,
    localizeSummary,
  };

};
