import React from 'react';

import { ClientError } from './types';
import { SessionContext } from '../contexts';

import { API, MetricCreationAttributes } from '~/api';

export function useMetricClient() {

  const { withHeaders } = React.useContext(SessionContext);

  const recordMetric = React.useCallback(
    async (values: MetricCreationAttributes) => {
      try {
        return await withHeaders(API.recordMetric)(values);
      } catch (e) {
        return { data: undefined, error: new ClientError('UNKNOWN', e) };
      }
    },
    [withHeaders]
  );
  
  return { recordMetric };

}