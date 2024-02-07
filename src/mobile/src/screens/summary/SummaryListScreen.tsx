import React from 'react';

import { useFocusEffect } from '@react-navigation/native';

import { Screen, SummaryList } from '~/components';
import { StorageContext } from '~/core';
import { strings } from '~/locales';
import { ScreenComponent } from '~/screens';

export function SummaryListScreen({ 
  route,
  navigation,
}: ScreenComponent<'summaryList'>) {
  
  const { api: { getTopStories } } = React.useContext(StorageContext);

  useFocusEffect(React.useCallback(() => {
    navigation?.setOptions({ headerTitle: route?.params?.prefilter || strings.home });
  }, [route, navigation]));

  return (
    <Screen>
      <SummaryList
        landscapeEnabled
        enableTts
        fetch={ getTopStories }
        filter={ route?.params?.prefilter }
        specificIds={ route?.params?.specificIds } />
    </Screen>
  );
}