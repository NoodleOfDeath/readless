import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Stack,
  TextField,
  styled,
  Typography,
  Link,
} from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';

import API, { AuthError, PartialLoginOptions, ThirdParty } from '@/api';
import { SessionContext } from '@/contexts';
import Page from '@/components/layout/Page';

const StyledStack = styled(Stack)`
  align-content: center;
  align-items: center;
`;

export default function LoginPage() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const { setUserData } = React.useContext(SessionContext);
  const [error, setError] = React.useState<AuthError | undefined>(undefined);

  const handleLogin = React.useCallback(
    (data: PartialLoginOptions) => {
      API.login(data)
        .then(({data, error}) => {
          if (error) {
            setError(error);
            return;
          }
          setUserData(data);
          navigate('/profile');
        })
        .catch((error) => {
          console.log(error);
        });
    },
    [navigate, setUserData],
  );

  return (
    <Page title='Login'>
      <StyledStack spacing={2}>
        <form onSubmit={handleSubmit(handleLogin)}>
          <StyledStack spacing={2}>
            <TextField
              label='Email'
              {...register('email')}
            />
            <TextField
              type='password'
              label='Password'
              {...register('password')}
            />
            {error && (
              <Typography variant='body2' color='error'>
                {error.message}
              </Typography>
            )}
            <Button type='submit'>Login</Button>
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                handleLogin({
                  thirdParty: {
                    name: ThirdParty.Google,
                    credential: credentialResponse.credential,
                  }
                });
              }}
              onError={() => {
                console.log('Login Failed');
              }}
              useOneTap
            />
          </StyledStack>
        </form>
        <StyledStack spacing={1}>
          <Typography variant='body2'>Don't have an account?</Typography>{' '}
          <Link href='/register'>Register Here</Link>
        </StyledStack>
      </StyledStack>
    </Page>
  );
}
