import React from 'react';

import { ScreenComponent } from '../types';

import {
  Button,
  Text,
  TextInput,
  View,
} from '~/components';
import { StorageContext } from '~/core';
import { strings } from '~/locales';
import { validateEmail, validatePassword } from '~/utils';

export function RegisterScreen({
  route, 
  navigation,
}: ScreenComponent<'register'>) {

  const { api: { register } } = React.useContext(StorageContext);

  const [success, setSuccess] = React.useState(false);
  const [email, setEmail] = React.useState(route?.params?.email ?? '');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [message, setMessage] = React.useState('');

  React.useEffect(() => setMessage(''), [email, password, confirmPassword]);

  const handleRegister = React.useCallback(async () => {
    try {
      if (!validateEmail(email)) {
        setMessage(strings.pleaseEnterValidEmail);
        return;
      }
      if (password !== confirmPassword) {
        setMessage(strings.passwordsDoNotMatch);
        return;
      }
      const result = validatePassword(password);
      if (result.error) {
        setMessage(result.error);
        return;
      }
      const { error } = await register({
        email,
        password,
      });
      if (error) {
        setMessage(error.message);
        return;
      }
      setSuccess(true);
      setMessage(strings.verifyYourEmailToContinue);
    } catch (error) {
      console.error(error);
      setMessage(strings.anUnknownErrorOccurred);
    }
  }, [confirmPassword, email, password, register]);

  return (
    <View
      flex={ 1 }
      p={ 24 }
      gap={ 12 }>
      {!success && (
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
          <TextInput
            value={ confirmPassword }
            onChangeText={ setConfirmPassword }
            placeholder={ strings.confirmPassword }
            secureTextEntry />
          <Button
            contained
            disabled={ !email.trim() || !password.trim() || !confirmPassword.trim() }
            onPress={ handleRegister }>
            {strings.register}
          </Button>
        </React.Fragment>
      )}
      {message && <Text textCenter>{message}</Text>}
      <Button
        onPress={ () => navigation?.replace('passwordLogin', { email }) }>
        {strings.alreadyHaveAnAccount}
      </Button>
    </View>
  );
}