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
        console.log(fireTime);
        const reminders = {
          ...settings[SubscriptionEvent.DailyReminder],
          fireTime: fireTime.toISOString(),
        };
        setSettings((prev) => {
          const newState = {
            ...prev,
            [SubscriptionEvent.DailyReminder]: reminders,
          };
          return (prev = newState);
        });
        setSettings({ ...settings, [SubscriptionEvent.DailyReminder]: reminders });
        await enablePush(SubscriptionEvent.DailyReminder, reminders);
        await subscribe({
          body: strings.notifications_dailyReminderDescription,
          event: SubscriptionEvent.DailyReminder,
          fireTime: fireTime.toISOString(),
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
      <TableViewSection header={ strings.settings_pushNotifications }>
        <TableViewCell
          bold
          title={ strings.settings_pushNotifications }
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
                  setSettings((prev) => {
                    const newState = { ...prev };
                    newState[SubscriptionEvent.DailyRecap] = {
                      body: '',
                      title: '',
                    };
                    return (prev = newState);
                  });
                  await enablePush(SubscriptionEvent.DailyRecap, {
                    body: '',
                    title: '',
                  });
                  await subscribe({
                    body: '',
                    event: SubscriptionEvent.DailyRecap,
                    title: strings.settings_dailyRecaps,
                  });
                } else {
                  setSettings((prev) => {
                    const newState = { ...prev };
                    delete newState[SubscriptionEvent.DailyRecap];
                    return (prev = newState);
                  });
                  await enablePush(SubscriptionEvent.DailyRecap, undefined);
                  await unsubscribe({ event: SubscriptionEvent.DailyRecap, unsubscribeToken: fcmToken });
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
                setFiretime(value ? new Date() : undefined);
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
                  const newDate = new Date();
                  newDate.setMonth(new Date().getMonth());
                  newDate.setFullYear(new Date().getFullYear());
                  if (date.getHours() < new Date().getHours()) {
                    newDate.setDate(new Date().getDate() + 1);
                  }
                  newDate.setHours(date.getHours());
                  newDate.setMinutes(date.getMinutes());
                  setFireTime(newDate);
                }
                await updatePushNotifications(true);
              } }
              mode="time" />
          ) } />
      </TableViewSection>
    </TableView>
  );
}

