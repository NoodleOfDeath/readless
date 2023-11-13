
import React from 'react';

import { GOOGLE_CLIENT_ID, REGISTRATION_PRIVATE_KEY } from '@env';
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

  const signInWithGoogle = React.useCallback(async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const user = await GoogleSignin.signIn();
      const { idToken, user: { id: userId } } = user as GoogleUser;
      if (!idToken || !userId) {
        throw new Error('Missing data');
      }
      const { data: response } = await login({
        createIfNotExists: true, 
        thirdParty: {
          credential: idToken, 
          name: ThirdParty.Google, 
          userId, 
        },
      });
      const userData = new UserData(response);
      setStoredValue('userData', userData);
      syncWithRemotePrefs(userData);
    } catch (error) {
      console.error(error);
      setMessage('Failed to sign in with Google');
    }
  }, [login, setStoredValue, syncWithRemotePrefs]);

  const continueWithoutAccount = React.useCallback(async () => {
    try {
      const anonymous = CryptoJS.AES.encrypt(JSON.stringify({ timestamp: new Date().toISOString() }), REGISTRATION_PRIVATE_KEY).toString();
      const { data: response } = await login({
        anonymous,
        createIfNotExists: true,
      });
      const userData = new UserData(response);
      setStoredValue('userData', userData);
      syncWithRemotePrefs(userData);
    } catch (error) {
      console.error(error);
      setMessage('Failed to continue without an account');
    }
  }, [login, setStoredValue, syncWithRemotePrefs]);

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
        <Text>{message}</Text>
        <Button
          contained
          leftIcon="google"
          gap={ 12 }
          onPress={ signInWithGoogle }>
          Continue with Google
        </Button>
        <Button
          contained
          leftIcon="account"
          gap={ 12 }
          onPress={ () => navigation?.push('passwordLogin', {}) }>
          Continue with email
        </Button>
        <Button
          textCenter
          onPress={ continueWithoutAccount }>
          Continue without an account
        </Button>
        <View flex={ 1 } />
      </View>
    </Screen>
  );
}