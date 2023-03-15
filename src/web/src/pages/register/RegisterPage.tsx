import React from 'react';
import { useForm } from 'react-hook-form';
import {
  Button,
  Link,
  Stack,
  TextField,
  styled,
  Typography,
} from '@mui/material';
import { GoogleLogin } from '@react-oauth/google';

import API, { PartialRegistrationOptions, ThirdParty } from '@/api';
import Page from '@/components/layout/Page';

const StyledStack = styled(Stack)`
  align-content: center;
  align-items: center;
`;

export default function RegisterPage() {
  const { register, handleSubmit } = useForm();

  const handleRegistration = React.useCallback(
    (data: PartialRegistrationOptions) => {
      API.register(data)
        .then((response) => {
          console.log(response);
        })
        .catch((error) => {
          console.log(error);
        });
    },
    [],
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
