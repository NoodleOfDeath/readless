import React from 'react';

import {
  Screen,
  Text,
  View,
} from '~/components';
import { ScreenProps } from '~/screens';

export function CategoryScreen({
  route,
  navigation,
}: ScreenProps<'category'>) {

  const category = React.useMemo(() => route?.params?.category, [route]);

  return (
    <Screen>
      <View mt={ 10 }>
        <Text>{category?.displayName}</Text>
      </View>
    </Screen>
  );
}
