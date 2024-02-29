import React from 'react';

import {
  Button,
  ChildlessViewProps,
  Screen,
  Text,
  View,
} from '~/components';
import { ScreenComponent } from '~/screens/types';

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

export function GamesSelectionScreen({ navigation }: ScreenComponent<'selectGame'>) {
  return (
    <Screen>
      <View flex={ 1 } p={ 12 }>
        {GAMES.map((game) => (
          <GameTile 
            key={ game.name }
            { ...game }
            onPress={ () => navigation?.navigate('playGame', { name: game.name }) } />
        ))}
      </View>
    </Screen>
  );
}