import React from 'react';

import { SummaryList } from '~/components';
import { useApiClient } from '~/hooks';
import { ScreenComponent } from '~/screens';
import { RoutedScreen } from '~/screens';

export function SearchScreen({ 
  route,
  navigation: _navigation,
}: ScreenComponent<'search'>) {
  
  const { getSummaries } = useApiClient();
  return (
    <RoutedScreen navigationID='newsStackNav'>
      <SummaryList
        landscapeEnabled
        enableTts
        fetch={ getSummaries }
        filter={ route?.params?.prefilter }
        specificIds={ route?.params?.specificIds } />
    </RoutedScreen>
  );
}