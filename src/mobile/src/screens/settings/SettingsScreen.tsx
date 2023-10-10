import React from 'react';

import {
  Screen,
  ScrollView,
  SettingsTable,
} from '~/components';
import { ScreenComponent } from '~/screens';

export function SettingsScreen({ navigation }: ScreenComponent<'settings'>) {
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

