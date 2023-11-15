
import React from 'react';

import {
  Button,
  Image,
  Screen,
  Text,
  View,
} from '~/components';
import { StorageContext } from '~/contexts';
import { useThirdPartyLogin } from '~/hooks';
import { strings } from '~/locales';
import { ScreenComponent } from '~/screens';

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

  const { 
    signInWithApple,
    signInWithGoogle,
    signInWithoutAccount,
  } = useThirdPartyLogin(setMessage);

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
          onPress={ signInWithoutAccount }>
          {strings.continueWithoutAnAccount}
        </Button>
        <View flex={ 1 } />
      </View>
    </Screen>
  );
}