import React from 'react';

import { ScreenComponent } from '../types';

import {
  Button,
  Text,
  TextInput,
  View,
} from '~/components';
import { StorageContext, UserData } from '~/core';
import { strings } from '~/locales';

export function PasswordLoginScreen({
  route: _route,
  navigation, 
}: ScreenComponent<'passwordLogin'>) {

  const { setStoredValue, api: { login } } = React.useContext(StorageContext);

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [error, setError] = React.useState('');

  const handleLogin = React.useCallback(async () => {
    try {
      const { data: response, error } = await login({
        email,
        password,
      });
      if (error) {
        setError(error.message);
        return;
      }
      const userData = new UserData(response);
      setStoredValue('userData', userData);
    } catch (error) {
      console.error(error);
    }
  }, [email, login, password, setStoredValue]);
  
  return (
    <View p={ 24 } gap={ 12 }>
      <TextInput
        value={ email }
        onChangeText={ setEmail }
        placeholder={ strings.email }
        keyboardType='email-address' />
      <TextInput
        value={ password }
        onChangeText={ setPassword }
        placeholder={ strings.password }
        secureTextEntry />
      <Button
        onPress={ handleLogin }
        contained>
        {strings.login}
      </Button>
      {error && <Text textCenter>{ error }</Text>}
      <Button
        onPress={ () => navigation?.push('forgotPassword') }
        textCenter>
        {strings.forgotPassword}
      </Button>
    </View>
  );
}