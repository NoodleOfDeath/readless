import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { 
  MyStuffScreen,
  RootParamList,
  SearchScreen,
  SummaryScreen,
} from '~/screens';

export function MyStuffTab() {
  const Stack = createNativeStackNavigator<RootParamList['yourStuff']>();
  return (
    <Stack.Navigator initialRouteName="default">
      <Stack.Screen
        name="default"
        component={ MyStuffScreen }
        options={ { headerShown: false } } />
      <Stack.Screen
        name="category"
        component={ SearchScreen }
        options={ { headerShown: false } } />
      <Stack.Screen
        name="summary"
        component={ SummaryScreen }
        options={ { headerShown: true } } />
    </Stack.Navigator>
  );
}
