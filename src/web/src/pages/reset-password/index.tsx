import React from 'react';

import {
  Button,
  Stack,
  TextField,
  Typography,
  styled,
} from '@mui/material';
import { useForm } from 'react-hook-form';

import API, { InternalError } from '~/api';
import Page from '~/components/layout/Page';
import { SessionContext } from '~/contexts';
import { useRouter } from '~/next/router';

const StyledStack = styled(Stack)(() => ({ alignItems: 'center' }));

export default function ResetPasswordPage() {

  const router = useRouter();
  const { handleSubmit, register } = useForm();
  const {
    userData, setUserData, withHeaders, 
  } = React.useContext(SessionContext);

  const [error, setError] = React.useState<InternalError | null>(null);
  const [success, setSuccess] = React.useState(false);

  const onSubmit = React.useCallback(async (values: { password?: string }) => {
    if (!userData || !values.password) {
      return;
    }
    withHeaders(API.updateCredential)(values)
      .then(({ error }) => {
        if (error) {
          setError(error);
          return;
        }
        setSuccess(true);
      })
      .catch((e) => {
        console.error(e);
      });
  }, [userData, withHeaders]);

  React.useEffect(() => {
    if (success) {
      setTimeout(() => {
        setUserData();
        router.push('/login');
      }, 3_000);
    }
  }, [router, success, setUserData]);

  return (
    <Page center title="Reset Password">
      <h1>Reset Password</h1>
      {!success ? (
        <form onSubmit={ handleSubmit(onSubmit) }>
          <StyledStack spacing={ 2 }>
            <TextField
              type="password"
              placeholder="New Password"
              required
              { ...register('password', {
                required: true, 
                validate: (value) => value.length >= 8 || 'Password must be at least 8 characters', 
              }) } />
            <TextField
              type="password"
              placeholder="Confirm New Password"
              required
              { ...register('confirmPassword', { validate: (value, formState) => value === formState.password || 'Passwords do not match' }) } />
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
          <Button variant='contained' onClick={ () => router.push('/login') }>Back to Login</Button>
        </Typography>
      )}
    </Page>
  );
}