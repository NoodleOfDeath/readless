import React from 'react';
import { StyleSheet } from 'react-native';

import { IDividerProps, Divider as RNDivider } from 'native-base';

import { ViewProps } from '~/components';
import { useStyles, useTheme } from '~/hooks';

export type DividerProps = IDividerProps & ViewProps & {
  vertical?: boolean;
};

export function Divider({ vertical, ...dividerProps }: DividerProps = {}) {
  const theme = useTheme();
  const style = useStyles(dividerProps);
  return (
    <RNDivider 
      { ...dividerProps }
      style={ {
        ...theme.components.divider, 
        height: vertical ? '100%' : StyleSheet.hairlineWidth, 
        width: vertical ? StyleSheet.hairlineWidth : '100%', 
        ...style, 
      } } />
  );
}