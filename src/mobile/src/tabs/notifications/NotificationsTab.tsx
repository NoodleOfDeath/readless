import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { NotificationsScreen, RootParamList } from '~/screens';

export function NotificationsTab() {
  const Stack = createNativeStackNavigator<RootParamList['notifications']>();
  return (
    <Stack.Navigator initialRouteName="notifications">
      <Stack.Screen
        name="notifications"
        component={ NotificationsScreen }
        options={ { headerShown: false } } />
    </Stack.Navigator>
  );
}
