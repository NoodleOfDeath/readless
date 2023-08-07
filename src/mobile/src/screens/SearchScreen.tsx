import React from 'react';

import { Screen, SummaryList } from '~/components';
import { useApiClient } from '~/hooks';
import { ScreenProps } from '~/screens';

export function SearchScreen({ 
  route,
  navigation: _navigation,
}: ScreenProps<'search'>) {
  
  const { getSummaries } = useApiClient();
  return (
    <Screen>
      <SummaryList
        landscapeEnabled
        enableTts
        fetch={ getSummaries }
        filter={ route?.params?.prefilter }
        specificIds={ route?.params?.specificIds } />
    </Screen>
  );
}