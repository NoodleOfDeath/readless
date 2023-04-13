import React from 'react';

import {
  MediaPlayer,
  Screen,
  TabSwitcher,
  View,
} from '~/components';
import { ScreenProps } from '~/screens';

export function MediaScreen({ navigation }: ScreenProps<'default'>) {
  
  return (
    <Screen>
      <MediaPlayer />
    </Screen>
  );
}
