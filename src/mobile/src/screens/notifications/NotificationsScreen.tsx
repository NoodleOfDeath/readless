import React from 'react';

import {
  Button,
  Divider,
  FetchableList,
  Screen,
  TableViewCell,
  View,
} from '~/components';
import { StorageContext } from '~/contexts';
import { useNavigation } from '~/hooks';
import { strings } from '~/locales';
import { ScreenComponent } from '~/screens/types';
import { timeAgo } from '~/utils';

export function NotificationsScreen(_props: ScreenComponent<'notifications'>) {

  const { navigate } = useNavigation();
  const {
    api: { getSystemNotifications },
    notifications,
    setNotifications,
    unreadNotificationCount,
    hasReadNotification, 
    readNotification, 
    setStoredValue,
  } = React.useContext(StorageContext);

  return (
    <Screen>
      <View
        gap={ 12 }
        m={ 12 }
        flexGrow={ 1 }>
        <Button
          contained
          onPress={ () => unreadNotificationCount > 0 ?
            readNotification(...(notifications ?? [])) : setStoredValue('readNotifications', {}) }>
          {unreadNotificationCount > 0 ? strings.markAllAsRead : strings.markAllAsUnread}
        </Button>
        <View flexGrow={ 1 }>
          <FetchableList
            fallbackComponent={ <Button>{strings.youHaveNoNotifications}</Button> }
            data={ notifications }
            fetch={ getSystemNotifications }
            onFetch={ setNotifications }
            renderItem={ ({ item: notification }) => (
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
                  navigate('notification', { notification });
                } } />
            ) }
            ItemSeparatorComponent={ ({ index }) => <Divider key={ `divider-${index}` } /> }
            extraData={ unreadNotificationCount }
            estimatedItemSize={ 50 } />
        </View>
      </View>
    </Screen>
  );

} 