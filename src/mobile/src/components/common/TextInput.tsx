import React from 'react';
import { NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';

import { TextInput as RNTextInput, TextInputProps as RNTextInputProps } from 'react-native-paper';

import { ChildlessViewProps, View } from '~/components';
import { useTheme } from '~/hooks';

export type TextInputProps = RNTextInputProps & ChildlessViewProps & {
  flat?: boolean;
};

export type InputEvent = NativeSyntheticEvent<TextInputKeyPressEventData>;

export function TextInput(props: TextInputProps) {
  const theme = useTheme();
  return (
    <View { ...props }>
      <RNTextInput
        dense
        { ...props }
        contentStyle={ [theme.components.input, props.color ? { color: props.color } : {} ] } />
    </View>
  );
}