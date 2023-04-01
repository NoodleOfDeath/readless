import React from 'react';

import { mdiClose } from '@mdi/js';
import { Icon } from '@mdi/react';
import {
  Alert,
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  IconButton,
  Stack,
  styled,
} from '@mui/material';

import LoginForm, { LoginFormProps } from './LoginForm';

export const LOGIN_ALERTS = {
  LOGGED_IN: 'You are already logged in.',
  LOGGED_OUT: 'You have been logged out.',
  PLEASE_LOG_IN: 'Please log in to continue.',
} as const;

type LoginDialogProps = DialogProps & LoginFormProps & {
  alert?: keyof typeof LOGIN_ALERTS;
  message?: string;
};

const StyledStack = styled(Stack)(() => ({ alignItems: 'center' }));

const StyledCloseButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  position: 'fixed',
  right: theme.spacing(2),
  top: theme.spacing(2),
}));

export default function LoginDialog({
  defaultAction = 'logIn', 
  alert, 
  message = alert ? LOGIN_ALERTS[alert] : undefined,
  onSuccess,
  deferredAction,
  ...dialogProps
}: LoginDialogProps) {

  const handleSuccess = React.useCallback(() => {
    onSuccess?.();
    deferredAction?.();
  }, [deferredAction, onSuccess]);

  return (
    <Dialog
      { ...dialogProps }
      aria-labelledby="login-dialog-title"
      aria-describedby="login-dialog-description">
      <DialogTitle id="login-dialog-title">{defaultAction === 'logIn' ? 'Log In' : 'Sign Up'}</DialogTitle>
      <DialogContent>
        <StyledCloseButton onClick={ handleSuccess }>
          <Icon path={ mdiClose } size={ 1 } color="inherit" />
        </StyledCloseButton>
        <StyledStack spacing={ 2 }>
          {message && <Alert severity="info">{message}</Alert>}
          <LoginForm defaultAction={ defaultAction } onSuccess={ handleSuccess } />
        </StyledStack>
      </DialogContent>
    </Dialog>
  );
}