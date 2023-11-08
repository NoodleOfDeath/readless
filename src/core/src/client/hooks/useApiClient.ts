import React from 'react';

import { StorageContext } from '../contexts';

import { API, RequestParams } from '~/api';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Methods = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [k in keyof typeof API]: typeof API[k] extends (...args: [...Parameters<typeof API[k]>, RequestParams | undefined]) => infer R ? 
  (...args: Parameters<typeof API[k]>) => R : never;
};

export function useApiClient() {

  const { withHeaders } = React.useContext(StorageContext);
  
  const api = React.useMemo(() => {
    return Object.fromEntries(Object.entries(API)
      .filter(([, f]) => f instanceof Function)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map(([k, f]) => [k, withHeaders(f as (...args: [...Parameters<typeof f>, RequestParams | undefined]) => ReturnType<typeof f>)])) as unknown as Methods;
  }, [withHeaders]);

  const getSummary = React.useCallback(async (id: number) => {
    return api.getSummaries({ ids: [id] });
  }, [api]);

  return {
    ...api,
    getSummary,
  };
  
}