import React from 'react';

import { ReadingFormat } from '~/api';
import {
  Screen,
  ScrollView,
  Summary,
} from '~/components';
import { StorageContext } from '~/contexts';

export function ReadingFormatPickerScreen() {
  const { preferredReadingFormat, setStoredValue } = React.useContext(StorageContext);
  return (
    <Screen>
      <ScrollView>
        <Summary
          sample
          hideCard
          initialFormat={ preferredReadingFormat ?? ReadingFormat.Bullets }
          onFormatChange={ (format) => setStoredValue('preferredReadingFormat', format) } />
      </ScrollView>
    </Screen>
  );
}