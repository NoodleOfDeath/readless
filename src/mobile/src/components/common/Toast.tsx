import React from 'react';

import { Snackbar, SnackbarProps } from 'react-native-paper';

import { ViewProps } from '~/components';
import { useStyles, useTheme } from '~/hooks';

export type ToastProps = Omit<SnackbarProps & ViewProps, 'children' | 'onDismiss' | 'visible'> & {
  id: string;
  createdAt: Date;
  visible?: boolean;
  children?: React.ReactNode;
  onDismiss?: () => void;
};

export function Toast({
  visible = true,
  children, 
  onDismiss = () => Promise.resolve(),
  duration = Snackbar.DURATION_SHORT,
  ...props
}: ToastProps) {

  const theme = useTheme();
  const style = useStyles({ ...theme.components.card, ...props });

  return (
    <Snackbar
      style={ style }
      visible={ visible }
      duration={ duration }
      onDismiss={ onDismiss }
      { ...props }>
      {children}
    </Snackbar>
  );
}