import React from 'react';
import { NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';

import { TextInput as RNPTextInput, TextInputProps as RNPTextInputProps } from 'react-native-paper';

import { ChildlessViewProps, View } from '~/components';
import { useStyles, useTheme } from '~/hooks';

export type TextInputProps = RNPTextInputProps & ChildlessViewProps & {
  flat?: boolean;
};

export type InputEvent = NativeSyntheticEvent<TextInputKeyPressEventData>;

export function TextInput({
  flat,
  ...props
}: TextInputProps) {
  const theme = useTheme();
  const style = useStyles(props);
  return (
    <View style={ style }>
      <RNPTextInput
        mode={ flat ? 'flat' : 'outlined' }
        { ...props } 
        style={ [theme.components.input, style.color ? { color: style.color } : {} ] } />
    </View>
  );
}