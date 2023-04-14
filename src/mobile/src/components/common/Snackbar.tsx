import React from 'react';

import { Snackbar as RNPSnackbar, SnackbarProps as RNPSnackbarProps } from 'react-native-paper';

import { useTheme } from '~/hooks';

export type SnackbarProps = RNPSnackbarProps;

export function Snackbar(props: SnackbarProps) {
  const theme = useTheme();
  return (
    <RNPSnackbar 
      { ...props }
      style={ [theme.components.dialog, props.style] } />
  );
}