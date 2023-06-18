import React from 'react';

import { ReadingFormat } from '~/api';
import {
  Screen,
  ScrollView,
  Summary,
} from '~/components';
import { SessionContext } from '~/contexts';

export function ReadingFormatPickerScreen() {
  const { preferredReadingFormat, setPreference } = React.useContext(SessionContext);
  return (
    <Screen>
      <ScrollView>
        <Summary
          hideCard
          hideAnalytics
          initialFormat={ preferredReadingFormat ?? ReadingFormat.Summary }
          onFormatChange={ (format) => setPreference('preferredReadingFormat', format) } />
      </ScrollView>
    </Screen>
  );
}