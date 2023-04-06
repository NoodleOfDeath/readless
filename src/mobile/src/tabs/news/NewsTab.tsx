import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { 
  NewsScreen,
  RootParamList,
  SearchScreen,
  SummaryScreen,
} from '~/screens';

export function NewsTab() {
  const Stack = createNativeStackNavigator<RootParamList['news']>();
  return (
    <Stack.Navigator initialRouteName="default">
      <Stack.Screen
        name="default"
        component={ NewsScreen }
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
