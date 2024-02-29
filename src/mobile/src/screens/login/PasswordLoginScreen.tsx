import React from 'react';

import {
  ActivityIndicator,
  Button,
  Text,
  TextInput,
  View,
} from '~/components';
import { StorageContext, UserData } from '~/core';
import { useNavigation } from '~/hooks';
import { strings } from '~/locales';
import { ScreenComponent } from '~/screens/types';

export function PasswordLoginScreen({ route: _route }: ScreenComponent<'passwordLogin'>) {

  const { navigate, navigation } = useNavigation();
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
      if (loading) {
        return;
      }
      setLoading(true);
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
    } finally {
      setLoading(false);
    }
  }, [email, loading, login, password, setStoredValue, syncWithRemote]);

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
        onPress={ () => navigate('forgotPassword', { email }) }
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