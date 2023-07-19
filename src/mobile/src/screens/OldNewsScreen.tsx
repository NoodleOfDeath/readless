import React from 'react'; 

import {
  Divider,
  RecapList,
  Screen,
  Text,
  View,
} from '~/components';
import { strings } from '~/locales';

export function OldNewsScreen() {

  return (
    <Screen>
      <RecapList
        header={ (
          <View gap={ 12 }>
            <Text mx={ 12 }>
              {strings.recaps_information}
            </Text>
            <Divider />
          </View>
        ) } />
    </Screen>
  );
}