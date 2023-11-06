import React from 'react';

import { useFocusEffect } from '@react-navigation/native';

import { WordleGame } from './wordle';
import { ScreenComponent } from '../types';

import { Screen, View } from '~/components';

export function PlayGameScreen({ route, navigation }: ScreenComponent<'play'>) {
  
  useFocusEffect(React.useCallback(() => {
    navigation?.setOptions({ headerTitle: route?.params.name });
  }, [route, navigation]));
  
  if (route?.params.name === 'wordle') {
    return (
      <Screen>
        <View flex={ 1 } itemsCenter justifyCenter>
          <WordleGame word="berry" />
        </View>
      </Screen>
    );
  }

}
