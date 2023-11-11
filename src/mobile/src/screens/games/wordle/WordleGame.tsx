import React from 'react';
import { Animated } from 'react-native';

import {
  Button,
  ChildlessViewProps,
  DEFAULT_KEYS,
  OnscreenKeyboard,
  View,
  ViewProps,
} from '~/components';
import { LayoutContext } from '~/contexts';

type LetterClue = 'exact' | 'close' | 'wrong' | 'unknown';

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
} as const;

type LetterPalette = typeof LETTER_COLORS[LetterColor];

function exactMatches(answer: string, guess: string): number[] {
  const matches: number[] = [];
  [...answer].forEach((letter, index) => {
    if (index < guess.length && letter === guess[index]) {
      matches.push(index);
    }
  });
  return matches;
}

function charCount(str: string, letter: string, offset: number = str.length) {
  return str.substring(0, offset).split(letter).length - 1;
}

function letterClue(answer: string, guess: string, index: number): LetterClue {
  if (answer.length < index || guess.length < index) {
    return 'wrong';
  }
  answer = answer.toLowerCase();
  guess = guess.toLowerCase();
  const letter = guess[index];
  const correct = answer[index];
  if (letter === correct) {
    return 'exact';
  }
  const exactCount = exactMatches(answer, guess).length;
  const guessCount = charCount(guess, letter, index);
  const count = charCount(answer, letter);
  if (count - Math.min(guessCount, exactCount) > 0 && answer.includes(letter)) {
    return 'close';
  }
  return 'wrong';
}

type WordleLetterProps = ViewProps & {
  revealed?: boolean;
  duration?: number;
  delay?: number;
  clue?: LetterClue;
};

function WordleLetter({
  children,
  revealed,
  duration = 500,
  delay = 0,
  clue,
  ...props
}: WordleLetterProps = {}) {
  
  const animation = React.useRef(new Animated.Value(0)).current;
  const [colors, setColors] = React.useState<LetterPalette>(LETTER_COLORS.unknown);
  
  React.useEffect(() => {
    if (revealed) {
      setTimeout(() => {
        Animated.timing(animation, {
          duration,
          toValue: 1,
          useNativeDriver: true,
        }).start();
      }, delay);
      setTimeout(() => setColors(revealed ? LETTER_COLORS[clue] : LETTER_COLORS.unknown), delay + (duration * 0.75));
    }
  }, [revealed, delay, duration, animation, clue]);
  
  return (
    <Animated.View
      flex={ 1 }
      style={ {
        transform: [{ 
          rotateX: animation.interpolate({
            inputRange: [0, 1],
            outputRange: ['0deg', '360deg'],
          }),
        }],
      } }>
      <Button
        h1
        flex={ 1 }
        { ...colors }>
        {children}
      </Button>
    </Animated.View>
  );
  
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
        return (
          <WordleLetter
            key={ index }
            revealed={ revealed }
            delay={ index * 500 }
            clue={ clue }>
            {text[index]?.toUpperCase()}
          </WordleLetter>
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