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

export function SetNewPasswordScreen({
  route: _route,
  navigation, 
}: ScreenComponent<'setNewPassword'>) {

  const { 
    api: { updateCredential }, 
    setStoredValue,
  } = React.useContext(StorageContext);

  const [success, setSuccess] = React.useState(false);
  const [newPassword, setNewPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [message, setMessage] = React.useState('');

  const handlePasswordReset = React.useCallback(async () => {
    try {
      if (newPassword !== confirmPassword) {
        setMessage(strings.passwordsDoNotMatch);
        return;
      }
      const { data, error } = await updateCredential({ newPassword });
      if (error) {
        setMessage(error.message);
        return;
      }
      if (data.success) {
        setSuccess(true);
        setMessage(strings.successYouMayNowLogin);
        setStoredValue('userData');
      }
    } catch (error) {
      console.error(error);
    }
  }, [confirmPassword, newPassword, setStoredValue, updateCredential]);
  
  return (
    <View p={ 24 } gap={ 12 }>
      {!success && (
        <React.Fragment>
          <TextInput
            value={ newPassword }
            onChangeText={ setNewPassword }
            placeholder={ strings.password }
            secureTextEntry />
          <TextInput
            value={ confirmPassword }
            onChangeText={ setConfirmPassword }
            placeholder={ strings.confirmPassword }
            secureTextEntry />
          <Button
            onPress={ handlePasswordReset }
            contained>
            {strings.resetPassword}
          </Button>
        </React.Fragment>
      )}
      {message && <Text textCenter>{ message }</Text>}
      {success && (<Button onPress={ () => navigation?.replace('passwordLogin', {}) } contained>{strings.login}</Button>)}
    </View>
  );
}