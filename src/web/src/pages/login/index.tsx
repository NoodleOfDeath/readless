import React from 'react';

import Page from '../../components/layout/Page';

import LoginForm, { LoginFormProps } from '~/components/login/LoginForm';

type Props = LoginFormProps;

export default function LoginPage({ defaultAction = 'logIn' }: Props = {}) {
  return (
    <Page title="Log In">
      <LoginForm defaultAction={ defaultAction } />
    </Page>
  );
}
