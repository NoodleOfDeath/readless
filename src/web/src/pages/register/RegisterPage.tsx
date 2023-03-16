import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import {
  Button,
  Link,
  Stack,
  TextField,
  styled,
  Typography,
} from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';

import API, { AuthError, PartialRegistrationOptions, ThirdParty } from '@/api';
import Page from '@/components/layout/Page';
import { SessionContext } from '@/contexts';

const StyledStack = styled(Stack)`
  align-content: center;
  align-items: center;
`;

export default function RegisterPage() {
  const navigate = useNavigate();
  const { register, handleSubmit } = useForm();
  const [error, setError] = React.useState<AuthError|undefined>();
  const { setUserData } = React.useContext(SessionContext);

  const handleRegistration = React.useCallback(
    (data: PartialRegistrationOptions) => {
      API.register(data)
        .then(({ data, error }) => {
          if (error) {
            setError(error);
            return;
          }
          if (data.jwt) {
            setUserData({
              userId: data.userId,
              jwt: data.jwt,
            });
            navigate('/profile')
          }
        })
        .catch((error) => {
          console.log(error);
        });
    },
    [ navigate, setUserData],
  );

  return (
    <Page title='Register'>
      <StyledStack spacing={2}>
        <form onSubmit={handleSubmit(handleRegistration)}>
          <StyledStack spacing={2}>
            <TextField
              {...register('email')}
              label='Email'
            />
            <TextField
              type='password'
              {...register('password')}
              label='Password'
            />
            {error && (
              <Typography variant='body2' color='error'>
                {error.message}
              </Typography>
            )}
            <Button type='submit'>Register</Button>
            <GoogleLogin
              onSuccess={(credentialResponse) => {
                handleRegistration({
                  thirdParty: {
                    name: ThirdParty.Google,
                    credential: credentialResponse.credential,
                  },
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
          <Typography variant='body2'>Already have an account?</Typography>
          <Link href='/login'>Login Here</Link>
        </StyledStack>
      </StyledStack>
    </Page>
  );
}
