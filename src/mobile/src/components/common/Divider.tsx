import React from 'react';
import { StyleSheet } from 'react-native';

import { Divider as RNDivider, DividerProps as RNDividerProps } from 'react-native-paper';

import { ChildlessViewProps } from '~/components';
import { useStyles, useTheme } from '~/hooks';

export type DividerProps = ChildlessViewProps & RNDividerProps & {
  vertical?: boolean;
};

export function Divider({ vertical, ...props }: DividerProps = {}) {
  const theme = useTheme();
  const style = useStyles({ ...theme.components.divider, ...props });
  return (
    <RNDivider 
      style={ {
        ...style,
        height: vertical ? '100%' : StyleSheet.hairlineWidth, 
        width: vertical ? StyleSheet.hairlineWidth : '100%', 
      } }
      { ...props } />
  );
}