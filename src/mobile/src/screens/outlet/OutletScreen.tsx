import React from 'react';

import {
  Screen,
  Text,
  View,
} from '~/components';
import { ScreenProps } from '~/screens';

export function OutletScreen({
  route,
  // navigation,
}: ScreenProps<'outlet'>) {

  const outlet = React.useMemo(() => route?.params?.outlet, [route]);

  return (
    <Screen>
      <View mt={ 10 }>
        <Text>{outlet?.displayName}</Text>
      </View>
    </Screen>
  );
}
