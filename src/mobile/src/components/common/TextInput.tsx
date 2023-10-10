import React from 'react';
import {
  NativeSyntheticEvent,
  TextInput as RNTextInput,
  TextInputKeyPressEventData,
} from 'react-native';

import { TextInput as RNPTextInput, TextInputProps as RNTextInputProps } from 'react-native-paper';

import {
  ChildlessViewProps,
  TextProps,
  View,
} from '~/components';
import { useTheme } from '~/hooks';

export type NativeTextInput = RNTextInput;

export type TextInputProps = RNTextInputProps & TextProps & ChildlessViewProps & {
  flat?: boolean;
};

export type InputEvent = NativeSyntheticEvent<TextInputKeyPressEventData>;

export const TextInput = React.forwardRef(function TextInput(props: TextInputProps, ref: React.ForwardedRef<NativeTextInput>) {
  const theme = useTheme();
  return (
    <View borderRadius={ 500 } overflow='hidden' { ...props }>
      <RNPTextInput
        ref={ ref }
        dense
        { ...props }
        contentStyle={ [theme.components.input, props.color ? { color: props.color } : {} ] } />
    </View>
  );
}) as React.ForwardRefExoticComponent<TextInputProps & React.RefAttributes<NativeTextInput>>;