
import React from 'react';

import { GOOGLE_CLIENT_ID, REGISTRATION_PRIVATE_KEY } from '@env';
import { appleAuth } from '@invertase/react-native-apple-authentication';
import { GoogleSignin, User as GoogleUser } from '@react-native-google-signin/google-signin';
import CryptoJS from 'react-native-crypto-js';

import { ThirdParty } from '~/api';
import {
  Button,
  Image,
  Screen,
  Text,
  View,
} from '~/components';
import { StorageContext, UserData } from '~/contexts';
import { strings } from '~/locales';
import { ScreenComponent } from '~/screens';

GoogleSignin.configure({ webClientId: GOOGLE_CLIENT_ID });

export function LoginScreen({
  route: _route,
  navigation, 
}: ScreenComponent<'login'>) {

  const {
    api: { login },
    setStoredValue, 
    syncWithRemotePrefs,
  } = React.useContext(StorageContext);

  const [message, setMessage] = React.useState('');

  const signInWithApple = React.useCallback(async () => {
    try {
      const appleAuthRequestResponse = await appleAuth.performRequest({
        requestedOperation: appleAuth.Operation.LOGIN,
        requestedScopes: [appleAuth.Scope.FULL_NAME, appleAuth.Scope.EMAIL],
      });
      const credentialState = await appleAuth.getCredentialStateForUser(appleAuthRequestResponse.user);
      if (credentialState === appleAuth.State.AUTHORIZED) {
        const { identityToken } = appleAuthRequestResponse;
        const { data: response, error } = await login({
          createIfNotExists: true, 
          thirdParty: {
            credential: identityToken ?? undefined, 
            name: ThirdParty.Apple, 
          },
        });
        if (error) {
          throw error;
        }
        const userData = new UserData(response);
        setStoredValue('userData', userData);
        syncWithRemotePrefs(userData);
      } else {
        setMessage(strings.failedToSignInWithApple);
      }
    } catch (e) {
      const error = e as Error;
      console.error(error);
      setMessage([strings.failedToSignInWithApple, error.message].join('\n'));
    }
  }, [login, setStoredValue, syncWithRemotePrefs]);

  const signInWithGoogle = React.useCallback(async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const user = await GoogleSignin.signIn();
      const { idToken } = user as GoogleUser;
      if (!idToken) {
        throw new Error('Missing data');
      }
      const { data: response, error } = await login({
        createIfNotExists: true, 
        thirdParty: {
          credential: idToken, 
          name: ThirdParty.Google, 
        },
      });
      if (error) {
        throw error;
      }
      const userData = new UserData(response);
      setStoredValue('userData', userData);
      syncWithRemotePrefs(userData);
      navigation?.getParent()?.navigate('news');
    } catch (e) {
      const error = e as Error;
      console.error(error);
      setMessage([strings.failedToSignInWithGoogle, error.message].join('\n'));
    }
  }, [login, navigation, setStoredValue, syncWithRemotePrefs]);

  const continueWithoutAccount = React.useCallback(async () => {
    try {
      const anonymous = CryptoJS.AES.encrypt(JSON.stringify({ timestamp: new Date().toISOString() }), REGISTRATION_PRIVATE_KEY).toString();
      const { data: response, error } = await login({
        anonymous,
        createIfNotExists: true,
      });
      if (error) {
        throw error;
      }
      const userData = new UserData(response);
      setStoredValue('userData', userData);
      syncWithRemotePrefs(userData);
      navigation?.getParent()?.navigate('news');
    } catch (error) {
      console.error(error);
      setMessage(['Failed to continue without an account:', error].join(' '));
    }
  }, [login, navigation, setStoredValue, syncWithRemotePrefs]);

  return (
    <Screen>
      <View
        flex={ 1 }
        p={ 12 }
        gap={ 12 }>
        <View
          flex={ 20 }
          itemsCenter
          justifyCenter
          bg="white">
          <Image
            native
            contain
            source={ { uri: 'Logo' } }
            width={ 300 }
            height={ 300 } />
          <Text color="invertText">{strings.informationWithoutTheNoise}</Text>
        </View>
        <Text textCenter>{message}</Text>
        <Button
          contained
          leftIcon="apple"
          gap={ 12 }
          onPress={ signInWithApple }>
          {strings.continueWithApple}
        </Button>
        <Button
          contained
          leftIcon="google"
          gap={ 12 }
          onPress={ signInWithGoogle }>
          {strings.continueWithGoogle}
        </Button>
        <Button
          contained
          leftIcon="account"
          gap={ 12 }
          onPress={ () => navigation?.push('passwordLogin', {}) }>
          {strings.continueWithEmail}
        </Button>
        <Button
          textCenter
          onPress={ continueWithoutAccount }>
          {strings.continueWithoutAnAccount}
        </Button>
        <View flex={ 1 } />
      </View>
    </Screen>
  );
}