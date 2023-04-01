import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ResultsView from './ResultsView';
import { RootParamList } from '../../types';
import SummaryScreen from '../summary/SummaryScreen';

export default function HomeScreen() {
  const Stack = createNativeStackNavigator<RootParamList['Discover']>();
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={ ResultsView }
        options={ { headerShown: false } } />
      <Stack.Screen
        name="Summary"
        component={ SummaryScreen }
        options={ { headerShown: true } } />
    </Stack.Navigator>
  );
}
