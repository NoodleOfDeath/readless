import React from 'react';

import { ClientError } from './types';
import { Bookmark, SessionContext } from '../contexts';

import {
  API,
  InteractionType,
  PublicSummaryAttributes,
} from '~/api';
import { getUserAgent } from '~/utils';

export function useSummaryClient() {

  const {
    setPreference, userData, withHeaders,
  } = React.useContext(SessionContext);
  
  const getSummaries = React.useCallback(async (
    filter?: string,
    ids?: number[],
    excludeIds?: boolean,
    matchType: 'all' | 'any' = 'all',
    page = 0,
    pageSize = 10,
    order?: string[]
  ) => {
    try {
      return await withHeaders(API.getSummaries)({
        excludeIds, filter, ids, match: matchType, order, page, pageSize,
      });
    } catch (e) {
      return { data: undefined, error: new ClientError('UNKNOWN', e) };
    }
  }, [withHeaders]);

  const getSummary = React.useCallback(async (id: number) => {
    try {
      const { data, error } = await getSummaries(undefined, [id], false, 'all', 0, 1);
      if (error) {
        return { data: undefined, error };
      }
      if (data) {
        return { data: data.rows[0], error: undefined };
      }
      return { data: undefined, error: new ClientError('NOT_FOUND') };
    } catch (e) {
      return { data: undefined, error: new ClientError('UNKNOWN', e) };
    }
  }, [getSummaries]);
  
  const interactWithSummary = React.useCallback(
    async (summary: PublicSummaryAttributes, type: InteractionType, content?: string, metadata?: Record<string, unknown>) => {
      try {
        return await withHeaders(API.interactWithSummary)(summary.id, type, {
          content, metadata, userId: userData?.userId,
        });
      } catch (e) {
        return { data: undefined, error: new ClientError('UNKNOWN', e) };
      }
    },
    [userData, withHeaders] 
  );

  const handleInteraction = React.useCallback(async (
    summary: PublicSummaryAttributes, 
    interaction: InteractionType, 
    content?: string, 
    metadata?: Record<string, unknown>,
    alternateAction?: (() => Promise<void>) | (() => void)
  ) => {
    const payload: Record<string, unknown> = { 
      ...metadata, 
      content,
      userAgent: getUserAgent(),
    };
    if (interaction === InteractionType.Bookmark) {
      setPreference('bookmarkedSummaries', (prev) => {
        const bookmarks = { ...prev };
        payload.value = String(!bookmarks[summary.id]);
        if (bookmarks[summary.id]) {
          delete bookmarks[summary.id];
        } else {
          bookmarks[summary.id] = new Bookmark(summary);
        }
        return (prev = bookmarks);
      });
    } else
    if (interaction === InteractionType.Read && /original source/i.test(content ?? '')) {
      setPreference('readSources', (prev) => {
        const bookmarks = { ...prev };
        bookmarks[summary.id] = new Bookmark(true);
        return (prev = bookmarks);
      });
    }
    setPreference('summaryHistory', (prev) => ({
      ...prev,
      [summary.id]: new Bookmark(interaction),
    }));
    if (alternateAction) {
      // pass
      try {
        await alternateAction();
      } catch (e) {
        console.error(e);
      }
    }
    return await interactWithSummary(summary, interaction, content, payload);
  }, [interactWithSummary, setPreference]);

  return {
    getSummaries,
    getSummary,
    handleInteraction,
    interactWithSummary,
  };

}