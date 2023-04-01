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

import LoginForm from './LoginForm';

type LoginDialogProps = DialogProps & {
  defaultAction?: 'logIn' | 'signUp';
  message?: string;
  onSuccessfulLogin?: () => void;
};

const StyledStack = styled(Stack)(() => ({ alignItems: 'center' }));

const StyledCloseButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.contrastText,
  position: 'fixed',
  right: theme.spacing(2),
  top: theme.spacing(2),
}));

export default function LoginDialog({
  defaultAction = 'logIn', message, onSuccessfulLogin, ...dialogProps
}: LoginDialogProps) {

  return (
    <Dialog
      { ...dialogProps }
      aria-labelledby="login-dialog-title"
      aria-describedby="login-dialog-description">
      <DialogTitle id="login-dialog-title">{defaultAction === 'logIn' ? 'Log In' : 'Sign Up'}</DialogTitle>
      <DialogContent>
        <StyledCloseButton onClick={ onSuccessfulLogin }>
          <Icon path={ mdiClose } size={ 1 } color="inherit" />
        </StyledCloseButton>
        <StyledStack spacing={ 2 }>
          {message && <Alert severity="info">{message}</Alert>}
          <LoginForm defaultAction={ defaultAction } onSuccessfulLogin={ onSuccessfulLogin } />
        </StyledStack>
      </DialogContent>
    </Dialog>
  );
}