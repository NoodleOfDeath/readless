import React from 'react';

import { useFocusEffect } from '@react-navigation/native';

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
    fcmToken: unsubscribeToken,
    pushNotifications,
    pushNotificationsEnabled,
    enablePush,
    setPreference,
  } = React.useContext(SessionContext);
  
  const {
    registerRemoteNotifications,
    unsubscribe,
  } = React.useContext(NotificationContext);

  const [enabled, setEnabled] = React.useState(pushNotificationsEnabled);
  const [settings, setSettings] = React.useState(pushNotifications ?? {});

  useFocusEffect(React.useCallback(() => {
    setEnabled(pushNotificationsEnabled);
    setSettings(pushNotifications ?? {});
  }, [pushNotificationsEnabled, pushNotifications]));
  
  return (
    <TableView 
      flexGrow={ 1 }>
      <TableViewSection>
        <TableViewCell
          bold
          title={ strings.settings_pushNotifications || 'Push Notifications' }
          cellIcon="view-headline"
          cellAccessoryView={ (
            <PrefSwitch 
              prefKey='pushNotificationsEnabled'
              onValueChange={ async (value) => {
                if (value === true) {
                  setEnabled(true);
                  await registerRemoteNotifications();
                } else {
                  setEnabled(false);
                  await unsubscribe({ unsubscribeToken });
                  setPreference('pushNotificationsEnabled', false);
                  setPreference('fcmToken', undefined);
                }
              } } />
          ) } />
        <TableViewCell
          bold
          disabled={ !enabled }
          title={ 'Daily Reminders' }
          cellIcon="view-headline"
          cellAccessoryView={ (
            <Switch 
              value={ Boolean(settings['daily-reminders']) }
              onValueChange={ async (value) => {
                if (value === true) {
                  settings['daily-reminders'] = { frequency: '1d' };
                  enablePush('daily-reminders', settings['daily-reminders']);
                  await registerRemoteNotifications();
                } else {
                  setEnabled(false);
                  delete settings['daily-reminders'];
                  enablePush('daily-reminders', undefined);
                  setPreference('fcmToken', undefined);
                }
              } } />
          ) } />
      </TableViewSection>
    </TableView>
  );
}

