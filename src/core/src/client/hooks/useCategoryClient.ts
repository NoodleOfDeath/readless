import React from 'react';

import { SessionContext } from '../contexts';

import { API } from '~/api';

export function useCategoryClient() {

  const { withHeaders } = React.useContext(SessionContext);

  const getCategories = React.useCallback(async (args: Parameters<typeof API.getCategories>[0]) => {
    return await withHeaders(API.getCategories)(args);
  }, [withHeaders]);

  const getPublishers = React.useCallback(async (args: Parameters<typeof API.getPublishers>[0]) => {
    return await withHeaders(API.getPublishers)(args);
  }, [withHeaders]);

  return { getCategories, getPublishers };
}