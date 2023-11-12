import React from 'react';

import { ScreenComponent } from '../types';

import { 
  ActivityIndicator,
  Screen, 
  Text,
  View, 
} from '~/components';
import { StorageContext, UserData } from '~/contexts';

export function VerifyOtpScreen({
  route,
  navigation,
}: ScreenComponent<'verifyOtp'>) {
  
  const { 
    api: { verifyOtp },
    setStoredValue,
  } = React.useContext(StorageContext);

  const [message, setMessage] = React.useState('');

  const onMount = React.useCallback(async () => {
    try {
      const { data, error } = await verifyOtp({ otp: route?.params?.otp });
      if (error) {
        setMessage(error.message);
        return;
      }
      if (data) {
        await setStoredValue('userData', new UserData(data));
        navigation?.push('setNewPassword');
      }
    } catch (e) {
      setMessage('unknown error');
      console.error(e);
    }
  }, [navigation, route?.params?.otp, setStoredValue, verifyOtp]);

  React.useEffect(() => {
    onMount();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  return (
    <Screen>
      <View itemsCenter p={ 24 }>
        {message ? <Text>{message}</Text> : (
          <ActivityIndicator />
        )}
      </View>
    </Screen>
  );
}