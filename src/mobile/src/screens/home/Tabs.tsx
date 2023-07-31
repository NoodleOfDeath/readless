import React from 'react';

import { useFocusEffect } from '@react-navigation/native';

import {
  Divider,
  RecapList,
  SummaryList,
  Text,
  View,
} from '~/components';
import { SessionContext, useSummaryClient } from '~/core';
import { strings } from '~/locales';
import {  ScreenProps } from '~/screens';

export function OldNewsTab({
  route: _route,
  navigation: _navigation,
}: ScreenProps<'oldNews'>) {
  return (
    <RecapList
      header={ (
        <View gap={ 12 }>
          <Text mx={ 12 }>
            {strings.recaps_information}
          </Text>
          <Divider />
        </View>
      ) } />
  );
}

export function YourNewsTab({ 
  route: _route,
  navigation: _navigation,
}: ScreenProps<'yourNews'>) {
  const { getSummaries } = useSummaryClient();
  const { followFilter } = React.useContext(SessionContext);
  const [filter, setFilter] = React.useState(followFilter);
  useFocusEffect(React.useCallback(() => {
    setFilter(followFilter);
  }, [followFilter]));
  return ( 
    <SummaryList
      landscapeEnabled
      fetch={ getSummaries }
      filter={ filter } />
  );
}

export function TopStoriesTab({ 
  route: _route,
  navigation: _navigation,
}: ScreenProps<'topStories'>) {
  const { getTopStories } = useSummaryClient();
  return ( 
    <SummaryList
      landscapeEnabled
      fetch={ getTopStories }
      interval='1d' />
  );
}

export function LiveFeedTab({ 
  route: _route,
  navigation: _navigation,
}: ScreenProps<'liveFeed'>) {
  const { getSummaries } = useSummaryClient();
  return ( 
    <SummaryList 
      landscapeEnabled
      fetch={ getSummaries } />
  );
}