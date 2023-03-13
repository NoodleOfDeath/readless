import React from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { Button, Stack, TextField, styled } from '@mui/material';

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

  const onSubmit = React.useCallback(
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
    <Page>
      <form onSubmit={handleSubmit(onSubmit)}>
        <StyledStack spacing={2}>
          <TextField
            label='Email'
            {...register('email')}
          />
          <TextField
            type="password"
            label='Password'
            {...register('password')}
          />
          <Button type='submit'>Login</Button>
        </StyledStack>
      </form>
    </Page>
  );
}
