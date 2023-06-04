import React from 'react';

import { SheetProps } from 'react-native-actions-sheet';

import {
  ActionSheet,
  Button,
  Text,
  View,
  ViewProps,
} from '~/components';
import { IapContext } from '~/contexts';

type Props = ViewProps;

export function SubscribeDialog({ ...props }: SheetProps<Props>) {
  
  const { subscriptions: products, subscribe } = React.useContext(IapContext);
  
  return (
    <ActionSheet id={ props.sheetId }>
      <View>
        <Text>{JSON.stringify(products)}</Text>
        <Button onPress={ () => subscribe(products[0].productId) }>Subscribe</Button>
      </View>
    </ActionSheet>
  );
  
}