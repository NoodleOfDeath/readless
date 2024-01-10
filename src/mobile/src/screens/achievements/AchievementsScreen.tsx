import React from 'react';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { ScreenComponent } from '../types';

import {
  Button,
  Divider,
  FetchableList,
  Screen,
  TableViewCell,
  View,
} from '~/components';
import { StorageContext } from '~/contexts';
import { strings } from '~/locales';

const Tab = createMaterialTopTabNavigator();

export function InProgressAchievementsScreen({ navigation }: ScreenComponent<'achievements'>) {

  const { api: { getAchievements } } = React.useContext(StorageContext);

  return (
    <Screen>
      <View
        flexGrow={ 1 } 
        m={ 12 }>
        <FetchableList
          autofetch
          flexGrow={ 1 }
          fallbackComponent={ <Button>{strings.youHaveCompletedAllAchievements}</Button> }
          data={ [] }
          fetch={ async () => (await getAchievements()).data?.inProgress }
          renderItem={ ({ item }) => (
            <TableViewCell 
              key={ item.id }
              subtitle
              accessory={ 'DisclosureIndicator' }
              title={ item.achievement.displayName }
              cellIcon={ (
                <Button gap={ 12 } width={ 60 }>
                  {item.achievement.points}
                  {`${(item.progress * 100).toFixed(0)}%`}
                </Button>
              ) }
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

export function CompletedAchievementsScreen({ navigation }: ScreenComponent<'achievements'>) {

  const { api: { getAchievements } } = React.useContext(StorageContext);

  return (
    <Screen>
      <View
        flexGrow={ 1 } 
        m={ 12 }>
        <FetchableList
          autofetch
          flexGrow={ 1 }
          fallbackComponent={ <Button>{strings.youHaveNotEarnedAnyAchievementsYet}</Button> }
          data={ [] }
          fetch={ async () => (await getAchievements()).data?.completed }
          renderItem={ ({ item }) => (
            <TableViewCell 
              key={ item.id }
              subtitle
              accessory={ 'DisclosureIndicator' }
              title={ item.achievement.displayName }
              cellIcon={ (
                <Button leftIcon={ 'star' } gap={ 12 } width={ 60 }>
                  {item.achievement.points}
                </Button>
              ) }
              detail={ item.achievement.description }
              onPress={ () => {
                navigation?.push('achievement', item); 
              } } />
          ) }
          ItemSeparatorComponent={ ({ index }) => <Divider key={ `divider-${index}` } /> }
          estimatedItemSize={ 50 } />
      </View>
    </Screen>
  );
}

export function AchievementsScreen({ navigation: _navigation }: ScreenComponent<'achievements'>) {

  return (
    <Screen>
      <Tab.Navigator>
        <Tab.Screen
          name="inProgress" 
          component={ InProgressAchievementsScreen }
          options={ { title: strings.inProgress } } />
        <Tab.Screen
          name="achieved" 
          component={ CompletedAchievementsScreen }
          options={ { title: strings.completed } } />
      </Tab.Navigator>
    </Screen>
  );

}