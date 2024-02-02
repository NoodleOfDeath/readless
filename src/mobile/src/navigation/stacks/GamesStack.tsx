import React from 'react';

import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SearchTabBarIcon } from '~/navigation';
import { RoutingParams } from '~/screens';
import { GamesSelectionScreen } from '~/screens/games';
import { PlayGameScreen } from '~/screens/games/PlayGameScreen';

const Stack = createNativeStackNavigator<RoutingParams>();

export function GamesStack() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        component={ GamesSelectionScreen }
        name={ 'selectGame' }
        options={ {
          headerBackTitle: '',
          headerRight: () => <SearchTabBarIcon />, 
        } } />
      <Stack.Screen
        component={ PlayGameScreen }
        name={ 'playGame' }
        options={ {
          headerBackTitle: '',
          headerRight: () => <SearchTabBarIcon />, 
        } } />
    </Stack.Navigator>
  );
}