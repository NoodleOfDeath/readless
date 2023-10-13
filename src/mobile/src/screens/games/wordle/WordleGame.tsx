import React from 'react';

import {
  Button,
  ChildlessViewProps,
  DEFAULT_KEYS,
  OnscreenKeyboard,
  View,
} from '~/components';
import { LayoutContext } from '~/contexts';

type LetterClue = 'exact' | 'close' | 'wrong';

const LETTER_COLORS = {
  close: {
    bg: 'orange',
    color: 'white',
  },
  exact: {
    bg: 'green',
    color: 'white',
  },
  unknown: {
    bg: 'gray',
    color: 'white',
  },
  wrong: {
    bg: 'red',
    color: 'white',
  },
};

function letterClue(answer: string, guess: string, index: number): LetterClue {
  if (answer.length < index || guess.length < index) {
    return 'wrong';
  }
  const letter = guess[index];
  return letter === answer[index] ? 'exact' : answer.includes(letter) ? 'close' : 'wrong';
}

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
    <View gap={ 6 } { ...props } flex={ 1 } flexRow>
      {[...Array(maxLength).keys()].map((_, index) => {
        const clue = letterClue(correctAnswer, text, index);
        const bg = revealed ? LETTER_COLORS[clue].bg : LETTER_COLORS.unknown.bg;
        const color = revealed ? LETTER_COLORS[clue].color : LETTER_COLORS.unknown.color;
        return (
          <Button
            key={ index }
            flex={ 1 }
            h1
            bg={ bg }
            color={ color }>
            {text[index]?.toUpperCase()}
          </Button>
        );
      })}
    </View>
  );
}

export type WordleGameProps = {
  word: string;
  maxGuesses?: number;
  maxLength?: number;
};

export function WordleGame({
  word,
  maxGuesses = 6,
  maxLength = word.length,
  ...props 
}: WordleGameProps) {

  const { screenHeight } = React.useContext(LayoutContext);
  
  const [guesses, setGuesses] = React.useState<string[]>([]);
  const [currentGuess, setCurrentGuess] = React.useState<string>('');
  const [keys, setKeys] = React.useState(DEFAULT_KEYS);
  
  return (
    <View { ...props } flex={ 1 }>
      <View m={ 64 } flex={ 1 }>
        <View gap={ 6 } flex={ 1 }>
          {[...Array(maxGuesses).keys()].map((_, index) => {
            const text = index < guesses.length ? guesses[index] : index === guesses.length ? currentGuess : '';
            return (
              <WordleRow
                key={ `${index}${text}` }
                revealed={ index < guesses.length }
                correctAnswer={ word }
                text={ text }
                maxLength={ maxLength } />
            );
          })}
        </View>
      </View>
      <OnscreenKeyboard
        keys={ keys }
        maxHeight={ screenHeight * 0.25 }
        py={ 24 }
        onKeyPress={ (key) => {
          if (key.value === 'enter') {
            if (currentGuess.length === maxLength) {
              setGuesses((prev) => [...prev, currentGuess]);
              setKeys((prev) => {
                const state = prev;
                alert(state);
                for (const [index, k] in currentGuess.split('').entries()) {
                  const clue = letterClue(correctAnswer, currentGuess, index);
                  for (const row in state) {
                    const key = row.find((r) => r.value === k);
                    if (!key) {
                      continue;
                    }
                    key.bg = LETTER_COLORS[clue].bg;
                    key.color = LETTER_COLORS[clue].color;
                  }
                }
                alert(JSON.stringify(state));
                return (prev = state);
              });
              setCurrentGuess('');
            }
          } else
          if (key.value === 'delete') {
            setCurrentGuess((prev) => {
              if (prev.length < 1) {
                return prev;
              }
              return (prev = prev.substring(0, prev.length - 1));
            });
          } else {
            setCurrentGuess((prev) => {
              if (prev.length + 1 > maxLength) {
                return prev;
              }
              return prev + key.value;
            });
          }
        } } />
    </View>
  );
}