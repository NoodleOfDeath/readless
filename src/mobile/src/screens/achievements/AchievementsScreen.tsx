import React from 'react';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import {
  Button,
  Divider,
  FetchableList,
  Screen,
  TableViewCell,
  Text,
  View,
} from '~/components';
import { StorageContext } from '~/contexts';
import { useNavigation, useTheme } from '~/hooks';
import { strings } from '~/locales';
import { ScreenComponent } from '~/screens/types';

const Tab = createMaterialTopTabNavigator();

export function InProgressAchievementsScreen(_navigationprops: ScreenComponent<'achievements'>) {

  const theme = useTheme();
  const { api: { getAchievements } } = React.useContext(StorageContext);
  const { navigate } = useNavigation();

  return (
    <Screen>
      <View
        beveled
        overflow={ 'hidden' }
        flexGrow={ 1 } 
        bg={ theme.colors.headerBackground }
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
                <Button
                  caption
                  contained
                  overflow={ 'hidden' }
                  leftIcon={ <Text caption zIndex={ 100 }>{`${(item.progress * 100).toFixed(0)}%`}</Text> } 
                  progress={ item.progress }
                  progressColor={ 'green' }
                  progressOpacity={ 0.5 }
                  gap={ 12 }
                  width={ 80 }>
                  {(item.achievement.points ?? 0) >= 1000 ? `${((item.achievement.points ?? 0) / 1000).toFixed(0)}k` : item.achievement.points}
                </Button>
              ) }
              detail={ item.achievement.description }
              onPress={ () => {
                navigate('achievement', item); 
              } } />
          ) }
          estimatedItemSize={ 50 } />
      </View>
    </Screen>
  );
}

export function CompletedAchievementsScreen(_props: ScreenComponent<'achievements'>) {

  const theme = useTheme();
  const { api: { getAchievements } } = React.useContext(StorageContext);
  const { navigate } = useNavigation();

  return (
    <Screen>
      <View
        beveled
        overflow={ 'hidden' }
        bg={ theme.colors.headerBackground }
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
                <Button
                  caption
                  contained
                  leftIcon={ 'check' }
                  gap={ 12 }
                  width={ 80 }>
                  {item.achievement.points}
                </Button>
              ) }
              detail={ item.achievement.description }
              onPress={ () => {
                navigate('achievement', item); 
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