import React from 'react';

import { 
  Dialog,
  DialogProps,
  Text,
  View,
} from '~/components';
import { IapContext } from '~/contexts';

type Props = DialogProps;

export function SubscribeDialog({ ...props }: Props) {
  
  const { subscriptions: products, subscribe } = React.useContext(IapContext);
  
  return (
    <Dialog { ...props }>
      <View>
        <Text>{JSON.stringify(products)}</Text>
      </View>
    </Dialog>
  );
  
}