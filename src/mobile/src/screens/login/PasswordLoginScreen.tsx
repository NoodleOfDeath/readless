import React from 'react';

import { TextInput, View } from '~/components';

export function PasswordLoginScreen() {

  return (
    <View p={ 24 } gap={ 12 }>
      <TextInput
        placeholder='Email'
        keyboardType='email-address' />
      <TextInput
        placeholder='Password'
        secureTextEntry />
    </View>
  );
}