import { Purchase, Subscription } from 'react-native-iap';

export type IapContextType = {
  activeSubscription?: Purchase;
  purchasePending?: boolean;
  setPurchasePending?: boolean;
  subscriptions: Subscription[];
  subscribe: (sku: string, offerToken?: string) => Promise<void>;
};

export const DEFAULT_IAP_CONTEXT: IapContextType = {
  subscribe: () => Promise.resolve(),
  subscriptions: [],
};