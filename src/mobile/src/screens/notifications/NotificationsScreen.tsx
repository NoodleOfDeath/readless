import React from 'react';

import { ScreenComponent } from '../types';

import {
  Button,
  Screen,
  ScrollView,
  TableView,
  TableViewCell,
  TableViewSection,
  View,
} from '~/components';
import { StorageContext } from '~/contexts';
import { strings } from '~/locales';
import { timeAgo } from '~/utils';

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
      <View>
        <Button
          contained
          m={ 12 }
          mb={ 0 }
          onPress={ () => unreadNotificationCount > 0 ?
            readNotification(...(notifications ?? [])) : setStoredValue('readNotifications', {}) }>
          {unreadNotificationCount > 0 ? strings.markAllAsRead : strings.markAllAsUnread}
        </Button>
        <ScrollView>
          <TableView>
            <TableViewSection grouped>
              {notifications?.map((notification) => (
                <TableViewCell 
                  subtitle
                  key={ notification.id }
                  title={ notification.title }
                  accessory={ 'DisclosureIndicator' }
                  bold={ !hasReadNotification(notification) }
                  cellIcon={ hasReadNotification(notification) ? undefined : 'circle' }
                  detail={ `${timeAgo(new Date(notification.createdAt ?? ''))} - ${notification.text}` }
                  onPress={ () => {
                    readNotification(notification);
                    navigation?.push('notification', { notification }); 
                  } } />
              ))}
            </TableViewSection>
          </TableView>
        </ScrollView>
      </View>
    </Screen>
  );

}