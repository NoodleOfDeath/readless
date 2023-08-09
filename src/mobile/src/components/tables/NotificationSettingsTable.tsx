import React from 'react';

import { useFocusEffect } from '@react-navigation/native';

import { SubscriptionEvent } from '~/api';
import {
  DateTimePicker,
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
    pushNotifications,
    pushNotificationsEnabled,
  } = React.useContext(SessionContext);
  
  const {
    registerRemoteNotifications,
    subscribe,
    syncWithServer,
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
      await unsubscribe({ event: SubscriptionEvent.DailyReminder });
      if (enable) {
        if (settings[SubscriptionEvent.DailyReminder]?.fireTime === fireTime.toISOString()) {
          return; 
        }
        await registerRemoteNotifications();
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
      }
    } catch (e) {
      console.error(e);
    }
  }, [loaded, fireTime, unsubscribe, settings, subscribe, registerRemoteNotifications]);

  useFocusEffect(React.useCallback(() => {
    if (loaded) {
      return; 
    }
    syncWithServer().then(() => {
      setEnabled(pushNotificationsEnabled);
      setSettings(pushNotifications ?? {});
      setLoaded(true);
      const fireTime = new Date(pushNotifications?.[SubscriptionEvent.DailyReminder]?.fireTime ?? new Date().getTime());
      if (Number.isNaN(fireTime.getTime())) {
        setFireTime(new Date(new Date().getTime()));
      } else {
        setFireTime(fireTime);
      }
    }).catch(console.error);
  }, [loaded, syncWithServer, pushNotificationsEnabled, pushNotifications]));
  
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
                setEnabled(value);
                if (value === true) {
                  await registerRemoteNotifications();
                } else {
                  await unsubscribe({ event: SubscriptionEvent.Default });
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
                setSettings((prev) => {
                  const newState = { ...prev };
                  if (value === true) {
                    newState[SubscriptionEvent.DailyRecap] = {};
                  } else {
                    delete newState[SubscriptionEvent.DailyRecap];
                  }
                  return (prev = newState);
                });
                if (value === true) {
                  await subscribe({
                    event: SubscriptionEvent.DailyRecap,
                    title: strings.settings_dailyRecaps,
                  });
                } else {
                  await unsubscribe({ event: SubscriptionEvent.DailyRecap });
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
                setFireTime(value ? new Date() : undefined);
                await updatePushNotifications(value);
              } } />
          ) } />
        <TableViewCell
          bold
          disabled={ !settings[SubscriptionEvent.DailyReminder] }
          title={ strings.settings_dailyReminderTime }
          cellIcon="clock"
          cellAccessoryView={ fireTime && (
            <DateTimePicker 
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

