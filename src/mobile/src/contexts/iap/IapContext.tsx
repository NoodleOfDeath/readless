import React from 'react';
import { EmitterSubscription, Platform } from 'react-native';

import {
  ProductCommon,
  endConnection,
  finishTransaction,
  flushFailedPurchasesCachedAsPendingAndroid,
  getSubscriptions,
  initConnection,
  purchaseErrorListener,
  purchaseUpdatedListener,
  requestSubscription,
} from 'react-native-iap';

const SKUS = Platform.select({
  android: { skus: [] },
  ios: { skus: ['ai.readless.ReadLess.premium.t1'] },
});

export const IapContext = React.createContext({
  products: [],
  subscribe: () => Promise<void>,
});

export function IapContextProvider({ children }: React.PropsWithChildren) {
  
  const [products, setProducts] = React.useState<ProductCommon[]>([]);
  
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

  React.useEffect(() => {
    let purchaseUpdateSubscription: EmitterSubscription;
    let purchaseErrorSubscription: EmitterSubscription;
    initConnection()
      .then(async () => {
        const products = await getSubscriptions(SKUS);
        setProducts(products);
        if (Platform.OS === 'android') {
          flushFailedPurchasesCachedAsPendingAndroid()
            .catch(() => {
              // exception can happen here if:
              // - there are pending purchases that are still pending (we can't consume a pending purchase)
              // in any case, you might not want to do anything special with the error
            });
        }
      })
      .then(() => {
        purchaseUpdateSubscription = purchaseUpdatedListener(
          async (purchase) => {
            console.log('purchaseUpdatedListener', purchase);
            const receipt = purchase.transactionReceipt;
            if (receipt) {
              await finishTransaction({ isConsumable: false, purchase });
            }
          }
        );
        purchaseErrorSubscription = purchaseErrorListener(
          (error) => {
            console.warn('purchaseErrorListener', error);
          }
        );
      })
      .catch((error) => {
        console.warn(error);
      });
    return () => {
      purchaseUpdateSubscription?.remove();
      purchaseErrorSubscription?.remove();
      endConnection();
    };
  }, []);
  
  return (
    <IapContext.Provider value={ {
      products,
      subscribe,
    } }>
      {children}
    </IapContext.Provider>
  );
  
}