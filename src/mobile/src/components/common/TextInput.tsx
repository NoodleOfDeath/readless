import React from 'react';
import { NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';

import { TextInput as RNPTextInput, TextInputProps as RNPTextInputProps } from 'react-native-paper';

import { View, ViewProps } from '~/components';
import { useStyles, useTheme } from '~/hooks';

export type TextInputProps = RNPTextInputProps & ViewProps;

export type InputEvent = NativeSyntheticEvent<TextInputKeyPressEventData>;

export function TextInput(props: TextInputProps) {
  const theme = useTheme();
  const style = useStyles(props);
  return (
    <View style={ style }>
      <RNPTextInput
        mode='outlined'
        { ...props } 
        style={ [theme.components.input, style.color ? { color: style.color } : {} ] } />
    </View>
  );
}