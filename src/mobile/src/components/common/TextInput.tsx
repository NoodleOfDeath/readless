import React from 'react';
import { NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';

import { Input, InputProps } from '@rneui/base';

import { View, ViewProps } from '~/components';
import { useStyles, useTheme } from '~/hooks';

export type TextInputProps = InputProps & ViewProps & {
  label?: string;
};
export type InputEvent = NativeSyntheticEvent<TextInputKeyPressEventData>;

export function TextInput(props: TextInputProps) {
  const theme = useTheme();
  const style = useStyles(props);
  return (
    <View style={ style }>
      <Input { ...props } style={ [theme.components.input, style.color ? { color: style.color } : {} ] } />
    </View>
  );
}