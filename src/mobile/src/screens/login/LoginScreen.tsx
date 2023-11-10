import React from 'react';

import { GOOGLE_CLIENT_ID } from '@env';
import { GoogleSignin, User as GoogleUser } from '@react-native-google-signin/google-signin';

import { ThirdParty } from '~/api';
import {
  Button,
  Image,
  Screen,
  View,
} from '~/components';
import { StorageContext, UserData } from '~/contexts';
import { ScreenComponent } from '~/screens';

GoogleSignin.configure({ webClientId: GOOGLE_CLIENT_ID });

export function LoginScreen({
  route: _route,
  navigation, 
}: ScreenComponent<'login'>) {

  const {
    setStoredValue, resetStorage, api: { login }, 
  } = React.useContext(StorageContext);

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
    } catch (error) {
      console.error(error);
    }
  }, [login, setStoredValue]);

  React.useEffect(() => {
    resetStorage();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <Screen>
      <View
        flex={ 1 }
        p={ 12 }
        gap={ 12 }>
        <View
          flex={ 20 }
          itemsCenter
          justifyCenter>
          <Image
            source={ { uri: 'Logo' } }
            width={ 150 } 
            height={ 150 } /> 
        </View>
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
          onPress={ () => navigation?.push('passwordLogin') }>
          Continue with email
        </Button>
        <Button
          textCenter
          onPress={ () => navigation?.push('passwordLogin') }>
          Continue without an account
        </Button>
        <View flex={ 1 } />
      </View>
    </Screen>
  );
}