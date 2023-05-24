import React from 'react';
import { StyleSheet } from 'react-native';

import { Divider as RNDivider, DividerProps as RNDividerProps } from 'react-native-paper';

import { useTheme } from '~/hooks';

export type DividerProps = RNDividerProps & {
  vertical?: boolean;
};

export function Divider({ vertical, ...dividerProps }: DividerProps = {}) {
  const theme = useTheme();
  return (
    <RNDivider 
      { ...dividerProps }
      style={ [theme.components.divider, vertical ? { height: '100%', width: StyleSheet.hairlineWidth } : {}] } />
  );
}