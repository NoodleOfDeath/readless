import React from 'react';

import { requestSubscription } from 'react-native-iap';

export function useInAppPurchase() {

  const subscribe = React.useCallback(async (sku: string, offerToken = '') => {
    try {
      await requestSubscription(
        {
          sku,
          ...(offerToken ? { offerToken } : {}),
        }
      );
    } catch (err) {
      console.error(err);
    }
  }, []);

  return { subscribe };

}