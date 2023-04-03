import React from 'react';

import { Divider as RNDivider, DividerProps as RNDividerProps } from 'react-native-elements';

import { useTheme } from '~/hooks';

export type DividerProps = RNDividerProps & {
  horizontal?: boolean;
  vertical?: boolean;
};

export function Divider({
  horizontal,
  vertical = !horizontal,
  ...dividerProps
}: DividerProps = {}) {
  const theme = useTheme();
  return (
    <RNDivider { ...dividerProps } orientation={ vertical ? 'vertical' : 'horizontal' } style={ theme.components.divider } />
  );
}