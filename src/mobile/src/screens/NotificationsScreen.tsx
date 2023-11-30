import React from 'react';

import { useFocusEffect } from '@react-navigation/native';

import { ScreenComponent } from './types';

import { SystemNotificationAttributes } from '~/api';
import {
  Screen,
  ScrollView,
  TableView,
  TableViewCell,
} from '~/components';
import { StorageContext, ToastContext } from '~/contexts';

export function NotificationsScreen({ navigation }: ScreenComponent<'notifications'>) {

  const { api: { getSystemNotifications } } = React.useContext(StorageContext);
  const { showToast } = React.useContext(ToastContext);

  const [notifications, setNotifications] = React.useState<SystemNotificationAttributes[]>();

  const onMount = React.useCallback(async () => {
    try {
      const { data, error } = await getSystemNotifications();
      if (error) {
        throw error;
      }
      setNotifications(data.rows);
    } catch (error) {
      showToast(error);
    }
  }, [getSystemNotifications, showToast]);

  useFocusEffect(React.useCallback(() => {
    onMount(); 
  }, [onMount]));

  return (
    <Screen>
      <ScrollView>
        <TableView>
          {notifications?.map((notif) => (
            <TableViewCell key={ notif.id } />
          ))}
        </TableView>
      </ScrollView>
    </Screen>
  );

}