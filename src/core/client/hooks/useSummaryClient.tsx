import React from 'react';

import {
  API,
  InteractionResponse,
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

  const recordSummaryView = React.useCallback(async (summary: SummaryResponse, content?: string, metadata?: Record<string, unknown>, callback?: (interactions: InteractionResponse) => void, onFailure?: (error?: Error) => void) => {
    const { data, error } = await withHeaders(API.recordSummaryView)(summary.id, { content, metadata });
    if (error) {
      console.error(error);
      onFailure?.(error);
      return;
    }
    if (data) {
      callback?.(data);
    }
  }, [withHeaders]);
  
  const interactWithSummary = React.useCallback(
    async (summary: SummaryResponse, type: InteractionType, content?: string, metadata?: Record<string, unknown>, callback?: (interactions: InteractionResponse) => void, onFailure?: (error?: Error) => void) => {
      if (!userData?.isLoggedIn) {
        onFailure?.(new Error('User is not logged in'));
        return;
      }
      try {
        const { data, error } = await withHeaders(API.interactWithSummary)(summary.id, type, {
          content, metadata, userId: userData.userId,
        });
        if (error) {
          console.error(error);
          onFailure?.(error);
          return;
        }
        if (data) {
          callback?.(data);
        }
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