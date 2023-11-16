
import React from 'react';
import { Platform } from 'react-native';

import {
  Button,
  Image,
  Screen,
  Text,
  View,
} from '~/components';
import { useThirdPartyLogin } from '~/hooks';
import { strings } from '~/locales';
import { ScreenComponent } from '~/screens';

export function LoginScreen({
  route: _route,
  navigation, 
}: ScreenComponent<'login'>) {

  const [message, setMessage] = React.useState<string>();

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
            source={ { uri: Platform.select({ android: 'logo', ios: 'Logo' }) } }
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