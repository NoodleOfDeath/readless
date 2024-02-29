import { API } from '~/api';

export type LocalNotificationOptions = {
  delay?: string;
  frequency?: string;
  count?: number;
};

// eslint-disable-next-line @typescript-eslint/ban-types
export type NotificationContextType = {
  isRegisteredForRemoteNotifications: (redirectOnFail?: boolean) => Promise<boolean>;
  registerRemoteNotifications: (redirectOnFail?: boolean) => void;
  subscribe: (data: Omit<Parameters<typeof API.subscribe>[0], 'channel' | 'uuid'>) => ReturnType<typeof API.subscribe>,
  syncWithServer: () => Promise<void>;
  unsubscribe: typeof API.unsubscribe;
};

export const DEFAULT_NOTIFICATION_CONTEXT: NotificationContextType = {
  isRegisteredForRemoteNotifications: () => Promise.resolve(false),
  registerRemoteNotifications: () => Promise.resolve(),
  subscribe: () => Promise.resolve(null) as unknown as ReturnType<typeof API.subscribe>,
  syncWithServer: () => Promise.resolve(),
  unsubscribe: API.unsubscribe,
};