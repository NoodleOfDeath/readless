import React from 'react';

import { FAB as PaperFAB, FABProps as PaperFABProps } from 'react-native-paper';

import { useTheme } from '~/hooks';

export type FABProps = PaperFABProps;

export function FAB({ ...props }: FABProps) {
  const theme = useTheme();
  return (
    <PaperFAB
      { ...props }
      style={ [theme.components.fab, props.style] } />
  );
}