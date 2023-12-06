import React from 'react';

import { ScreenComponent } from '../types';

import {
  Button,
  FetchableList,
  Screen,
  TableViewCell,
  View,
} from '~/components';
import { StorageContext } from '~/contexts';
import { strings } from '~/locales';

export function AchievementsScreen({ navigation }: ScreenComponent<'notifications'>) {

  const { 
    api: { getUserStats },
    userData,
  } = React.useContext(StorageContext);

  const getAchievements = React.useCallback(async () => {
    return (await getUserStats()).data?.achievements ?? [];
  }, [getUserStats]);

  return (
    <Screen>
      <View
        flexGrow={ 1 } 
        m={ 12 }>
        <FetchableList
          flexGrow={ 1 }
          fallbackComponent={ <Button>{strings.youHaveNotEarnedAnyAchievementsYet}</Button> }
          data={ userData?.profile?.stats?.achievements ?? [] }
          fetch={ getAchievements }
          renderItem={ ({ item }) => (
            <TableViewCell 
              key={ item.id }
              subtitle
              accessory={ 'DisclosureIndicator' }
              title={ item.achievement.displayName }
              cellIcon={ 'star' }
              detail={ item.achievement.description }
              onPress={ () => {
                navigation?.push('achievement', item); 
              } } />
          ) }
          estimatedItemSize={ 50 } />
      </View>
    </Screen>
  );

}