import React from 'react';

import { format as formatDate } from 'date-fns';

import {
  Divider,
  Markdown,
  Screen,
  Text,
  View,
} from '~/components';
import { getFnsLocale } from '~/locales';
import { ScreenComponent } from '~/screens/types';

export function NotificationScreen({ route }: ScreenComponent<'notification'>) {
  const notification = React.useMemo(() => route?.params?.notification, [route?.params?.notification]);
  return (
    <Screen>
      <View p={ 12 } gap={ 12 }>
        <View gap={ 6 }>
          <Text h6 system>{notification?.title}</Text>
          <Text
            body2 
            system>
            {formatDate(new Date(notification?.createdAt ?? ''), 'PP @ h:mm a', { locale: getFnsLocale() })}
          </Text>
        </View>
        <Divider />
        <Markdown system>{notification?.text}</Markdown> 
      </View>
    </Screen>
  );

}