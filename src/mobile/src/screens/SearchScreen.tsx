import React from 'react';

import { useFocusEffect } from '@react-navigation/native';

import {
  Header,
  Screen, 
  ScrollView,
  Summary,
  SummaryList,
} from '~/components';
import { useSummaryClient } from '~/hooks';
import { ScreenProps } from '~/screens';

export function SearchScreen({ 
  route,
  navigation,
}: ScreenProps<'search'>) {
  
  const { getSummaries } = useSummaryClient();
  
  useFocusEffect(React.useCallback(() => {
    navigation?.setOptions({
      header: () => (
        <Header
          back
          elevated
          search
          searchValue={ route?.params?.prefilter } />
      ),
    });
  }, [route, navigation]));
  
  return (
    <Screen>
      <SummaryList
        fetch={ getSummaries }
        filter={ route?.params?.prefilter }
        specificIds={ route?.params?.specificIds } />
    </Screen>
  );
}