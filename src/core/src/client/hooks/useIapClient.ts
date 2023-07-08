import React from 'react';

import { SessionContext } from '../contexts';

import { API } from '~/api';

export const useIapClient = () => {

  const { withHeaders } = React.useContext(SessionContext);

  const processPurchase = React.useCallback(async (args: Parameters<typeof API.processPurchase>[0]) => {
    return await withHeaders(API.processPurchase)(args);
  }, [withHeaders]);

  return { processPurchase };

};
