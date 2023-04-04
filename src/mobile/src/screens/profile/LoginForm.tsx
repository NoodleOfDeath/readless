import React from 'react';

import { InternalError } from '~/api';
import {
  Button,
  FlexView,
  Input,
  Text,
} from '~/components';
import { useLoginClient } from '~/hooks';

type Props = {
  action: 'logIn' | 'signUp' | 'forgotPassword';
};

export function LoginForm({ action = 'logIn' }: Partial<Props>) {

  const { handleLogIn, handleSignUp } = useLoginClient();

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  const [error, setError] = React.useState<InternalError | undefined>();

  const handleLogInPress = React.useCallback(async () => {
    try {
      const { error } = await handleLogIn({
        email,
        password,
      });
      console.log('shit');
      if (error) {
        console.log('fuck');
        setError(error);
      }
    } catch (e) {
      console.log(e);
    }
  }, [email, handleLogIn, password]);

  const handleSignUpPress = React.useCallback(async () => {
    try {
      const { error } = await handleSignUp({
        email,
        password,
      });
      if (error) {
        setError(error);
      }
    } catch (e) {
      console.log(e);
    }
  }, [email, handleSignUp, password]);
  
  return (
    <FlexView p={ 16 } col>
      <FlexView pb={ 32 }><Text center variant="title1">{action === 'logIn' ? 'Log In' : 'Sign Up'}</Text></FlexView>
      <Input 
        label="Email"
        value={ email } 
        onChange={ (e) => setEmail(e.nativeEvent.text) } />
      <Input 
        label="Password"
        secureTextEntry
        value={ password }
        onChange={ (e) => setPassword(e.nativeEvent.text) } />
      {action === 'signUp' && (
        <Input 
          label="Confirm Password"
          secureTextEntry
          value={ confirmPassword }
          onChange={ (e) => setConfirmPassword(e.nativeEvent.text) } />
      )}
      <FlexView row center>
        {action === 'logIn' && (
          <Button
            onPress={ () => handleLogInPress() }>
            Log In
          </Button>
        )}
        {action === 'signUp' && (
          <Button
            onPress={ () => handleSignUpPress() }>
            Sign Up
          </Button>
        )}
      </FlexView>
      {error && (
        <FlexView row center>
          <Text variant="subtitle2" color="primary">{error.message}</Text>
        </FlexView>
      )}
    </FlexView>
  );
}