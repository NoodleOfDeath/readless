import React from 'react';

import {
  Button,
  ChildlessViewProps,
  NativeTextInput,
  TextInput,
  View,
} from '~/components';
import { LayoutContext } from '~/contexts';

type WordleRowProps = ChildlessViewProps & {
  text: string;
  maxLength: number;
  correctAnswer: string;
  revealed?: boolean;
};

function WordleRow({
  text, maxLength, correctAnswer, revealed, ...props 
}: WordleRowProps) {
  const { screenHeight } = React.useContext(LayoutContext);
  return (
    <View gap={ 6 } { ...props } height={ screenHeight * 0.075 } flexRow>
      {[...Array(maxLength).keys()].map((_, index) => {
        const bg = revealed && text.length === maxLength ? text[index] === correctAnswer[index] ? 'green' : correctAnswer.includes(text[index]) ? 'orange' : 'red' : 'gray';
        const color = revealed && text.length === maxLength ? text[index] === correctAnswer[index] ? 'white' : 'black' : 'black';
        return (
          <Button
            key={ index }
            flex={ 1 }
            h1
            bg={ bg }
            color={ color }>
            {text[index]}
          </Button>
        );
      })}
    </View>
  );
}

export type WordleGameProps = {
  word?: string;
  maxGuesses?: number;
  maxLength?: number;
};

export function WordleGame({
  word = 'fuckme',
  maxGuesses = 6,
  maxLength = word.length,
  ...props 
}: WordleGameProps) {

  const [guesses, setGuesses] = React.useState<string[]>([...Array(maxGuesses).keys()].map(() => ''));
  const [currentGuess, setCurrentGuess] = React.useState<string>('');

  const textRef = React.useRef<NativeTextInput | null>(null);

  return (
    <View { ...props } flex={ 1 }>
      <View gap={ 6 } flex={ 1 }> 
        <WordleRow
          correctAnswer={ word }
          text={ currentGuess }
          maxLength={ maxLength }
          onPress={ () => textRef.current?.focus() } />
        {guesses.map((_, index) => (
          index < guesses.length - 1 && (
            <WordleRow
              key={ index }
              revealed
              correctAnswer={ word }
              text={ guesses[index] }
              maxLength={ maxLength }
              onPress={ () => textRef.current?.focus() } />
          )
        ))}
      </View>
      <TextInput 
        ref={ textRef }
        display='none'
        autoFocus
        value={ currentGuess }
        onChange={ (e) => {
          const text = e.nativeEvent.text;
          if (text.length <= maxLength) {
            setCurrentGuess(text);
          }
        } }
        onSubmitEditing={ (e) => {
          const text = e.nativeEvent.text;
          if (text.length === maxLength) {
            setGuesses((prev) => {
              const state = [...prev];
              state[prev.filter((g) => g.length).length] = text;
              return (prev = state);
            });
            setCurrentGuess('');
          }
        } } />
    </View>
  );
}