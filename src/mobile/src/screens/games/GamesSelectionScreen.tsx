import React from 'react';

import { ScreenComponent } from '../types';

import {
  Button,
  ChildlessViewProps,
  Screen,
  Text,
  View,
} from '~/components';

export type GameProps = {
  name: string;
  displayName?: string;
};

export function GameTile({ ...props }: ChildlessViewProps & GameProps) {
  return (
    <View p={ 32 } gap={ 12 } bg={ 'red' } { ...props }>
      <Text textCenter>{props.displayName ?? props.name}</Text>
      <Button contained>Play</Button>
    </View>
  );

}

export const GAMES = [
  { name: 'wordle' },
];

export function GamesSelectionScreen({ navigation }: ScreenComponent<'games'>) {
  return (
    <Screen>
      <View flex={ 1 } p={ 12 }>
        {GAMES.map((game) => (
          <GameTile 
            key={ game.name }
            { ...game }
            onPress={ () => navigation?.navigate('play', { name: game.name }) } />
        ))}
      </View>
    </Screen>
  );
}