import React from 'react';

import { 
  ActivityIndicator,
  Button,
  Screen, 
  Text,
  View, 
} from '~/components';
import { StorageContext, UserData } from '~/contexts';
import { strings } from '~/locales';
import { ScreenComponent } from '~/screens/types';

export function VerifyOtpScreen({
  route,
  navigation,
}: ScreenComponent<'verifyOtp'>) {
  
  const { 
    api: { verifyOtp, verifyAlias },
    setStoredValue,
  } = React.useContext(StorageContext);

  const [message, setMessage] = React.useState('');

  const onMount = React.useCallback(async () => {
    try {
      const otp = route?.params?.otp;
      const code = route?.params?.code;
      if (otp) {
        const { data, error } = await verifyOtp({ otp: route?.params?.otp });
        if (error) {
          setMessage(error.message);
          return;
        }
        if (data) {
          await setStoredValue('userData', new UserData(data));
          navigation?.replace('setNewPassword');
        }
      } else 
      if (code) {
        const { error } = await verifyAlias({ verificationCode: code });
        if (error) {
          setMessage(error.message);
          return;
        }
        setMessage(strings.yourEmailHasBeenVerified);
      } else {
        setMessage(strings.anUnknownErrorOccurred);
      }
    } catch (e) {
      setMessage(strings.anUnknownErrorOccurred);
      console.error(e);
    }
  }, [navigation, route?.params?.code, route?.params?.otp, setStoredValue, verifyAlias, verifyOtp]);

  React.useEffect(() => {
    onMount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <Screen>
      <View itemsCenter p={ 24 } gap={ 12 }>
        {message ? <Text>{message}</Text> : (
          <ActivityIndicator />
        )}
        <Button
          contained
          onPress={ () => navigation?.replace('passwordLogin', {}) }>
          {strings.continueToLogin}
        </Button>
      </View>
    </Screen>
  );
}