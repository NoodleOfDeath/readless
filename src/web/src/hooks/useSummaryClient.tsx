import React from 'react';

import API, {
  InteractionResponse,
  InteractionType,
  SummaryResponse,
} from '@/api';
import { SessionContext } from '@/contexts';

export function useSummaryClient() {

  const {
    setShowLoginDialog, userData, withHeaders, 
  } = React.useContext(SessionContext);

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
        setShowLoginDialog(true, () => interactWithSummary(summary, type, content, metadata, callback, onFailure));
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
    [setShowLoginDialog, userData?.isLoggedIn, userData?.userId, withHeaders]
  );

  return {
    interactWithSummary,
    recordSummaryView,
  };

}