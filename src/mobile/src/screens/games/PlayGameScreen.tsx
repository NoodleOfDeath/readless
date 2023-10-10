import React from 'react';

import { WordleGame } from './WordleGame';
import { ScreenComponent } from '../types';

import { Screen } from '~/components';

export function PlayGameScreen({ route }: ScreenComponent<'play'>) {
  
  if (route?.params.name === 'wordle') {
    return (
      <Screen>
        <WordleGame />
      </Screen>
    );
  }

}
