import React from 'react';

import {
  Screen,
  ScrollView,
  Text,
  View,
} from '~/components';
import { ScreenProps } from '~/screens';

export function ChannelScreen({
  route,
  // navigation,
}: ScreenProps<'channel'>) {

  const type = React.useMemo(() => route?.params?.type, [route]);
  const attributes = React.useMemo(() => route?.params?.attributes, [route]);

  return (
    <Screen>
      <View m={ 12 }>
        <View>
          <Text h5 capitalize>{attributes?.displayName}</Text>
          <Text subtitle2 capitalize>{type}</Text>
        </View>
        <View col>
          <ScrollView>
            <Text>More cool shit</Text>
          </ScrollView>
        </View>
      </View>
    </Screen>
  );
}
