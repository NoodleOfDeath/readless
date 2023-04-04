import React from 'react';

import { ClientError } from './types';
import { SessionContext } from '../contexts';

import {
  API,
  InteractionType,
  SummaryResponse,
} from '~/api';

export function useSummaryClient() {

  const { userData, withHeaders } = React.useContext(SessionContext);
  
  const getSummaries = React.useCallback(async ({
    filter = '',
    page = 0,
    pageSize = 10,
  }) => {
    try {
      return await withHeaders(API.getSummaries)({
        filter, page, pageSize, 
      });
    } catch (e) {
      return { data: undefined, error: new ClientError('UNKNOWN', e) };
    }
  }, [withHeaders]);

  const recordSummaryView = React.useCallback(async (summary: SummaryResponse, content?: string, metadata?: Record<string, unknown>) => {
    try {
      return await withHeaders(API.recordSummaryView)(summary.id, { content, metadata });
    } catch (e) {
      return { data: undefined, error: new ClientError('UNKNOWN', e) };
    }
  }, [withHeaders]);
  
  const interactWithSummary = React.useCallback(
    async (summary: SummaryResponse, type: InteractionType, content?: string, metadata?: Record<string, unknown>) => {
      if (!userData || !userData.isLoggedIn) {
        return { error: new ClientError('NOT_LOGGED_IN') };
      }
      try {
        return await withHeaders(API.interactWithSummary)(summary.id, type, {
          content, metadata, userId: userData.userId,
        });
      } catch (e) {
        return { data: undefined, error: new ClientError('UNKNOWN', e) };
      }
    },
    [userData, withHeaders]
  );

  return {
    getSummaries,
    interactWithSummary,
    recordSummaryView,
  };

}