import React from 'react';
import {
  Linking,
  PermissionsAndroid,
  Platform,
} from 'react-native';

import messaging from '@react-native-firebase/messaging';
import { Notifications } from 'react-native-notifications';
import { Provider } from 'react-native-paper';

import { DEFAULT_NOTIFICATION_CONTEXT } from './types';

import { SubscriptionChannel, SubscriptionEvent } from '~/api';
import { SessionContext } from '~/contexts';
import { useApiClient } from '~/hooks';
import { strings } from '~/locales';

export const NotificationContext = React.createContext(DEFAULT_NOTIFICATION_CONTEXT);

export function NotificationContextProvider({ children }: React.PropsWithChildren) {

  const { 
    getSubscriptionStatus,
    subscribe, 
    unsubscribe,
  } = useApiClient();

  const { 
    fcmToken, 
    enablePush,
    setPreference,
  } = React.useContext(SessionContext);

  const [redirect, setRedirect] = React.useState(false);
  
  const syncWithServer = React.useCallback(async () => {
    if (!fcmToken) {
      return;
    }
    try {
      const { data } = await getSubscriptionStatus({ 
        channel: Platform.select({ android: SubscriptionChannel.Fcm, ios: SubscriptionChannel.Apns }) as SubscriptionChannel, 
        uuid: fcmToken, 
      });
      if (!data) {
        return;
      }
      await setPreference('pushNotifications', (prev) => {
        const newState = { ...prev };
        for (const [event] of (Object.keys(newState) as SubscriptionEvent[]).entries()) {
          if (!(event in data)) {
            delete newState[event];
          }
        }
        for (const event of data) {
          newState[event.event] = {
            ...event,
            fireTime: event.fireTime ?? newState[event.event]?.fireTime,
          };
        }
        return (prev = newState);
      });
    } catch (e) {
      console.log(e);
    }
  }, [fcmToken, getSubscriptionStatus, setPreference]);

  const isRegisteredForRemoteNotifications = React.useCallback(async (redirectOnFail = false) => {
    const fail = () => {
      setPreference('pushNotificationsEnabled', false);
      setPreference('fcmToken', undefined);
      setPreference('pushNotifications', {});
      if (redirectOnFail) {
        Linking.openSettings();
      }
    };
    const enabled = 
      await Notifications.isRegisteredForRemoteNotifications() &&
      await messaging().hasPermission() &&
      Platform.select({
        android: (await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.POST_NOTIFICATIONS, {
          buttonPositive: 'OK',
          message: strings.settings_enablePushNotifications, 
          title: strings.settings_pushNotifications,
        })) === PermissionsAndroid.RESULTS.GRANTED, 
        ios: true, 
      });
    if (!enabled) {
      fail();
      return false;
    }
    const token = await messaging().getToken();
    if (!token) {
      fail();
      return false;
    }
    return true;
  }, [setPreference]);

  const registerRemoteNotifications = React.useCallback((redirectOnFail = false) => {
    try {
      setRedirect(redirectOnFail);
      Notifications.registerRemoteNotifications();
    } catch (error) {
      console.log(error);
    }
  }, []);

  React.useEffect(() => {

    const listeners = [
      Notifications.events().registerRemoteNotificationsRegistered(async () => {
        try {
          if (!await isRegisteredForRemoteNotifications(redirect)) {
            return;
          }
          await syncWithServer();
          const channel = Platform.select({ android: SubscriptionChannel.Fcm, ios: SubscriptionChannel.Apns });
          if (!channel) {
            return;
          }
          const newFcmToken = await messaging().getToken();
          setPreference('pushNotificationsEnabled', true);
          setPreference('fcmToken', newFcmToken);
          await subscribe({
            channel,
            event: SubscriptionEvent.Default,
            uuid: newFcmToken,
          });
        } catch (error) {
          console.error(error);
          return;
        }
      }),

      Notifications.events().registerRemoteNotificationsRegistrationFailed((event) => {
        console.log(event);
      }),

      Notifications.events().registerRemoteNotificationsRegistrationDenied(() => {
        console.log('User refused remote notifications');
      }),

      Notifications.events().registerNotificationReceivedForeground((notification, completion) => {
        console.log(`Notification received in foreground: ${notification.title} : ${notification.body}`);
        completion({
          alert: true, badge: true, sound: true, 
        });
      }),

      Notifications.events().registerNotificationOpened((notification, completion) => {
        console.log(`Notification opened: ${notification.payload}`);
        completion();
      }),
    ];
    
    messaging().onNotificationOpenedApp(remoteMessage => {
      console.log(
        'Notification caused app to open from background state:',
        remoteMessage.notification
      );
    });

    // Quiet and Background State -> Check whether an initial notification is available
    messaging()
      .getInitialNotification()
      .then(remoteMessage => {
        if (remoteMessage) {
          console.log(
            'Notification caused app to open from quit state:',
            remoteMessage.notification
          );
        }
      })
      .catch(error => console.log('failed', error));
  
    // Foreground State
    messaging().onMessage(async remoteMessage => {
      console.log('foreground', remoteMessage);
    });
    
    return () => {
      listeners.forEach(listener => listener.remove());
    };

  }, [isRegisteredForRemoteNotifications, redirect, setPreference, subscribe, syncWithServer]);

  return (
    <NotificationContext.Provider value={ { 
      isRegisteredForRemoteNotifications,
      registerRemoteNotifications,
      subscribe: async (params: Omit<Parameters<typeof subscribe>[0], 'channel' | 'uuid'>) => {
        if (!fcmToken) {
          throw new Error('FCM token not available');
        }
        if (params.event) {
          await enablePush(params.event, params);
        }
        return await subscribe({
          ...params,
          channel: Platform.select({ android: SubscriptionChannel.Fcm, ios: SubscriptionChannel.Apns }) as SubscriptionChannel,
          uuid: fcmToken,
        });
      },
      syncWithServer,
      unsubscribe: async (params: Omit<Parameters<typeof unsubscribe>[0], 'unsubscribeToken'>) => {
        if (!fcmToken) {
          throw new Error('FCM token not available');
        }
        if (params.event === SubscriptionEvent.Default) {
          await setPreference('pushNotificationsEnabled', false);
          await setPreference('fcmToken', undefined);
        } else {
          await enablePush(params.event, undefined);
        }
        return await unsubscribe({
          ...params,
          unsubscribeToken: fcmToken,
        });
      },
    } }>
      <Provider>
        {children}
      </Provider>
    </NotificationContext.Provider>
  );
}
