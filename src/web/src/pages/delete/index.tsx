import React from 'react';

import {
  Button,
  CircularProgress,
  Stack,
} from '@mui/material';

import { AuthError } from '~/api';
import Layout from '~/components/Layout';
import { StorageContext, UserData } from '~/contexts';
import { useRouter } from '~/hooks';

export default function VerifyPage() {

  const { 
    api: {
      verifyOtp,
      deleteAccount,
    },
    userData,
    setStoredValue,
  } = React.useContext(StorageContext);
  const { searchParams } = useRouter();

  const [attemptedToVerify, setAttemptedToVerify] = React.useState<boolean>(false);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<boolean>(false);
  const [message, setMessage] = React.useState('Verifying...');

  const [_success, setSuccess] = React.useState(false);

  const validateToken = React.useCallback(async () => {
    if (loading || attemptedToVerify) {
      return;
    }
    setLoading(true);
    try {
      const otp = searchParams.get('otp');
      if (otp) {
        const { data, error } = await verifyOtp({ deleteAccount: true, otp });
        if (error) {
          setMessage((error as AuthError).errorKey ?? 'Error, bad request');
          setError(true);
          return;
        }
        if (data) {
          setStoredValue('userData', new UserData(data));
          setMessage('Are you sure you want to delete your account? This is not reversable.');
        }
      } else {
        setMessage('Missing token');
        setError(true);
      }
    } catch (e) {
      setMessage((e as AuthError).errorKey ?? 'Error, bad request');
      setError(true);
    } finally {
      setLoading(false);
      setAttemptedToVerify(true);
    }
  }, [loading, attemptedToVerify, searchParams, setStoredValue, verifyOtp]);

  const handleAccountDeletion = React.useCallback(async () => {
    try {
      setLoading(true);
      await deleteAccount({});
      setMessage('Your account has been deleted');
      setSuccess(true);
    } catch (e) {
      setMessage('Error, bad request');
      setError(true);
    } finally {
      setStoredValue('userData', undefined, false);
      setLoading(false);
    }
  }, [setStoredValue, deleteAccount]);

  React.useEffect(() => {
    validateToken();
  }, [validateToken]);

  return (
    <Layout>
      <Stack spacing={ 2 }>
        <div>{message}</div>
        {loading && <CircularProgress variant='indeterminate' />}
      </Stack>
      {userData && !error && !loading && (
        <Stack gap={ 2 }>
          <Button
            onClick={ handleAccountDeletion }>
            Delete My Account Permanently
          </Button>
        </Stack>
      )}
    </Layout>
  );
}