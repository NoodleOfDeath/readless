import React from 'react';
import { NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';

import { IInputProps, Input } from 'native-base';

import { ChildlessViewProps, View } from '~/components';
import { useStyles, useTheme } from '~/hooks';

export type TextInputProps = IInputProps & ChildlessViewProps & {
  flat?: boolean;
};

export type InputEvent = NativeSyntheticEvent<TextInputKeyPressEventData>;

export function TextInput(props: TextInputProps) {
  const theme = useTheme();
  const style = useStyles(props);
  return (
    <View style={ style }>
      <Input
        { ...props } 
        style={ [theme.components.input, style.color ? { color: style.color } : {} ] } />
    </View>
  );
}