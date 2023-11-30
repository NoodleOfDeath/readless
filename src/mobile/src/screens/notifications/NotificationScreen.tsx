import React from 'react';

import { ScreenComponent } from '../types';

import { Screen, Text } from '~/components';

export function NotificationScreen({ route }: ScreenComponent<'notification'>) {
  const notification = React.useMemo(() => route?.params?.notification, [route?.params?.notification]);
  return (
    <Screen>
      <Text>{notification?.title}</Text>
      <Text>{notification?.text}</Text>
    </Screen>
  );

}