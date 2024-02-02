import React from 'react';
import { InteractionManager } from 'react-native';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useFocusEffect } from '@react-navigation/native';

import { LeaderboardScreen } from './LeaderboardScreen';

import { InteractionType, MetricsResponse } from '~/api';
import {
  ActivityIndicator,
  SYSTEM_FONT,
  Screen,
  View,
} from '~/components';
import { ToastContext } from '~/contexts';
import { StorageContext, UserData } from '~/core';
import { useTheme } from '~/hooks';
import { strings } from '~/locales';
import { ScreenComponent } from '~/screens/types';

const Tab = createMaterialTopTabNavigator();

export function LeaderboardsScreen({ route: _route }: ScreenComponent<'leaderboards'>) {

  const theme = useTheme();
  const { api: { getMetrics }, setStoredValue } = React.useContext(StorageContext);
  const { showToast } = React.useContext(ToastContext);

  const [metrics, setMetrics] = React.useState<MetricsResponse>();

  const onMount = React.useCallback(async () => {
    try {
      if (metrics) {
        return; 
      }
      const { data, error } = await getMetrics({});
      if (error) {
        throw error;
      }
      setMetrics(data);
      setStoredValue('userData', (prev) => {
        if (data.userStats) {
          const state = new UserData(prev?.updateStats(data.userStats));
          return state;
        }
        return prev;
      }, false);
    } catch (e) {
      console.error(e);
      showToast(e);
    }
  }, [getMetrics, metrics, setStoredValue, showToast]);

  useFocusEffect(React.useCallback(() => {
    const interaction = InteractionManager.runAfterInteractions(() => {
      onMount();
    });
    return () => {
      interaction.cancel();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []));

  return (
    <Screen>
      {metrics ? (
        <Tab.Navigator 
          screenOptions={ {
            tabBarAllowFontScaling: true,
            tabBarLabelStyle: { fontFamily: SYSTEM_FONT },
            tabBarScrollEnabled: true,
            tabBarStyle: { backgroundColor: theme.navContainerTheme.colors.background },
          } }>
          <Tab.Screen
            name={ strings.longestStreak }
            component={ LeaderboardScreen }
            initialParams={ {
              metrics,
              title: strings.longestStreak,
              unit: strings.day, 
            } } />
          <Tab.Screen
            name={ strings.daysActive }
            component={ LeaderboardScreen }
            initialParams={ {
              metrics, 
              title: strings.daysActive,
              unit: strings.day, 
            } } />
          <Tab.Screen
            name={ strings.mostReads }
            component={ LeaderboardScreen }
            initialParams={ {
              interactionType: InteractionType.Read, 
              metrics, 
              title: strings.mostReads,
              unit: strings.article,
            } } />
          <Tab.Screen
            name={ strings.mostShares }
            component={ LeaderboardScreen }
            initialParams={ {
              interactionType: InteractionType.Share,
              metrics,
              title: strings.mostShares,
              unit: strings.share,
            } } />
        </Tab.Navigator>
      ) : (
        <View flex={ 1 } justifyCenter>
          <ActivityIndicator animating />
        </View>
      )}
    </Screen>
  );
}