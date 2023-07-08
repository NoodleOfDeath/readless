import React from 'react';

import { SessionContext } from '../contexts';

import { API, PublicSummaryAttributesConservative } from '~/api';

export const useServiceClient = () => {

  const { withHeaders } = React.useContext(SessionContext);

  const getServices = React.useCallback(async () => {
    return await withHeaders(API.getServices)();
  }, [withHeaders]);

  const getSystemMessages = React.useCallback(async () => {
    await withHeaders(API.getSystemMessages)();
  }, [withHeaders]);

  const localizeSummary = React.useCallback(async (summary: PublicSummaryAttributesConservative, locale: string) => {
    return await withHeaders(API.localize)({
      locale, resourceId: summary.id, resourceType: 'summary', 
    });
  }, [withHeaders]);

  return { 
    getServices, 
    getSystemMessages,
    localizeSummary,
  };

};
