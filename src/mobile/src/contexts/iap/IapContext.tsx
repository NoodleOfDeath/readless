import React from 'react';
import { EmitterSubscription, Platform } from 'react-native';

import {
  Purchase,
  Subscription,
  endConnection,
  finishTransaction,
  flushFailedPurchasesCachedAsPendingAndroid,
  getSubscriptions,
  initConnection,
  purchaseErrorListener,
  purchaseUpdatedListener,
  requestSubscription,
} from 'react-native-iap';

import { DEFAULT_IAP_CONTEXT } from './types';
 
import { PublicIapVoucherAttributes } from '~/api';
import { useIapClient } from '~/core';

const SKUS = Platform.select({
  android: { skus: [] },
  ios: {
    skus: [
      'ai.readless.ReadLess.premium.t1',
      'ai.readless.ReadLess.premium.iamrich',
    ], 
  },
}) as { skus: string[] };

export const IapContext = React.createContext(DEFAULT_IAP_CONTEXT);

export function IapContextProvider({ children }: React.PropsWithChildren) {
  
  const { processPurchase } = useIapClient();

  const [subscriptions, setSubscriptions] = React.useState<Subscription[]>([]);
  const [activeSubscription, setActiveSubscription] = React.useState<Purchase>();
  const [purchasePending, setPurchasePending] = React.useState(false);
  
  const subscribe = React.useCallback(async (sku: string, offerToken = '') => {
    try {
      setPurchasePending(true);
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
        setSubscriptions(products);
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
            try {
              const receipt = purchase.transactionReceipt;
              let voucher: PublicIapVoucherAttributes | undefined;
              if (Platform.OS === 'ios') {
                const { data, error } = await processPurchase({ platform: 'apple', receipt });
                if (error) {
                  console.error(error);
                }
                voucher = data;
              } else if (Platform.OS === 'android' && purchase.purchaseStateAndroid === 1 && purchase.purchaseToken) {
                const { data, error } = await processPurchase({
                  platform: 'google', receipt: {
                    packageName: 'ai.readless.ReadLess',
                    productId: purchase.productId,
                    purchaseToken: purchase.purchaseToken,
                    subscription: true,
                  }, 
                });
                if (error) {
                  console.error(error);
                }
                voucher = data;
              }
              if (receipt && voucher) {
                setActiveSubscription(purchase);
                await finishTransaction({ isConsumable: false, purchase });
              }
            } catch (err) {
              console.error(err);
            } finally {
              setPurchasePending(false);
            }
          }
        );
        purchaseErrorSubscription = purchaseErrorListener(
          (error) => {
            console.warn('purchaseErrorListener', error);
            setPurchasePending(false);
          }
        );
      })
      .catch((error) => {
        console.warn(error);
      })
      .finally(() => {
        setPurchasePending(false);
      });
    return () => {
      purchaseUpdateSubscription?.remove();
      purchaseErrorSubscription?.remove();
      endConnection();
    };
  }, [processPurchase]);
  
  return (
    <IapContext.Provider value={ {
      activeSubscription,
      purchasePending,
      subscribe,
      subscriptions,
    } }>
      {children}
    </IapContext.Provider>
  );
  
}