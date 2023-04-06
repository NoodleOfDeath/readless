import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { 
  DiscoverScreen,
  RootParamList,
  SummaryScreen,
} from '~/screens';

export function DiscoverTab() {
  const Stack = createNativeStackNavigator<RootParamList['discover']>();
  return (
    <Stack.Navigator initialRouteName="default">
      <Stack.Screen
        name="default"
        component={ DiscoverScreen }
        options={ { headerShown: false } } />
      <Stack.Screen
        name="summary"
        component={ SummaryScreen }
        options={ { headerShown: true } } />
    </Stack.Navigator>
  );
}
