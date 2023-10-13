import React from 'react';

import {
  Button,
  ChildlessViewProps,
  View,
} from '~/components';
import { Icon } from '~/components/common/Icon';
import { useTheme } from '~/hooks';

type Key = {
  value: string;
  label?: React.ReactNode;
  bg?: string;
};

export const DEFAULT_KEYS: Key[][] = [
  'qwertyuiop'.split('').map((k) => ({ label: k.toUpperCase(), value: k })),
  'asdfghjkl'.split('').map((k) => ({ label: k.toUpperCase(), value: k })),
  '#zxcvbnm$'.split('').map((k) => k === '#' ? ({ label: 'ENTER', value: 'enter' }) : k === '$' ? ({ label: <Icon name="backspace-outline" />, value: 'delete' }) : ({ label: k.toUpperCase(), value: k })),
];

type KeyboardRowProps = ChildlessViewProps & {
  keys: Key[];
  onKeyPress?: (key: Key) => void,
};

function KeyboardRow({ 
  keys, 
  onKeyPress, 
  ...props
}: KeyboardRowProps) {
  
  const theme = useTheme();
  
  return (
    <View 
      flexRow
      itemsCenter
      justifyCenter
      flex={ 1 }
      gap={ 4 }
      { ...props }>
      {keys.map((key, index) => (
        <Button 
          h6
          haptic
          beveled
          key={ key.value }
          p={ 12 }
          bg={ theme.colors.paper }
          onPress={ () => onKeyPress?.(key) }>
          {key.label ?? key.value}
        </Button>
      ))}
    </View>
  );
}

export type OnscreenKeyboardProps = ChildlessViewProps & {
  keys?: Key[][];
  onKeyPress?: (key: Key) => void;
};

export function OnscreenKeyboard({ 
  keys = DEFAULT_KEYS, 
  onKeyPress,
  ...props
}: OnscreenKeyboardProps ) {
  return (
    <View 
      flex={ 1 }
      itemsCenter
      justifyCenter
      { ...props }>
      {keys.map((row, index) => (
        <KeyboardRow 
          key={ index } 
          keys={ row }
          onKeyPress={ onKeyPress } />
      ))}
    </View>
  );
}