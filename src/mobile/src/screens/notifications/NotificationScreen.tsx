import React from 'react';

import { format as formatDate } from 'date-fns';

import { ScreenComponent } from '../types';

import {
  Divider,
  Markdown,
  Screen,
  Text,
  View,
} from '~/components';
import { getFnsLocale } from '~/locales';

export function NotificationScreen({ route }: ScreenComponent<'notification'>) {
  const notification = React.useMemo(() => route?.params?.notification, [route?.params?.notification]);
  return (
    <Screen>
      <View p={ 12 } gap={ 12 }>
        <View
          flexRow
          justifyBetween
          itemsCenter>
          <Text h6 system>{notification?.title}</Text>
          <Text system>{formatDate(new Date(notification?.createdAt ?? ''), '(E) h:mm a - P', { locale: getFnsLocale() })}</Text>
        </View>
        <Divider />
        <Markdown system>{notification?.text}</Markdown> 
      </View>
    </Screen>
  );

}