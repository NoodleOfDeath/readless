import React from 'react';

import { useFocusEffect } from '@react-navigation/native';
import pluralize from 'pluralize';

import {
  Button,
  Divider,
  RecapList,
  SummaryList,
  Text,
  View,
} from '~/components';
import { StorageContext } from '~/contexts';
import { useShare, useTheme } from '~/hooks';
import { strings } from '~/locales';
import {  ScreenComponent } from '~/screens';

export function StreakCounter() {
  const theme = useTheme();
  const { shareStandard, shareSocial } = useShare({});
  const { currentStreak, longestStreak } = React.useContext(StorageContext);
  return (
    <View
      p={ 6 }
      m={ 6 }
      flexRow
      bg={ theme.colors.headerBackground }
      beveled>
      <Button 
        body2
        leftIcon={ 'flash' }
        iconSize={ 24 }
        flex={ 1 }>
        { `${currentStreak?.length ?? 1} ${strings.day} ${strings.streak}`}
      </Button>
      <Button 
        iconSize={ 24 }
        flex={ 1 }>
        <Text body2 flex={ 2 } lineHeight={ 24 }>{`${strings.longestStreak}:`}</Text>
        <Text body2 flex={ 1 } lineHeight={ 24 }>{ `${longestStreak?.length ?? 1} ${pluralize(strings.day, longestStreak?.length ?? 1)}`}</Text>
      </Button>
    </View>
  );
}

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
  navigation: _navigation,
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
      headerComponent={ <StreakCounter /> } />
  );
}

export function TopStoriesTab({ 
  route: _route,
  navigation: _navigation,
}: ScreenComponent<'topStories'>) {
  const { api: { getTopStories }, followFilter } = React.useContext(StorageContext);
  return ( 
    <SummaryList
      fancy
      enableTts
      landscapeEnabled
      fetch={ getTopStories }
      interval='1d'
      headerComponent={ !followFilter ? <StreakCounter /> : undefined } />
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