import React from 'react';

import { PublisherPicker, Screen } from '~/components';

export function PublisherPickerScreen() {
  return (
    <Screen safeArea>
      <PublisherPicker />
    </Screen>
  );
}