import React from 'react';

import { useFocusEffect } from '@react-navigation/native';

import { SubscriptionEvent } from '~/api';
import {
  DateTimePicker,
  PrefSwitch,
  Screen,
  Switch,
  TableView,
  TableViewCell,
  TableViewSection,
} from '~/components';
import { NotificationContext, StorageContext } from '~/contexts';
import { strings } from '~/locales';

export function NotificationSettingsScreen() {
  
  const {
    pushNotifications,
    pushNotificationsEnabled,
  } = React.useContext(StorageContext);
  
  const {
    registerRemoteNotifications,
    subscribe,
    syncWithServer,
    unsubscribe,
  } = React.useContext(NotificationContext);

  const [loaded, setLoaded] = React.useState(false);
  const [enabled, setEnabled] = React.useState(pushNotificationsEnabled);
  const [settings, setSettings] = React.useState(pushNotifications ?? {});
  const [dailyFireTime, setDailyFireTime] = React.useState<Date>();

  const updatePushNotifications = React.useCallback(async (enable = false) => {
    if (!loaded || !dailyFireTime) {
      return;
    }
    try {
      await unsubscribe({ event: SubscriptionEvent.DailyReminder });
      if (enable) {
        if (settings[SubscriptionEvent.DailyReminder]?.fireTime === dailyFireTime.toISOString()) {
          return; 
        }
        const reminders = {
          ...settings[SubscriptionEvent.DailyReminder],
          fireTime: dailyFireTime.toISOString(),
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
          body: strings.thisIsYourDailyReminder,
          event: SubscriptionEvent.DailyReminder,
          fireTime: dailyFireTime.toISOString(),
          repeats: '1d',
          title: strings.dailyReminder,
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
  }, [loaded, dailyFireTime, unsubscribe, settings, subscribe]);

  useFocusEffect(React.useCallback(() => {
    if (loaded) {
      return; 
    }
    syncWithServer().then(() => {
      setEnabled(pushNotificationsEnabled);
      setSettings(pushNotifications ?? {});
      setLoaded(true);
      const dailyFireTime = new Date(pushNotifications?.[SubscriptionEvent.DailyReminder]?.fireTime ?? new Date().getTime());
      if (Number.isNaN(dailyFireTime.getTime())) {
        setDailyFireTime(new Date(new Date().getTime()));
      } else {
        setDailyFireTime(dailyFireTime);
      }
    }).catch(console.error);
  }, [loaded, syncWithServer, pushNotificationsEnabled, pushNotifications]));
  
  return (
    <Screen>
      <TableView 
        flexGrow={ 1 }>
        <TableViewSection
          grouped
          header={ strings.pushNotifications }>
          <TableViewCell
            bold
            title={ strings.pushNotifications }
            cellIcon="bell"
            cellAccessoryView={ (
              <PrefSwitch 
                prefKey='pushNotificationsEnabled'
                onValueChange={ async (value) => {
                  setEnabled(value);
                  if (value === true) {
                    registerRemoteNotifications(true);
                  } else {
                    await unsubscribe({ event: SubscriptionEvent.Default });
                  }
                } } />
            ) } />
          <TableViewCell
            bold
            disabled={ !enabled }
            title={ strings.streakReminders }
            cellIcon="flash"
            cellAccessoryView={ (
              <Switch 
                disabled={ !enabled }
                value={ Boolean(settings[SubscriptionEvent.StreakReminder]) }
                onValueChange={ async (value) => {
                  setSettings((prev) => {
                    const newState = { ...prev };
                    if (value === true) {
                      newState[SubscriptionEvent.StreakReminder] = {};
                    } else {
                      delete newState[SubscriptionEvent.StreakReminder];
                    }
                    return (prev = newState);
                  });
                  if (value === true) {
                    await subscribe({
                      body: strings.keepYourStreakGoing,
                      event: SubscriptionEvent.StreakReminder,
                      title: strings.streakReminders,
                    });
                  } else {
                    await unsubscribe({ event: SubscriptionEvent.StreakReminder });
                  }
                } } />
            ) } />
          <TableViewCell
            bold
            disabled={ !enabled }
            title={ strings.dailyRecaps }
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
                      title: strings.dailyRecaps,
                    });
                  } else {
                    await unsubscribe({ event: SubscriptionEvent.DailyRecap });
                  }
                } } />
            ) } />
          <TableViewCell
            bold
            disabled={ !enabled }
            title={ strings.dailyReminder }
            cellIcon="calendar"
            cellAccessoryView={ (
              <Switch 
                disabled={ !enabled }
                value={ Boolean(settings[SubscriptionEvent.DailyReminder]) }
                onValueChange={ async (value) => {
                  setDailyFireTime(value ? new Date() : undefined);
                  registerRemoteNotifications(true);
                  await updatePushNotifications(value);
                } } />
            ) } />
          <TableViewCell
            bold
            disabled={ !settings[SubscriptionEvent.DailyReminder] }
            title={ strings.dailyReminderTime }
            cellIcon="clock"
            cellAccessoryView={ Boolean(settings[SubscriptionEvent.DailyReminder]) && dailyFireTime && (
              <DateTimePicker 
                disabled={ !settings[SubscriptionEvent.DailyReminder] }
                value={ dailyFireTime }
                onChange={ async (event, date) => {
                  if (event.type !== 'set') {
                    return;
                  }
                  if (date) {
                    const newDate = new Date();
                    newDate.setMonth(new Date().getMonth());
                    newDate.setFullYear(new Date().getFullYear());
                    if (date.getHours() < new Date().getHours()) {
                      newDate.setDate(new Date().getDate() + 1);
                    }
                    newDate.setHours(date.getHours());
                    newDate.setMinutes(date.getMinutes());
                    setDailyFireTime(newDate);
                  }
                  registerRemoteNotifications();
                  await updatePushNotifications(true);
                } }
                mode="time" />
            ) } />
        </TableViewSection>
      </TableView>
    </Screen>
  );
}

