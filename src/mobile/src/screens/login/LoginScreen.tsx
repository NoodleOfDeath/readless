import React from 'react';

import {
  LoginForm,
  SafeScrollView,
  View,
} from '~/components';

export function LoginScreen() {
  return (
    <SafeScrollView>
      <View p={ 16 } col>
        <LoginForm />
      </View>
    </SafeScrollView>
  );
}
