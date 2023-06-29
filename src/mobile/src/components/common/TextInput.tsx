import React from 'react';
import { NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';

import { TextInput as RNTextInput, TextInputProps as RNTextInputProps } from 'react-native-paper';

import {
  ChildlessViewProps,
  TextProps,
  View,
} from '~/components';
import { useTheme } from '~/hooks';

export type TextInputProps = RNTextInputProps & TextProps & ChildlessViewProps & {
  flat?: boolean;
};

export type InputEvent = NativeSyntheticEvent<TextInputKeyPressEventData>;

export function TextInput(props: TextInputProps) {
  const theme = useTheme();
  return (
    <View borderRadius={ 500 } overflow='hidden' { ...props }>
      <RNTextInput
        dense
        { ...props }
        contentStyle={ [theme.components.input, props.color ? { color: props.color } : {} ] } />
    </View>
  );
}