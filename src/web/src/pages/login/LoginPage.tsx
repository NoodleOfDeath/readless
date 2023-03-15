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

import API, { PartialLoginOptions } from '@/api';
import { SessionContext } from '@/contexts';
import Page from '@/components/layout/Page';

const StyledStack = styled(Stack)`
  align-content: center;
  align-items: center;
`;

export default function LoginPage() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();
  const { setUserData } = React.useContext(SessionContext);

  const handleLogin = React.useCallback(
    (data: PartialLoginOptions) => {
      API.login(data)
        .then((response) => {
          setUserData(response.data);
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
            <Button type='submit'>Login</Button>
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                handleLogin({
                  thirdParty: {
                    name: 'google',
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
