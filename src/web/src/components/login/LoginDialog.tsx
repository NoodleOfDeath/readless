import React from 'react';

import {
  Alert,
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  Stack,
  styled,
} from '@mui/material';

import LoginForm from './LoginForm';

type LoginDialogProps = DialogProps & {
  defaultAction?: 'logIn' | 'signUp';
  message?: string;
};

const StyledStack = styled(Stack)(() => ({ alignItems: 'center' }));

export default function LoginDialog({
  defaultAction = 'logIn', message, ...dialogProps 
}: LoginDialogProps) {

  return (
    <Dialog
      { ...dialogProps }
      aria-labelledby="login-dialog-title"
      aria-describedby="login-dialog-description">
      <DialogTitle id="login-dialog-title">{defaultAction === 'logIn' ? 'Log In' : 'Sign Up'}</DialogTitle>
      <DialogContent>
        <StyledStack spacing={ 2 }>
          {message && <Alert severity="info">{message}</Alert>}
          <LoginForm defaultAction={ defaultAction } />
        </StyledStack>
      </DialogContent>
    </Dialog>
  );
}