import React from 'react';
import { StyleSheet } from 'react-native';

import { Divider as RNDivider, DividerProps as RNDividerProps } from 'react-native-paper';

import { ChildlessViewProps, View } from '~/components';
import { useTheme } from '~/hooks';

export type DividerProps = RNDividerProps & ChildlessViewProps & {
  vertical?: boolean;
};

export function Divider({ vertical, ...props }: DividerProps = {}) {
  const theme = useTheme();
  return (
    <View { ...props }>
      <RNDivider 
        { ...props }
        style={ {
          ...theme.components.divider, 
          height: vertical ? '100%' : StyleSheet.hairlineWidth, 
          width: vertical ? StyleSheet.hairlineWidth : '100%', 
        } } />
    </View>
  );
}