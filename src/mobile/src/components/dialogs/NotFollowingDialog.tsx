import React from 'react';

import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { 
  Button,
  Dialog,
  DialogProps,
  Text,
  View,
} from '~/components';
import { StackableTabParams } from '~/screens';

export type NotFollowingDialogProps = DialogProps & {
  navigation?: NativeStackNavigationProp<StackableTabParams, keyof StackableTabParams>;
};

export function NotFollowingDialog({
  onClose,
  navigation,
  ...dialogProps
}: NotFollowingDialogProps) {
  return (
    <Dialog onClose={ onClose } { ...dialogProps }>
      <View width="70%" p={ 16 }>
        <Text 
          center
          fontSize={ 20 }
          mb={ 8 }>
          Looks like you are not following any categories or news sources.
        </Text>
        <View alignCenter justifyCenter>
          <Button 
            center
            outlined 
            selectable
            rounded
            p={ 8 }
            mb={ 8 }
            onPress={ () => { 
              onClose?.();
              setTimeout(() => navigation?.getParent()?.navigate('Sections'), 500);
            } }>
            Go to the Sections tab
          </Button>
        </View>
        <Text 
          center
          fontSize={ 20 }
          mb={ 8 }>
          to custom select the categories and sources you would only like to see then come back here!
        </Text>
      </View>
    </Dialog>
  );
}