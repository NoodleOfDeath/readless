import React from 'react';

import { useFocusEffect } from '@react-navigation/native';

import { SummaryList } from '~/components';
import { StorageContext } from '~/core';
import { strings } from '~/locales';
import { RoutedScreen } from '~/navigation';
import { ScreenComponent } from '~/screens';

export function SummaryListScreen({ 
  route,
  navigation,
}: ScreenComponent<'summaryList'>) {
  
  const { api: { getSummaries } } = React.useContext(StorageContext);

  useFocusEffect(React.useCallback(() => {
    navigation?.setOptions({ headerTitle: route?.params?.prefilter || strings.home });
  }, [route, navigation]));

  return (
    <RoutedScreen>
      <SummaryList
        landscapeEnabled
        enableTts
        fetch={ getSummaries }
        filter={ route?.params?.prefilter }
        specificIds={ route?.params?.specificIds } />
    </RoutedScreen>
  );
}