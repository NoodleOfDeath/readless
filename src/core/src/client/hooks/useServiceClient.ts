import React from 'react';

import { SessionContext } from '../contexts';

import { 
  API, 
  PublicSummaryGroup,
  RecapAttributes,
} from '~/api';

export const useServiceClient = () => {

  const { withHeaders } = React.useContext(SessionContext);

  const getServices = React.useCallback(async () => {
    return await withHeaders(API.getServices)();
  }, [withHeaders]);

  const getSystemMessages = React.useCallback(async () => {
    await withHeaders(API.getSystemMessages)();
  }, [withHeaders]);

  const localizeSummary = React.useCallback(async (summary: PublicSummaryGroup, locale: string) => {
    return await withHeaders(API.localize)({
      locale, resourceId: summary.id, resourceType: 'summary', 
    });
  }, [withHeaders]);
  
  const localizeRecap = React.useCallback(async (recap: RecapAttributes, locale: string) => {
    return await withHeaders(API.localize)({
      locale, resourceId: recap, resourceType: 'recap', 
    });
  }, [withHeaders]);

  return { 
    getServices, 
    getSystemMessages,
    localizeRecap,
    localizeSummary,
  };

};
