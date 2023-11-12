import React from 'react';

import { SummaryList } from '~/components';
import { StorageContext } from '~/core';
import { RoutedScreen } from '~/navigation';
import { ScreenComponent } from '~/screens';

export function SearchScreen({ 
  route,
  navigation: _navigation,
}: ScreenComponent<'search'>) {
  
  const { api: { getSummaries } } = React.useContext(StorageContext);
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