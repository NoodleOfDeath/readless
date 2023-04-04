import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { LoginScreen, RootParamList } from '~/screens';

export function ProfileTab() {
  const Stack = createNativeStackNavigator<RootParamList['profile']>();
  return (
    <Stack.Navigator initialRouteName="login">
      <Stack.Screen
        name="login"
        component={ LoginScreen }
        options={ { headerShown: false } } />
    </Stack.Navigator>
  );
}
