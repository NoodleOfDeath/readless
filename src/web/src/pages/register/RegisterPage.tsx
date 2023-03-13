import React from 'react';
import { useForm } from 'react-hook-form';
import { Button, Stack, TextField, styled } from "@mui/material";

import API, { PartialRegistrationOptions } from '@/api';
import Page from '@/components/layout/Page';

const StyledStack = styled(Stack)`
  align-content: center;
  align-items: center;
`;

export default function RegisterPage() {
  const { register, handleSubmit } = useForm();

  const onSubmit = React.useCallback((data: PartialRegistrationOptions) => {
    API.register(data)
    .then((response) => {
      console.log(response);
    })
    .catch((error) => {
      console.log(error);
    });
  }, []);

  return (
    <Page title='Register'>
      <form onSubmit={handleSubmit(onSubmit)}>
        <StyledStack spacing={2}>
          <TextField {...register('email')} label='Email' />
          <TextField type="password" {...register('password')} label='Password' />
          <Button type='submit'>Register</Button>
        </StyledStack>
      </form>
    </Page>
  );
}
