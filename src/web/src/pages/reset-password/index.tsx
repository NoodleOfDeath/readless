import React from 'react';

import {
  Button,
  Stack,
  TextField,
  Typography,
  styled,
} from '@mui/material';
import { useForm } from 'react-hook-form';

import { InternalError, PartialUpdateCredentialRequest } from '~/api';
import Page from '~/components/layout/Page';
import { useLoginClient, useRouter } from '~/hooks';

const StyledStack = styled(Stack)(() => ({ alignItems: 'center' }));

export default function ResetPasswordPage() {

  const router = useRouter();
  const { handleSubmit, register } = useForm();
  const { updateCredential, logOut } = useLoginClient();

  const [formError, setFormError] = React.useState<InternalError | string>();
  const [success, setSuccess] = React.useState(false);

  const onSubmit = React.useCallback(async (values: PartialUpdateCredentialRequest) => {
    const { error } = await updateCredential(values);
    if (error) {
      setFormError(error);
      return;
    }
    setSuccess(true);
  }, [updateCredential]);

  React.useEffect(() => {
    if (success) {
      setTimeout(() => {
        logOut();
        router.push('/login');
      }, 5_000);
    }
  }, [router, success, logOut]);

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
            {formError && (
              <Typography variant='body2' color='error'>
                {typeof formError === 'string' ? formError : formError.message}
              </Typography>
            )}
          </StyledStack>
        </form>
      ) : (
        <StyledStack>
          <Typography variant='body2'>
            Your password has been reset. You will be redirected to the login page in 5 seconds or you can click the button below.
          </Typography>
          <Button variant='contained' onClick={ () => router.push('/login') }>Back to Login</Button>
        </StyledStack>
      )}
    </Page>
  );
}