import React from 'react';

import { Screen, SummaryList } from '~/components';
import { useSummaryClient } from '~/hooks';
import { ScreenProps } from '~/screens';

export function SearchScreen({ 
  route,
  navigation: _navigation,
}: ScreenProps<'search'>) {
  
  const { getSummaries } = useSummaryClient();
  return (
    <Screen>
      <SummaryList
        fetch={ getSummaries }
        filter={ route?.params?.prefilter }
        specificIds={ route?.params?.specificIds } />
    </Screen>
  );
}