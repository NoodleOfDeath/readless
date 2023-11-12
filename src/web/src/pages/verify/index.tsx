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
    colorScheme,
    userData,
    setStoredValue,
  } = React.useContext(StorageContext);
  const { searchParams } = useRouter();

  const [loading, setLoading] = React.useState<boolean>(true);
  const [message, setMessage] = React.useState('Verifying...');

  const [password, setPassword] = React.useState('');
  const [repeatPassword, setRepeatPassword] = React.useState('');

  const validateToken = React.useCallback(async () => {
    try {
      const otp = searchParams.get('otp');
      const code = searchParams.get('code');
      setStoredValue('colorScheme', 'dark');
      if (otp) {
        const { data, error } = await verifyOtp({ otp });
        if (error) {
          setMessage(error.message);
          return;
        }
        if (data) {
          setStoredValue('userData', new UserData(data));
        }
      } else
      if (code) {
        const { error } = await verifySubscription({ verificationCode: code });
        if (error) {
          setMessage(error.message);
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
    }
  }, [searchParams, setStoredValue, verifyOtp, verifySubscription]);

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
    } catch (e) {
      setMessage('Error, bad request');
    }
  }, [password, repeatPassword, updateCredential]);

  React.useEffect(() => {
    validateToken();
  }, [validateToken]);

  return (
    <Layout>
      {`fuck ${colorScheme}`}
      <Stack spacing={ 2 }>
        <div>{message}</div>
        {loading && <CircularProgress variant='indeterminate' />}
      </Stack>
      {userData && (
        <Stack>
          <TextField
            value={ password }
            onChange={ (e) => setPassword(e.target.value) }
            placeholder="Password" />
          <TextField
            value={ repeatPassword }
            onChange={ (e) => setRepeatPassword(e.target.value) }
            placeholder="Confirm Password" />
          <Button
            onClick={ handlePasswordReset }>
            Reset Password
          </Button>
        </Stack>
      )}
    </Layout>
  );
}