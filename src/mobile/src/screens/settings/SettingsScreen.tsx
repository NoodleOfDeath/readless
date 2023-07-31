import React from 'react';

import {
  Screen,
  ScrollView,
  SettingsTable,
} from '~/components';
import { ScreenProps } from '~/screens';

export function SettingsScreen({ navigation }: ScreenProps<'settings'>) {
  React.useEffect(() => {
    navigation?.setOptions({ headerRight: () => undefined });
  }, [navigation]);
  return (
    <Screen>
      <ScrollView>
        <SettingsTable />
      </ScrollView>
    </Screen>
  );
}

