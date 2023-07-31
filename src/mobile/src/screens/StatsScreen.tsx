import React from 'react';

import { SheetManager } from 'react-native-actions-sheet';

import {
  Button,
  Screen,
  Text,
  View,
} from '~/components';
import { SessionContext } from '~/core';
import { ScreenProps } from '~/screens';

export function StatsScreen({
  route: _route,
  navigation: _navigation,
}: ScreenProps<'stats'>) {
  const { setPreference } = React.useContext(SessionContext);
  return (
    <Screen>
      <View gap={ 12 } m={ 64 } flex={ 1 } justifyCenter>
        <Text>
          Whoa, you were not supposed to find this screen. Noice! Email thecakeisalie@readless.ai with a screenshot of this page to get inducted.
        </Text>
        <Button
          contained
          onPress={ () => {
            setPreference('viewedFeatures', undefined);
          } }>
          DO NOT PRESS ME
        </Button>
        <Button
          contained
          onPress={ () => {
            SheetManager.show('onboarding-walkthrough');
          } }>
          DO NOT PRESS ME EITHER
        </Button>
      </View>
    </Screen>
  );
}