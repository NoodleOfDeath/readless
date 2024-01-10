import React from 'react';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useFocusEffect } from '@react-navigation/native';
import pluralize from 'pluralize';

import { LeaderboardScreen } from './LeaderboardScreen';
import { MetricCounter } from './MetricCounter';
import { ScreenComponent } from '../types';

import { InteractionType, MetricsResponse } from '~/api';
import {
  ActivityIndicator,
  Button,
  Divider,
  FlatList,
  Icon,
  Popover,
  SYSTEM_FONT,
  Screen,
  ScrollView,
  TableView,
  TableViewCell,
  TableViewSection,
  Text,
  View,
} from '~/components';
import { ToastContext } from '~/contexts';
import { StorageContext } from '~/core';
import { useInAppBrowser, useTheme } from '~/hooks';
import { strings } from '~/locales';

export function LongestStreakLeaderboardScreen({ route }: ScreenComponent<'leaderboard'>) {

  const { metrics } = route?.params ?? {};
  const theme = useTheme();
  const { openURL } = useInAppBrowser();
  const { userData } = React.useContext(StorageContext);

  if (!metrics) {
    return null;
  }
  
  return (
    <Screen>
      <View
        p={ 12 }
        gap={ 12 }
        flex={ 1 }>
        <Text h2 textCenter>{strings.longestStreak}</Text>
        <View
          p={ 12 }
          beveled
          flexCol
          itemsCenter
          bg={ theme.colors.headerBackground }>
          <Text>{strings.yourRank}</Text>
          <Text h3>{`${strings.rank} #${(metrics?.userRankings?.streaks ?? Number.MAX_SAFE_INTEGER) > 100 ? '100+' : (metrics?.userRankings?.streaks ?? '???')}`}</Text>
        </View>
        <MetricCounter longestStreak />
        <View flexRow gap={ 6 } justifyCenter>
          <Text textCenter>
            {strings.thanksForBeingAnActiveReader}
          </Text>
          <Popover
            anchor={
              <Icon size={ 24 } name="information" />
            }>
            <View p={ 24 } gap={ 6 }>
              <Text>{strings.thanksForBeingAnActiveReaderLong}</Text>
              <View />
              <View gap={ 6 } itemsCenter>
                <Text>{strings.contactUs}</Text>
                <Button
                  bold 
                  underline
                  onPress={ () => openURL('mailto:hello@readless.ai') }>
                  hello@readless.ai
                </Button>
                <Button
                  bold 
                  underline
                  onPress={ () => openURL('https://discord.gg/2gw3dP2a4u') }>
                  https://discord.gg/2gw3dP2a4u
                </Button>
              </View>
            </View>
          </Popover>
        </View>
        <ScrollView beveled overflow='hidden'>
          <View flexGrow={ 1 } minHeight={ 600 } beveled overflow='hidden'>
            <FlatList
              flexGrow={ 1 }
              data={ metrics.streaks }
              renderItem={ ({ item: streak, index }) => (
                <TableViewCell 
                  key={ `${streak.userId}${streak.createdAt}` }
                  bold={ streak.userId === userData?.userId }
                  cellIcon={ <Text bold={ streak.userId === userData?.userId }>{`#${index + 1}`}</Text> }
                  title={ `${streak.user}${streak.userId === userData?.userId ? ` (${strings.you})`: ''}` }
                  detail={ `${streak.length} ${pluralize(strings.day, streak.length)}` } />
              ) }
              ItemSeparatorComponent={ ({ index }) => <Divider key={ `divider-${index}` } /> }
              estimatedItemSize={ 50 } />
          </View>
        </ScrollView>
      </View>
    </Screen>
  );
}

export function DaysActiveLeaderboardScreen({ route }: ScreenComponent<'leaderboard'>) {
  
  const { metrics } = route?.params ?? {};
  const theme = useTheme();
  const { userData } = React.useContext(StorageContext);
  if (!metrics) {
    return null;
  }
  return (
    <Screen>
      <View
        p={ 12 }
        gap={ 12 }
        flex={ 1 }>
        <Text h2 textCenter>{strings.daysActive}</Text>
        <View
          p={ 12 }
          beveled
          flexCol
          itemsCenter
          bg={ theme.colors.headerBackground }>
          <Text>{strings.yourRank}</Text>
          <Text h3>{`${strings.rank} #${(metrics?.userRankings?.daysActive ?? Number.MAX_SAFE_INTEGER) > 100 ? '100+' : (metrics?.userRankings?.daysActive ?? '???')}`}</Text>
        </View>
        <MetricCounter longestStreak />
        <ScrollView>
          <TableView mx={ 12 }>
            <TableViewSection>
              {metrics.daysActive.map((streak, index) => (
                <TableViewCell
                  key={ index }
                  bold={ streak.userId === userData?.userId }
                  cellIcon={ <Text bold={ streak.userId === userData?.userId }>{`#${index + 1}`}</Text> }
                  title={ `${streak.user}${streak.userId === userData?.userId ? ` (${strings.you})`: ''}` }
                  detail={ `${streak.count} ${pluralize(strings.day, streak.count)}` } />
              ))}
            </TableViewSection>
          </TableView>
        </ScrollView>
      </View>
    </Screen>
  );
}

export function InteractionCountLeaderboardScreen({ route }: ScreenComponent<'leaderboard'>) {
  const { metrics, interactionType } = route?.params ?? {};
  const theme = useTheme();
  const { openURL } = useInAppBrowser();
  const { userData } = React.useContext(StorageContext);
  const unit = React.useMemo(() => {
    if (interactionType === InteractionType.Read) {
      return strings.article;
    } else if (interactionType === InteractionType.Share) {
      return strings.share;
    }
    return `${interactionType}`;
  }, [interactionType]);
  if (!metrics || !interactionType) {
    return <ActivityIndicator animating />;
  }
  return (
    <Screen>
      <View p={ 12 } gap={ 12 } flex={ 1 }>
        <Text h2 textCenter>{`${strings.most} ${pluralize(interactionType, 2)}`}</Text>
        <View
          p={ 12 }
          beveled
          flexCol
          itemsCenter
          bg={ theme.colors.headerBackground }>
          <Text>{strings.yourRank}</Text>
          <Text h3>{`${strings.rank} #${(metrics.userRankings?.interactionCounts[interactionType] ?? Number.MAX_SAFE_INTEGER) > 100 ? '100+' : (metrics.userRankings?.interactionCounts[interactionType] ?? '???')}`}</Text>
        </View>
        <MetricCounter vertical interactionType={ interactionType } />
        <View flexRow gap={ 6 } justifyCenter>
          <Text textCenter>
            {strings.thanksForBeingAnActiveReader}
          </Text>
          <Popover
            anchor={
              <Icon size={ 24 } name="information" />
            }>
            <View p={ 24 } gap={ 6 }>
              <Text>{strings.thanksForBeingAnActiveReaderLong}</Text>
              <View />
              <View gap={ 6 } itemsCenter>
                <Text>{strings.contactUs}</Text>
                <Button
                  bold 
                  underline
                  onPress={ () => openURL('mailto:hello@readless.ai') }>
                  hello@readless.ai
                </Button>
                <Button
                  bold 
                  underline
                  onPress={ () => openURL('https://discord.gg/2gw3dP2a4u') }>
                  https://discord.gg/2gw3dP2a4u
                </Button>
              </View>
            </View>
          </Popover>
        </View>
        <ScrollView>
          <TableView mx={ 12 }>
            <TableViewSection>
              {metrics.interactionCounts[interactionType]?.map((event, index) => (
                <TableViewCell
                  key={ index }
                  bold={ event.userId === userData?.userId }
                  cellIcon={ <Text bold={ event.userId === userData?.userId }>{`#${index + 1}`}</Text> }
                  title={ `${event.user}${event.userId === userData?.userId ? ` (${strings.you})`: ''}` }
                  detail={ `${event.count} ${pluralize(unit, event.count)}` } />
              ))}
            </TableViewSection>
          </TableView>
        </ScrollView>
      </View>
    </Screen>
  );
}

const Tab = createMaterialTopTabNavigator();

export function LeaderboardsScreen({ route: _route }: ScreenComponent<'leaderboards'>) {

  const theme = useTheme();
  const { api: { getMetrics }, syncWithRemote } = React.useContext(StorageContext);
  const { showToast } = React.useContext(ToastContext);

  const [metrics, setMetrics] = React.useState<MetricsResponse>();

  const onMount = React.useCallback(async () => {
    try {
      if (metrics) {
        return; 
      }
      syncWithRemote();
      const { data, error } = await getMetrics({});
      if (error) {
        throw error;
      }
      setMetrics(data);
    } catch (e) {
      console.error(e);
      showToast(e);
    }
  }, [syncWithRemote, getMetrics, metrics, showToast]);

  useFocusEffect(React.useCallback(() => {
    onMount();
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
            component={ LongestStreakLeaderboardScreen }
            initialParams={ { metrics } } />
          <Tab.Screen
            name={ strings.daysActive }
            component={ LeaderboardScreen }
            initialParams={ { metrics } } />
          <Tab.Screen
            name={ strings.mostReads }
            component={ InteractionCountLeaderboardScreen }
            initialParams={ { interactionType: InteractionType.Read, metrics } } />
          <Tab.Screen
            name={ strings.mostShares }
            component={ InteractionCountLeaderboardScreen }
            initialParams={ { interactionType: InteractionType.Share, metrics } } />
        </Tab.Navigator>
      ) : <View flex={ 1 } justifyCenter><ActivityIndicator animating /></View>}
    </Screen>
  );
}