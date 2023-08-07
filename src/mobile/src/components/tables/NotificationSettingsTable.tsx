import React from 'react';

import RNDateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';

import { SubscriptionEvent } from '~/api';
import {
  PrefSwitch,
  Switch,
  TableView,
  TableViewCell,
  TableViewSection,
} from '~/components';
import { NotificationContext, SessionContext } from '~/contexts';
import { strings } from '~/locales';

export function NotificationSettingsTable() {
  
  const {
    fcmToken,
    pushNotifications,
    pushNotificationsEnabled,
    enablePush,
    setPreference,
  } = React.useContext(SessionContext);
  
  const {
    isRegisteredForRemoteNotifications,
    registerRemoteNotifications,
    subscribe,
    unsubscribe,
  } = React.useContext(NotificationContext);

  const [loaded, setLoaded] = React.useState(false);
  const [enabled, setEnabled] = React.useState(pushNotificationsEnabled);
  const [settings, setSettings] = React.useState(pushNotifications ?? {});
  const [fireTime, setFireTime] = React.useState<Date>();

  const updatePushNotifications = React.useCallback(async (enable = false) => {
    if (!loaded || !fireTime) {
      return;
    }
    try {
      await unsubscribe({ event: SubscriptionEvent.DailyReminder, unsubscribeToken: fcmToken });
      if (enable) {
        if (settings[SubscriptionEvent.DailyReminder]?.fireTime === fireTime.toISOString()) {
          return; 
        }
        if (!await isRegisteredForRemoteNotifications()) {
          await registerRemoteNotifications();
        }
        const fTime = fireTime;
        if (fTime < new Date()) {
          fTime.setDate(new Date().getDate() + 1);
          enablePush(SubscriptionEvent.DailyReminder, { ...settings[SubscriptionEvent.DailyReminder], fireTime: fTime.toISOString() });
          return;
        }
        console.log(fTime);
        const reminders = {
          ...settings[SubscriptionEvent.DailyReminder],
          fireTime: fTime.toISOString(),
        };
        setSettings((prev) => {
          const newState = {
            ...prev,
            [SubscriptionEvent.DailyReminder]: reminders,
          };
          return (prev = newState);
        });
        const messages = [strings.notifications_dailyReminderDescription1, strings.notifications_dailyReminderDescription2, strings.notifications_dailyReminderDescriptionMorning];
        const body = messages[Math.floor(Math.random() * messages.length)];
        setSettings({ ...settings, [SubscriptionEvent.DailyReminder]: reminders });
        await enablePush(SubscriptionEvent.DailyReminder, reminders);
        await subscribe({
          body,
          event: SubscriptionEvent.DailyReminder,
          fireTime: fTime.toISOString(),
          repeats: '1d',
          title: strings.notifications_dailyReminder,
        });
      } else {
        setSettings((prev) => {
          const newState = { ...prev };
          delete newState[SubscriptionEvent.DailyReminder];
          return (prev = newState);
        });
        await enablePush(SubscriptionEvent.DailyReminder, undefined);
      }
    } catch (e) {
      console.error(e);
    }
  }, [loaded, fireTime, unsubscribe, fcmToken, settings, isRegisteredForRemoteNotifications, enablePush, subscribe, registerRemoteNotifications]);

  useFocusEffect(React.useCallback(() => {
    if (loaded) {
      return; 
    }
    setEnabled(pushNotificationsEnabled);
    setSettings(pushNotifications ?? {});
    setLoaded(true);
    const fireTime = new Date(pushNotifications?.[SubscriptionEvent.DailyReminder]?.fireTime ?? new Date().getTime());
    if (Number.isNaN(fireTime.getTime())) {
      setFireTime(new Date(new Date().getTime()));
    } else {
      setFireTime(fireTime);
    }
  }, [loaded, pushNotificationsEnabled, pushNotifications]));
  
  return (
    <TableView 
      flexGrow={ 1 }>
      <TableViewSection>
        <TableViewCell
          bold
          title={ strings.settings_pushNotifications || 'Push Notifications' }
          cellIcon="bell"
          cellAccessoryView={ (
            <PrefSwitch 
              prefKey='pushNotificationsEnabled'
              onValueChange={ async (value) => {
                if (value === true) {
                  setEnabled(true);
                  await registerRemoteNotifications();
                } else {
                  setEnabled(false);
                  await unsubscribe({ event: SubscriptionEvent.Default, unsubscribeToken: fcmToken });
                  setPreference('pushNotificationsEnabled', false);
                  setPreference('fcmToken', undefined);
                }
              } } />
          ) } />
        <TableViewCell
          bold
          disabled={ !enabled }
          title={ strings.settings_dailyRecaps }
          cellIcon="history"
          cellAccessoryView={ (
            <Switch 
              disabled={ !enabled }
              value={ Boolean(settings[SubscriptionEvent.DailyRecap]) }
              onValueChange={ async (value) => {
                if (value === true) {
                  await enablePush(SubscriptionEvent.DailyRecap, {
                    ...settings[SubscriptionEvent.DailyRecap],
                    body: '',
                    title: '',
                  });
                } else {
                  await enablePush(SubscriptionEvent.DailyRecap, undefined);
                }
              } } />
          ) } />
        <TableViewCell
          bold
          disabled={ !enabled }
          title={ strings.settings_dailyReminders }
          cellIcon="calendar"
          cellAccessoryView={ (
            <Switch 
              disabled={ !enabled }
              value={ Boolean(settings[SubscriptionEvent.DailyReminder]) }
              onValueChange={ async (value) => {
                await updatePushNotifications(value);
              } } />
          ) } />
        <TableViewCell
          bold
          disabled={ !settings[SubscriptionEvent.DailyReminder] }
          title={ strings.settings_dailyReminderTime }
          cellIcon="clock"
          cellAccessoryView={ fireTime && (
            <RNDateTimePicker 
              disabled={ !settings[SubscriptionEvent.DailyReminder] }
              value={ fireTime }
              onChange={ async (event, date) => {
                if (date) {
                  setFireTime(date);
                }
                await updatePushNotifications(true);
              } }
              mode="time" />
          ) } />
      </TableViewSection>
    </TableView>
  );
}

