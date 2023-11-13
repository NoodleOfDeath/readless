import React from 'react';

import {
  Button,
  CircularProgress,
  Stack,
  TextField,
} from '@mui/material';

import Layout from '~/components/Layout';
import { StorageContext, UserData } from '~/contexts';
import { useRouter } from '~/hooks';

export default function VerifyPage() {

  const { 
    api: {
      verifyOtp, verifySubscription, updateCredential, 
    },
    userData,
    setStoredValue,
  } = React.useContext(StorageContext);
  const { searchParams } = useRouter();

  const [attemptedToVerify, setAttemptedToVerify] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState('Verifying...');

  const [password, setPassword] = React.useState('');
  const [repeatPassword, setRepeatPassword] = React.useState('');
  const [_resetSuccess, setResetSuccess] = React.useState(false);

  const validateToken = React.useCallback(async () => {
    if (loading || attemptedToVerify) {
      return;
    }
    setLoading(true);
    try {
      const otp = searchParams.get('otp');
      const code = searchParams.get('code');
      setStoredValue('colorScheme', 'dark');
      if (otp) {
        const { data, error } = await verifyOtp({ otp });
        if (error) {
          setMessage('Error, bad request');
          return;
        }
        if (data) {
          setStoredValue('userData', new UserData(data));
          setMessage('Please set a new password that is at least 8 characters long.');
        }
      } else
      if (code) {
        const { error } = await verifySubscription({ verificationCode: code });
        if (error) {
          setMessage('Error, bad request');
          return;
        }
        setMessage('Success! You are now subscribed!');
      } else {
        setMessage('Error, bad request');
      }
    } catch (e) {
      setMessage('Error, bad request');
    } finally {
      setLoading(false);
      setAttemptedToVerify(true);
    }
  }, [loading, searchParams, setStoredValue, attemptedToVerify, verifyOtp, verifySubscription]);

  const handlePasswordReset = React.useCallback(async () => {
    try {
      if (password !== repeatPassword) {
        setMessage('Passwords do not match');
        return;
      }
      const { error } = await updateCredential({ password });
      if (error) {
        throw error;
      }
      setMessage('Success! You may now login.');
      setResetSuccess(true);
    } catch (e) {
      setMessage('Error, bad request');
    } finally {
      setStoredValue('userData');
    }
  }, [password, repeatPassword, setStoredValue, updateCredential]);

  React.useEffect(() => {
    validateToken();
  }, [validateToken]);

  return (
    <Layout>
      <Stack spacing={ 2 }>
        <div>{message}</div>
        {loading && <CircularProgress variant='indeterminate' />}
      </Stack>
      {userData && (
        <Stack gap={ 2 }>
          <TextField
            value={ password }
            onChange={ (e) => setPassword(e.target.value) }
            placeholder="Password" 
            type='password' />
          <TextField
            value={ repeatPassword }
            onChange={ (e) => setRepeatPassword(e.target.value) }
            placeholder="Confirm Password"
            type='password' />
          <Button
            onClick={ handlePasswordReset }>
            Reset Password
          </Button>
        </Stack>
      )}
    </Layout>
  );
}