import React from 'react';

import { RouteProp, TabNavigationState } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { RootParamList, SettingsScreen } from '~/screens';

type Props = {
  route: RouteProp<RootParamList, 'settings'>;
  navigation: TabNavigationState<RootParamList>;
};

export function SettingsTab({ route, navigation }: Props) {
  
  const Stack = createNativeStackNavigator<RootParamList['settings']>();
  
  return (
    <Stack.Navigator initialRouteName="default">
      <Stack.Screen
        name="default"
        component={ SettingsScreen }
        options={ { headerShown: false } } />
    </Stack.Navigator>
  );
}
