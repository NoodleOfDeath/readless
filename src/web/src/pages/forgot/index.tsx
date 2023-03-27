import React from 'react';

import {
  Button,
  Stack,
  TextField,
  Typography,
  styled,
} from '@mui/material';
import { useForm } from 'react-hook-form';

import API, { InternalError, PartialGenerateOTPRequest } from '@/api';
import Page from '@/components/layout/Page';
import { useRouter } from '@/next/router';

const StyledStack = styled(Stack)(() => ({ alignItems: 'center' }));

export default function ForgotPage() {

  const router = useRouter();
  const { handleSubmit, register } = useForm();

  const [error, setError] = React.useState<InternalError | null>(null);
  const [success, setSuccess] = React.useState(false);

  const onSubmit = React.useCallback(async (values: PartialGenerateOTPRequest) => {
    try {
      const { error } = await API.generateOtp(values);
      if (error) {
        setError(error);
        return;
      }
      setSuccess(true);
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <Page center title="Forgot Password">
      <h1>Forgot Password</h1>
      {!success ? (
        <form onSubmit={ handleSubmit(onSubmit) }>
          <StyledStack spacing={ 2 }>
            <TextField type="email" placeholder="Email" required { ...register('email') } />
            <Button type="submit" variant="contained">
              Send Password Reset Email
            </Button>
            {error && (
              <Typography variant='body2' color='error'>
                {error.message}
              </Typography>
            )}
            <Button onClick={ () => router.push('/login') }>Back to Login</Button>
          </StyledStack>
        </form>
      )
        : (
          <StyledStack spacing={ 2 }>
            <Typography variant='body2'>
              If an account with that email exists, you should receive an email shortly with a link to reset your password.
            </Typography>
            <Button onClick={ () => router.push('/login') }>Back to Login</Button>
          </StyledStack>
        )}
    </Page>
  );
}