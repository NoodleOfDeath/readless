import React from 'react';

import { mdiEmail } from '@mdi/js';
import { Icon } from '@mdi/react';
import {
  Button,
  Stack,
  TextField,
  Typography,
  styled,
} from '@mui/material';
import { useForm } from 'react-hook-form';

import API, { InternalError, PartialGenerateOTPRequest } from '~/api';
import { SessionContext } from '~/contexts';

type Props = {
  onSuccess?: () => void;
  backToLogin?: () => void;
};

const StyledStack = styled(Stack)(() => ({ alignItems: 'center' }));

const StyledIcon = styled(Icon)(({ theme }) => ({ marginRight: theme.spacing(1) }));

export default function ForgotPasswordForm({
  onSuccess,
  backToLogin,
}: Props) {
  const { register, handleSubmit } = useForm();
  const { withHeaders } = React.useContext(SessionContext);
  
  const [error, setError] = React.useState<InternalError | undefined>();
  
  const handleForgotPassword = React.useCallback(async (values: PartialGenerateOTPRequest) => {
    try {
      const { error } = await withHeaders(API.generateOtp)(values);
      if (error) {
        setError(error);
        return;
      }
      onSuccess?.();
    } catch (e) {
      console.error(e);
    }
  }, [onSuccess, withHeaders]);
  
  return (
    <form onSubmit={ handleSubmit(handleForgotPassword) }>
      <StyledStack spacing={ 2 }>
        <TextField
          InputProps={ { startAdornment: <StyledIcon path={ mdiEmail } size={ 1 } /> } }
          type="email"
          placeholder="Email"
          required
          { ...register('email') } />
        <Button type="submit" variant="contained">
          Send Password Reset Email
        </Button>
        {error && (
          <Typography variant='body2' color='error'>
            {error.message}
          </Typography>
        )}
        <Button onClick={ () => backToLogin?.() }>Back to Login</Button>
      </StyledStack>
    </form>
  );
  
}