import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { 
  RootParamList,
  SummaryScreen,
  YourStuffScreen,
} from '~/screens';

export function YourStuffTab() {
  const Stack = createNativeStackNavigator<RootParamList['yourStuff']>();
  return (
    <Stack.Navigator initialRouteName="default">
      <Stack.Screen
        name="default"
        component={ YourStuffScreen }
        options={ { headerShown: false } } />
      <Stack.Screen
        name="summary"
        component={ SummaryScreen }
        options={ { headerShown: true } } />
    </Stack.Navigator>
  );
}
