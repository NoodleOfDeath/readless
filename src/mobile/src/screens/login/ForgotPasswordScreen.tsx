import React from 'react';

import { ScreenComponent } from '../types';

import { 
  Button,
  Screen, 
  Text, 
  TextInput,
  View,
} from '~/components';
import { StorageContext } from '~/contexts';
import { strings } from '~/locales';

export function ForgotPasswordScreen({ route }: ScreenComponent<'forgotPassword'>) {
  
  const { api: { requestOtp } } = React.useContext(StorageContext);
  
  const [success, setSuccess] = React.useState(false);
  const [email, setEmail] = React.useState(route?.params?.email ?? '');
  const [message, setMessage] = React.useState('');
  
  const handleRequest = React.useCallback(async () => {
    try {
      const { data, error } = await requestOtp({ email });
      if (error) {
        setMessage(error.message);
        return;
      }
      if (data.success) {
        setSuccess(true);
        setMessage(strings.aPasswordResetLinkHasBeenSentToYourEmail);
      }
    } catch (e) {
      console.error(e);
    }
  }, [email, requestOtp]);
  
  return (
    <Screen>
      <View p={ 24 } gap={ 12 }>
        { !success && (
          <React.Fragment>
            <TextInput
              value={ email }
              onChangeText={ setEmail }
              placeholder={ strings.email } />
            <Button
              contained
              onPress={ handleRequest }>
              Request Password Reset
            </Button>
          </React.Fragment>
        )}
        { message && <Text>{ message }</Text> }
      </View>
    </Screen>
  );
}