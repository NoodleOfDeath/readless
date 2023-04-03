import React from 'react';

import {
  API,
  InteractionType,
  SummaryResponse,
} from '~/api';
import { SessionContext } from '~/contexts';

export function useSummaryClient() {

  const { userData, withHeaders } = React.useContext(SessionContext);
  
  const getSummaries = React.useCallback(async ({
    filter = '',
    page = 0,
    pageSize = 10,
  }) => {
    return await withHeaders(API.getSummaries)({
      filter, page, pageSize, 
    });
  }, [withHeaders]);

  const recordSummaryView = React.useCallback(async (summary: SummaryResponse, content?: string, metadata?: Record<string, unknown>) => {
    const { data, error } = await withHeaders(API.recordSummaryView)(summary.id, { content, metadata });
    if (error) {
      return { error };
    }
    if (data) {
      return { data };
    }
  }, [withHeaders]);
  
  const interactWithSummary = React.useCallback(
    async (summary: SummaryResponse, type: InteractionType, content?: string, metadata?: Record<string, unknown>) => {
      if (!userData?.isLoggedIn) {
        return { error: new Error('Not Logged In') };
      }
      try {
        const { data, error } = await withHeaders(API.interactWithSummary)(summary.id, type, {
          content, metadata, userId: userData.userId,
        });
        if (error) {
          return { error };
        }
        return { data };
      } catch (e) {
        console.error(e);
      }
    },
    [userData?.isLoggedIn, userData?.userId, withHeaders]
  );

  return {
    getSummaries,
    interactWithSummary,
    recordSummaryView,
  };

}