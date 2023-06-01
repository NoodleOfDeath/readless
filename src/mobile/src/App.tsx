import React from 'react';
import { EmitterSubscription, Platform } from 'react-native';

import {
  endConnection,
  finishTransaction,
  flushFailedPurchasesCachedAsPendingAndroid,
  initConnection,
  purchaseErrorListener,
  purchaseUpdatedListener,
} from 'react-native-iap';

import NavigationController from '~/NavigationController';
import {
  DialogContextProvider,
  MediaContextProvider,
  SessionContextProvider,
} from '~/contexts';

export default function App() {

  React.useEffect(() => {
    let purchaseUpdateSubscription: EmitterSubscription;
    let purchaseErrorSubscription: EmitterSubscription;
    initConnection()
      .then(() => {
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
    <SessionContextProvider>
      <DialogContextProvider>
        <MediaContextProvider>
          <NavigationController />
        </MediaContextProvider>
      </DialogContextProvider>
    </SessionContextProvider>
  );
}
