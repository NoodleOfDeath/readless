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
import { useNavigation } from '~/hooks';
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

export function YourNewsTab({ route: _route }: ScreenComponent<'yourNews'>) {
  const { api: { getTopStories }, followFilter } = React.useContext(StorageContext);
  const { navigate } = useNavigation();
  const [filter, setFilter] = React.useState(followFilter);
  useFocusEffect(React.useCallback(() => {
    setFilter(followFilter);
  }, [followFilter]));
  return ( 
    <SummaryList
      fancy
      enableTts
      landscapeEnabled
      fetch={ getTopStories }
      filter={ filter }
      headerComponent={ (
        <MetricCounter
          metrics={ [{
            disclosureIndicator: true,
            leftIcon: 'trophy',
            onPress: () => navigate('achievements'),
            reputation: true,
          }, {
            disclosureIndicator: true,
            leftIcon: 'flash',
            onPress: () => navigate('leaderboards'),
            streak: true,
          }] }
          m={ 12 }
          mt={ 0 } />
      ) } />
  );
}

export function TopStoriesTab({ route: _route }: ScreenComponent<'topStories'>) {
  const { api: { getTopStories }, followFilter } = React.useContext(StorageContext);
  const { navigate } = useNavigation();
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
            onPress: () => navigate('achievements'),
            reputation: true,
          }, {
            disclosureIndicator: true,
            leftIcon: 'flash',
            onPress: () => navigate('leaderboards'),
            streak: true,
          }] }
          m={ 12 }
          mt={ 0 } />
      ) : undefined } />
  );
}