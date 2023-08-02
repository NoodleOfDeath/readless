import React from 'react';

import { CategoryPicker, Screen } from '~/components';

export function CategoryPickerScreen() {
  return (
    <Screen safeArea>
      <CategoryPicker />
    </Screen>
  );
}