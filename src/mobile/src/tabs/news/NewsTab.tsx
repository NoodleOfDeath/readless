import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { 
  NewsScreen,
  RootParamList,
  SummaryScreen,
} from '~/screens';

export function NewsTab() {
  const Stack = createNativeStackNavigator<RootParamList['news']>();
  return (
    <Stack.Navigator initialRouteName="home">
      <Stack.Screen
        name="home"
        component={ NewsScreen }
        options={ { headerShown: false } } />
      <Stack.Screen
        name="summary"
        component={ SummaryScreen }
        options={ { headerShown: true } } />
    </Stack.Navigator>
  );
}
