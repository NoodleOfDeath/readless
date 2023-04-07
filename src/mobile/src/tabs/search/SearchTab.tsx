import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import {
  RootParamList,
  SearchScreen,
  SummaryScreen,
} from '~/screens';

export function SearchTab() {
  const Stack = createNativeStackNavigator<RootParamList['searchTab']>();
  return (
    <Stack.Navigator initialRouteName="default">
      <Stack.Screen
        name="default"
        component={ SearchScreen }
        options={ { headerShown: false } } />
      <Stack.Screen
        name="summary"
        component={ SummaryScreen }
        options={ { headerShown: false } } />
    </Stack.Navigator>
  );
}
