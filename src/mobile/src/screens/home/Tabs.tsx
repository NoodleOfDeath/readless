import React from 'react';

import { useFocusEffect } from '@react-navigation/native';

import {
  Divider,
  RecapList,
  SummaryList,
  Text,
  View,
} from '~/components';
import { StorageContext, useApiClient } from '~/core';
import { strings } from '~/locales';
import {  ScreenComponent } from '~/screens';

export function OldNewsTab({
  route: _route,
  navigation: _navigation,
}: ScreenComponent<'oldNews'>) {
  return (
    <RecapList
      header={ (
        <View gap={ 12 }>
          <Text mx={ 12 }>
            {strings.recaps_information}
          </Text>
          <Divider mb={ 12 } />
        </View>
      ) } />
  );
}

export function YourNewsTab({ 
  route: _route,
  navigation: _navigation,
}: ScreenComponent<'yourNews'>) {
  const { getSummaries } = useApiClient();
  const { followFilter } = React.useContext(StorageContext);
  const [filter, setFilter] = React.useState(followFilter);
  useFocusEffect(React.useCallback(() => {
    setFilter(followFilter);
  }, [followFilter]));
  return ( 
    <SummaryList
      fancy
      enableTts
      landscapeEnabled
      fetch={ getSummaries }
      filter={ filter } />
  );
}

export function TopStoriesTab({ 
  route: _route,
  navigation: _navigation,
}: ScreenComponent<'topStories'>) {
  const { getTopStories } = useApiClient();
  return ( 
    <SummaryList
      fancy
      enableTts
      landscapeEnabled
      fetch={ getTopStories }
      interval='1d' />
  );
}

export function LiveFeedTab({ 
  route: _route,
  navigation: _navigation,
}: ScreenComponent<'liveFeed'>) {
  const { getSummaries } = useApiClient();
  return ( 
    <SummaryList 
      enableTts
      landscapeEnabled
      fetch={ getSummaries } />
  );
}