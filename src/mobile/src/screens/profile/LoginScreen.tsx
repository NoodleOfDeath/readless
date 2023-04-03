import React from 'react';

import { LoginForm } from './LoginForm';

import { FlexView, SafeScrollView } from '~/components';

export function LoginScreen() {
  return (
    <SafeScrollView>
      <FlexView p={ 16 } col>
        <LoginForm />
      </FlexView>
    </SafeScrollView>
  );
}
