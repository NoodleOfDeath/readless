import React from 'react';
import {
  Linking,
  PermissionsAndroid,
  Platform,
} from 'react-native';

import messaging from '@react-native-firebase/messaging';
import { Notifications } from 'react-native-notifications';

import { DEFAULT_NOTIFICATION_CONTEXT } from './types';

import { SubscriptionChannel, SubscriptionEvent } from '~/api';
import { StorageContext, ToastContext } from '~/contexts';
import { strings } from '~/locales';

export const NotificationContext = React.createContext(DEFAULT_NOTIFICATION_CONTEXT);

export function NotificationContextProvider({ children }: React.PropsWithChildren) {

  const { 
    api: { 
      getSubscriptionStatus,
      subscribe, 
      unsubscribe,
    },
    userData,
    fcmToken, 
    enablePush,
    setStoredValue,
  } = React.useContext(StorageContext);
  const { showToast } = React.useContext(ToastContext);

  const [redirectToSettings, setRedirectToSettings] = React.useState(false);
  
  const syncWithServer = React.useCallback(async () => {
    if (userData?.valid || !fcmToken) {
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
      await setStoredValue('pushNotifications', (prev) => {
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
      console.error(e);
      showToast(e);
    }
  }, [userData?.valid, fcmToken, getSubscriptionStatus, setStoredValue, showToast]);

  const isRegisteredForRemoteNotifications = React.useCallback(async (redirectOnFail = false) => {
    const fail = () => {
      setStoredValue('pushNotificationsEnabled', false);
      setStoredValue('fcmToken', undefined);
      setStoredValue('pushNotifications', {});
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
          message: strings.keepYourStreakGoing, 
          title: strings.dailyReminder,
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
  }, [setStoredValue]);

  const registerRemoteNotifications = React.useCallback((redirectOnFail = false) => {
    try {
      setRedirectToSettings(redirectOnFail);
      Notifications.registerRemoteNotifications();
    } catch (e) {
      console.error(e);
      showToast(e);
    }
  }, [showToast]);

  React.useEffect(() => {

    const listeners = [
      Notifications.events().registerRemoteNotificationsRegistered(async () => {
        try {
          if (!await isRegisteredForRemoteNotifications(redirectToSettings)) {
            return;
          }
          await syncWithServer();
          const channel = Platform.select({ android: SubscriptionChannel.Fcm, ios: SubscriptionChannel.Apns });
          if (!channel) {
            return;
          }
          const newFcmToken = await messaging().getToken();
          setStoredValue('pushNotificationsEnabled', true);
          setStoredValue('fcmToken', newFcmToken);
          await subscribe({
            channel,
            event: SubscriptionEvent.Default,
            uuid: newFcmToken,
          });
          await subscribe({
            body: strings.keepYourStreakGoing,
            channel,
            event: SubscriptionEvent.StreakReminder,
            title: strings.streakReminders,
            uuid: newFcmToken,
          });
        } catch (e) {
          console.error(e);
          showToast(e);
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

  }, [isRegisteredForRemoteNotifications, redirectToSettings, setStoredValue, showToast, subscribe, syncWithServer]);

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
          await setStoredValue('pushNotificationsEnabled', false);
          await setStoredValue('fcmToken', undefined);
        } else {
          await enablePush(params.event, undefined);
        }
        return await unsubscribe({
          ...params,
          unsubscribeToken: fcmToken,
        });
      },
    } }>
      {children}
    </NotificationContext.Provider>
  );
}
