import React from 'react';

import { Divider as RNDivider, DividerProps as RNDividerProps } from 'react-native-paper';

import { useTheme } from '~/hooks';

export type DividerProps = RNDividerProps;

export function Divider({ ...dividerProps }: DividerProps = {}) {
  const theme = useTheme();
  return (
    <RNDivider { ...dividerProps } style={ theme.components.divider } />
  );
}