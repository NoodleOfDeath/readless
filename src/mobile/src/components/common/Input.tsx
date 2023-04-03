import React from 'react';

import { Input as RNInput, InputProps as RNInputProps } from 'react-native-elements';

import { useTheme } from '~/hooks';

export type InputProps = RNInputProps;

export function Input(props: InputProps) {
  const theme = useTheme();
  return <RNInput {...props} style={ theme.components.input } />
}