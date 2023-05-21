import React from 'react';

import { ClientError } from './types';
import { Bookmark, SessionContext } from '../contexts';

import {
  API,
  InteractionType,
  PublicSummaryAttributes,
  TokenTypeName,
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
    matchType?: 'all' | 'any',
    interval?: string,
    locale?: string,
    page = 0,
    pageSize = 10
  ) => {
    try {
      return await withHeaders(API.getSummaries)({
        excludeIds, filter, ids, interval, locale, matchType, page, pageSize,
      });
    } catch (e) {
      return { data: undefined, error: new ClientError('UNKNOWN', e) };
    }
  }, [withHeaders]);

  const getSummary = React.useCallback(async (id: number, locale: string) => {
    try {
      const { data, error } = await getSummaries(undefined, [id], false, undefined, undefined, locale, 0, 1);
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
  
  const getTopicGroups = React.useCallback(async () => {
    try {
      return await withHeaders(API.getTopicGroups)();
    } catch (e) {
      return { data: undefined, error: new ClientError('UNKNOWN', e) };
    }
  }, [withHeaders]);
  
  const getTopics = React.useCallback(async (
    type?: TokenTypeName,
    interval?: string,
    min?: number,
    page = 0,
    pageSize = 10,
    order?: string[]
  ) => {
    try {
      return await withHeaders(API.getTopics)({
        interval, min, order, page, pageSize, type,
      });
    } catch (e) {
      return { data: undefined, error: new ClientError('UNKNOWN', e) };
    }
  }, [withHeaders]);
  
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
    if (alternateAction) {
      // pass
      try {
        await alternateAction();
      } catch (e) {
        console.error(e);
      }
    }
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
    } 
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
    return await interactWithSummary(summary, interaction, content, payload);
  }, [interactWithSummary, setPreference]);

  return {
    getSummaries,
    getSummary,
    getTopicGroups,
    getTopics,
    handleInteraction,
    interactWithSummary,
  };

}