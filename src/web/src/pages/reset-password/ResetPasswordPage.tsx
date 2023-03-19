import React from 'react';

import {
  Button,
  Stack,
  TextField,
  Typography,
  styled,
} from '@mui/material';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';

import API, { AuthError, PartialMutateAccountRequest } from '@/api';
import Page from '@/components/layout/Page';
import { SessionContext } from '@/contexts';

const StyledStack = styled(Stack)(() => ({ alignItems: 'center' }));

export default function ResetPasswordPage() {

  const navigate = useNavigate();
  const { handleSubmit, register } = useForm();
  const { userData } = React.useContext(SessionContext);

  const [error, setError] = React.useState<AuthError | null>(null);
  const [success, setSuccess] = React.useState(false);

  const onSubmit = React.useCallback(async (values: PartialMutateAccountRequest) => {
    if (!userData) {
      return;
    }
    try {
      const { error } = await API.updateAccount(values, { headers: { Authorization: `Bearer ${userData.jwt}` } });
      if (error) {
        setError(error);
        return;
      }
      setSuccess(true);
    } catch (e) {
      console.error(e);
    }
  }, [userData]);

  React.useEffect(() => {
    if (success) {
      setTimeout(() => {
        navigate('/login');
      }, 3_000);
    }
  }, [success, navigate]);

  return (
    <Page center title="Reset Password">
      <h1>Reset Password</h1>
      {!success ? (
        <form onSubmit={ handleSubmit(onSubmit) }>
          <StyledStack spacing={ 2 }>
            <TextField type="password" placeholder="New Password" required { ...register('password') } />
            <TextField type="password" placeholder="Confirm New Password" required { ...register('confirmPassword') } />
            <Button type="submit" variant="contained">
              Reset Password
            </Button>
            {error && (
              <Typography variant='body2' color='error'>
                {error.message}
              </Typography>
            )}
          </StyledStack>
        </form>
      ) : (
        <Typography variant='body2'>
          Your password has been reset. You will be redirected to the login page in 3 seconds or you can click the button below.
          <Button variant='contained' onClick={ () => navigate('/login') }>Back to Login</Button>
        </Typography>
      )}
    </Page>
  );
}