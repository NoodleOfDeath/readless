import React from 'react';

import { format as formatDate } from 'date-fns';

import { ScreenComponent } from '../types';

import {
  Button,
  Screen,
  ScrollView,
  TableView,
  TableViewCell,
  View,
} from '~/components';
import { StorageContext } from '~/contexts';
import { getFnsLocale, strings } from '~/locales';

export function NotificationsScreen({ navigation }: ScreenComponent<'notifications'>) {

  const {
    notifications,
    unreadNotificationCount,
    hasReadNotification, 
    readNotification, 
    setStoredValue,
  } = React.useContext(StorageContext);

  return (
    <Screen>
      <View gap={ 12 } m={ 12 }>
        <Button
          contained
          onPress={ () => unreadNotificationCount > 0 ?
            readNotification(...(notifications ?? [])) : setStoredValue('readNotifications', {}) }>
          {unreadNotificationCount > 0 ? strings.markAllAsRead : strings.markAllAsUnread}
        </Button>
        <ScrollView>
          <TableView>
            {notifications?.map((notification) => (
              <TableViewCell 
                key={ notification.id }
                title={ notification.title }
                bold={ !hasReadNotification(notification) }
                cellIcon={ hasReadNotification(notification) ? undefined : 'circle' }
                detail={ formatDate(new Date(notification.createdAt ?? ''), '(E) h:M a - P', { locale: getFnsLocale() }) }
                onPress={ () => {
                  readNotification(notification);
                  navigation?.push('notification', { notification }); 
                } } />
            ))}
          </TableView>
        </ScrollView>
      </View>
    </Screen>
  );

}