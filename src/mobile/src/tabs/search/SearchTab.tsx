import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { 
  RootParamList,
  SearchScreen,
  SummaryScreen,
} from '~/screens';

export function SearchTab() {
  const Stack = createNativeStackNavigator<RootParamList['search']>();
  return (
    <Stack.Navigator initialRouteName="search">
      <Stack.Screen
        name="search"
        component={ SearchScreen }
        options={ { headerShown: false } } />
      <Stack.Screen
        name="summary"
        component={ SummaryScreen }
        options={ { headerShown: true } } />
    </Stack.Navigator>
  );
}
