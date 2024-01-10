import React from 'react';

import { useFocusEffect } from '@react-navigation/native';

import {
  Divider,
  RecapList,
  SummaryList,
  Text,
  View,
} from '~/components';
import { StorageContext } from '~/contexts';
import { strings } from '~/locales';
import {  MetricCounter, ScreenComponent } from '~/screens';

export function OldNewsTab({
  route: _route,
  navigation: _navigation,
}: ScreenComponent<'oldNews'>) {
  return (
    <RecapList
      header={ (
        <View gap={ 12 }>
          <Text mx={ 12 }>
            {strings.information}
          </Text>
          <Divider mb={ 12 } />
        </View>
      ) } />
  );
}

export function YourNewsTab({ 
  route: _route,
  navigation,
}: ScreenComponent<'yourNews'>) {
  const { api: { getSummaries }, followFilter } = React.useContext(StorageContext);
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
      filter={ filter }
      headerComponent={ (
        <MetricCounter
          metrics={ [{
            disclosureIndicator: true,
            leftIcon: 'trophy',
            onPress: () => navigation?.navigate('achievements'),
            reputation: true,
          }, {
            disclosureIndicator: true,
            leftIcon: 'flash',
            onPress: () => navigation?.navigate('leaderboards'),
            streak: true,
          }] }
          m={ 12 }
          mt={ 0 } />
      ) } />
  );
}

export function TopStoriesTab({ 
  route: _route,
  navigation,
}: ScreenComponent<'topStories'>) {
  const { api: { getTopStories }, followFilter } = React.useContext(StorageContext);
  return ( 
    <SummaryList
      fancy
      enableTts
      landscapeEnabled
      fetch={ getTopStories }
      interval='1d'
      headerComponent={ !followFilter ? (
        <MetricCounter
          metrics={ [{
            disclosureIndicator: true,
            leftIcon: 'trophy',
            onPress: () => navigation?.navigate('achievements'),
            reputation: true,
          }, {
            disclosureIndicator: true,
            leftIcon: 'flash',
            onPress: () => navigation?.navigate('leaderboards'),
            streak: true,
          }] }
          m={ 12 }
          mt={ 0 } />
      ) : undefined } />
  );
}

export function LiveFeedTab({ 
  route: _route,
  navigation: _navigation,
}: ScreenComponent<'liveFeed'>) {
  const { api: { getSummaries } } = React.useContext(StorageContext);
  return ( 
    <SummaryList 
      enableTts
      landscapeEnabled
      fetch={ getSummaries } />
  );
}