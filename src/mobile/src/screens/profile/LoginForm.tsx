import React from 'react';

import { Input } from 'react-native-elements';

import { Button, FlexView } from '~/components';
import { useLoginClient } from '~/hooks';

export function LoginForm() {

  const { handleLogIn } = useLoginClient();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleLogInPress = React.useCallback(() => {
    handleLogIn({
      email,
      password,
    });
  }, [email, handleLogIn, password]);
  
  return (
    <FlexView p={ 16 } col>
      <Input label="Email" value={ email } onChange={ (e) => setEmail(e.nativeEvent.text) } />
      <Input label="Password" secureTextEntry value={ password } onChange={ (e) => setPassword(e.nativeEvent.text) } />
      <Button onPress={ () => handleLogInPress() }>Log In</Button>
    </FlexView>
  );
}