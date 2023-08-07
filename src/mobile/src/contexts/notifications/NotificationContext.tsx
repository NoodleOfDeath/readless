import React from 'react';
import { Platform } from 'react-native';

import messaging from '@react-native-firebase/messaging';
import { registerSheet } from 'react-native-actions-sheet';
import { Notifications, RegistrationError } from 'react-native-notifications';
import { Provider } from 'react-native-paper';

import { DEFAULT_NOTIFICATION_CONTEXT } from './types';

import { SubscriptionChannel } from '~/api';
import {
  AppearanceWalkthrough,
  BookmarkWalkthrough,
  CustomFeedWalkthrough,
  FeedbackDialog,
  OnboardingWalkthrough,
  SentimentWalkthrough,
  ShareDialog,
  SharingWalkthrough,
  TriggerWordsWalkthrough,
  WhatsNewWalkthrough,
} from '~/components';
import { SessionContext } from '~/contexts';
import { useApiClient } from '~/hooks';

export const NotificationContext = React.createContext(DEFAULT_NOTIFICATION_CONTEXT);

export function NotificationContextProvider({ children }: React.PropsWithChildren) {

  const { subscribe, unsubscribe } = useApiClient();

  const { setPreference } = React.useContext(SessionContext);

  React.useEffect(() => {
    // onboarding/features
    registerSheet('appearance-walkthrough', AppearanceWalkthrough);
    registerSheet('bookmark-walkthrough', BookmarkWalkthrough);
    registerSheet('custom-feed-walkthrough', CustomFeedWalkthrough);
    registerSheet('onboarding-walkthrough', OnboardingWalkthrough);
    registerSheet('sentiment-walkthrough', SentimentWalkthrough);
    registerSheet('sharing-walkthrough', SharingWalkthrough);
    registerSheet('trigger-words-walkthrough', TriggerWordsWalkthrough);
    registerSheet('whats-new', WhatsNewWalkthrough);
    // summary specific
    registerSheet('share', ShareDialog);
    registerSheet('feedback', FeedbackDialog);
    
  }, []);
  
  const registerRemoteNotifications = React.useCallback(async () => {
    
    Notifications.registerRemoteNotifications();
    
    Notifications.events().registerRemoteNotificationsRegistered(async () => {
      try {
        const channel = Platform.select({ android: SubscriptionChannel.Fcm, ios: SubscriptionChannel.Apns });
        if (!channel) {
          return;
        }
        const newFcmToken = await messaging().getToken();
        setPreference('pushNotificationsEnabled', true);
        setPreference('fcmToken', newFcmToken);
        await subscribe({
          channel,
          event: 'default',
          uuid: newFcmToken,
        });
      } catch (error) {
        console.error(error);
        return;
      }
    });
    
    Notifications.events().registerRemoteNotificationsRegistrationFailed((event: RegistrationError) => {
      console.error(event);
    });

    Notifications.events().registerNotificationReceivedForeground((notification, completion) => {
      console.log(`Notification received in foreground: ${notification.title} : ${notification.body}`);
      completion({
        alert: true, badge: true, sound: true, 
      });
    });

    Notifications.events().registerNotificationOpened((notification, completion) => {
      console.log(`Notification opened: ${notification.payload}`);
      completion();
    });
    
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
      
  }, [setPreference, subscribe]);

  return (
    <NotificationContext.Provider value={ { 
      registerRemoteNotifications,
      unsubscribe,
    } }>
      <Provider>
        {children}
      </Provider>
    </NotificationContext.Provider>
  );
}
