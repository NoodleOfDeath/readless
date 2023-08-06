import React from 'react';

import { SessionContext } from '../contexts';

import { API } from '~/api';

export function useApiClient() {

  const { withHeaders } = React.useContext(SessionContext);
  
  const api = React.useMemo(() => {
    return Object.fromEntries(Object.entries(API)
      .filter(([, f]) => f instanceof Function)
      .map(([k, f]) => [k, withHeaders(f)]));
  }, [withHeaders]);
  
  return { ...api };
  
}