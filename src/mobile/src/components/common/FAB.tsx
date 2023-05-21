import React from 'react';

import { FAB as PaperFAB, FABProps as PaperFABProps } from 'react-native-paper';

import { ViewProps } from '~/components';
import { useStyles } from '~/hooks';

export type FABProps = PaperFABProps & Omit<ViewProps, 'children'>;

export function FAB({ ...props }: FABProps) {
  const style = useStyles(props);
  return (
    <PaperFAB
      { ...props }
      style={ style } />
  );
}