import React from 'react';
import { ActivityIndicator } from 'react-native';

import { LoginAction } from './types';

import { InternalError } from '~/api';
import {
  Button,
  Icon,
  ScrollView,
  Text,
  TextInput,
  View,
} from '~/components';
import { useLoginClient } from '~/hooks';

export type LoginFormProps = {
  defaultAction?: LoginAction;
  alert?: string;
  onSuccess?: (action: LoginAction) => void;
};

export function LoginForm({ 
  defaultAction = 'logIn',
  alert,
  onSuccess,
}: LoginFormProps) {

  const {
    logIn, register, requestPasswordReset, 
  } = useLoginClient();
  
  const [action, setAction] = React.useState(defaultAction);

  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [confirmPassword, setConfirmPassword] = React.useState('');
  
  const [loading, setLoading] = React.useState(false);
  const [success, setSuccess] = React.useState(false);
  const [formError, setFormError] = React.useState<InternalError | string | undefined>();

  const handleLogIn = React.useCallback(async () => {
    if (formError) {
      return;
    }
    setLoading(true);
    const { error } = await logIn({
      email,
      password,
    });
    if (error) {
      setFormError(error); 
      setLoading(false);
      return;
    }
    setSuccess(true);
    setLoading(false);
    onSuccess?.(action);
  }, [formError, logIn, email, password, onSuccess, action]);

  const handleSignUp = React.useCallback(async () => {
    if (formError) {
      return;
    }
    setLoading(true);
    const { error } = await register({
      email,
      password,
    });
    if (error) {
      setFormError(error);
      setLoading(false);
      return;
    }
    setSuccess(true);
    setLoading(false);
    onSuccess?.(action);
  }, [formError, register, email, password, onSuccess, action]);
  
  const handleRequestPasswordReset = React.useCallback(async () => {
    if (formError) {
      return;
    }
    setLoading(true);
    const { error } = await requestPasswordReset({ email });
    if (error) {
      setFormError(error);
      setLoading(false);
      return;
    }
    setSuccess(true);
    setLoading(false);
    onSuccess?.(action);
  }, [action, email, formError, requestPasswordReset, onSuccess]);
  
  React.useEffect(() => {
    setFormError(undefined);
    setSuccess(false);
    if (!email) {
      setFormError('Email is required');
      return;
    }
    // eslint-disable-next-line no-control-regex
    if (!/(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4]\d)|1\d\d|[1-9]?\d))\.){3}(?:(2(5[0-5]|[0-4]\d)|1\d\d|[1-9]?\d)|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/i.test(email)) {
      setFormError('Enter a valid email');
      return;
    }
    if (action !== 'forgotPassword' && !password) {
      setFormError('Password is required');
      return;
    }
    if (action === 'signUp') {
      if (password.length < 8) {
        setFormError('Password must be at least 8 characters');
        return;
      }
      if (password !== confirmPassword) {
        setFormError('Passwords do not match');
        return;
      }
    }
  }, [action, email, password, confirmPassword]);
  
  return (
    <View p={ 16 } row>
      <ScrollView>
        <View mb={ 16 }>
          <Text center variant="title1">{action === 'logIn' ? 'Log In' : action === 'signUp' ? 'Sign Up' : 'Forgot Password'}</Text>
        </View>
        {alert && (
          <View row justifyCenter mb={ 16 }>
            <Icon name="information" color="primary" mr={ 8 } />
            <Text variant="subtitle1">{alert}</Text>
          </View>
        )}
        {loading && <ActivityIndicator />}
        {(!loading && !success) && (
          <React.Fragment>
            <TextInput 
              label="Email"
              value={ email } 
              onChange={ (e) => setEmail(e.nativeEvent.text) } />
            {action !== 'forgotPassword' && (
              <TextInput 
                label="Password"
                secureTextEntry
                value={ password }
                onChange={ (e) => setPassword(e.nativeEvent.text) } />
            )}
            {action === 'signUp' && (
              <TextInput 
                label="Confirm Password"
                secureTextEntry
                value={ confirmPassword }
                onChange={ (e) => setConfirmPassword(e.nativeEvent.text) } />
            )}
            <View col alignCenter mb={ 16 }>
              {action === 'logIn' && (
                <Button
                  selectable
                  rounded
                  outlined
                  p={ 8 }
                  onPress={ () => handleLogIn() }>
                  Log In
                </Button>
              )}
              {action === 'signUp' && (
                <Button
                  selectable
                  rounded
                  outlined
                  p={ 8 }
                  onPress={ () => handleSignUp() }>
                  Sign Up
                </Button>
              )}
              {action === 'forgotPassword' && (
                <Button
                  selectable
                  rounded
                  outlined
                  p={ 8 }
                  onPress={ () => handleRequestPasswordReset() }>
                  Reset Password
                </Button>
              )}
              {formError && (
                <View row center m={ 8 }>
                  <Icon name="alert-circle" color="error" mr={ 8 } />
                  <Text variant="subtitle2" color="error">{typeof formError === 'string' ? formError : formError.message}</Text>
                </View>
              )}
            </View>
            <View col alignCenter>
              {action === 'logIn' && (
                <React.Fragment>
                  <Button onPress={ () => setAction('forgotPassword') }>Forgot your password?</Button>
                  <View m={ 8 }>
                    <Text>Don&apos;t have an account?</Text>
                    <Button
                      selectable
                      rounded
                      outlined
                      center
                      p={ 8 }
                      m={ 8 }
                      onPress={ () => setAction('signUp') }>
                      Sign Up Here

                    </Button>
                  </View>
                </React.Fragment>
              )}
              {action === 'signUp' && (
                <View>
                  <Text>Already have an account?</Text>
                  <Button
                    selectable
                    rounded
                    outlined
                    center
                    p={ 8 }
                    m={ 8 }
                    onPress={ () => setAction('logIn') }>
                    Log In Here

                  </Button>
                </View>
              )}
            </View>
          </React.Fragment>
        )}
        {(!loading && success) && (
          <React.Fragment>
            {action === 'signUp' && (
              <Text>Please verify your email. A message with a verification link as been sent to you. Make sure to check the spam folder</Text>
            )}
            {action === 'forgotPassword' && (
              <Text>If an email with that account is registered, you should receive a reset password email. Please make sure to check your spam folder.</Text>
            )}
          </React.Fragment>
        )}
        {(success || action === 'forgotPassword') && (
          <View col alignCenter mt={ 8 }>
            <Button onPress={ () => setAction('logIn') }>Back to Login</Button>
          </View>
        )}
      </ScrollView>
    </View>
  );
}