import React from 'react';

import { 
  Dialog,
  DialogProps,
  LoginForm,
  LoginFormProps,
} from '~/components';

export type LoginDialogProps = LoginFormProps & DialogProps;

export function LoginDialog({
  defaultAction = 'logIn',
  alert,
  onSuccess,
  ...dialogProps
}: LoginDialogProps) {
  return (
    <Dialog { ...dialogProps }>
      <LoginForm defaultAction={ defaultAction } alert={ alert } onSuccess={ onSuccess } />
    </Dialog>
  );
}