import { API } from '~/api';

// eslint-disable-next-line @typescript-eslint/ban-types
export type NotificationContextType = {
  registerRemoteNotifications: () => Promise<void>;
  unsubscribe: typeof API.unsubscribe;
};

export const DEFAULT_NOTIFICATION_CONTEXT: NotificationContextType = {
  registerRemoteNotifications: () => Promise.resolve(),
  unsubscribe: API.unsubscribe,
};