import React from 'react';

import { ScreenComponent } from '../types';

import {
  ActivityIndicator,
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

  const { 
    api: { login }, 
    setStoredValue, 
    syncWithRemote,
  } = React.useContext(StorageContext);

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [message, setMessage] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const handleLogin = React.useCallback(async () => {
    try {
      const { data: response, error } = await login({
        email,
        password,
      });
      if (error) {
        setMessage(error.message);
        return;
      }
      const userData = new UserData(response);
      setStoredValue('userData', userData);
      syncWithRemote(userData);
    } catch (error) {
      console.error(error);
    }
  }, [email, login, password, setStoredValue, syncWithRemote]);

  React.useEffect(() => setMessage(''), [email, password]);
  
  return (
    <View p={ 24 } gap={ 12 }>
      {!loading && (
        <React.Fragment>
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
            disabled={ !email.trim() || !password.trim() }
            onPress={ handleLogin }
            contained>
            {strings.login}
          </Button>
        </React.Fragment>
      )}
      {loading && <ActivityIndicator animating />}
      {message && <Text textCenter>{ message }</Text>}
      <Button
        onPress={ () => navigation?.push('forgotPassword', { email }) }
        textCenter>
        {strings.forgotPassword}
      </Button>
      <Button
        onPress={ () => navigation?.replace('register', { email }) }>
        {strings.dontHaveAnAccount}
      </Button>
    </View>
  );
}