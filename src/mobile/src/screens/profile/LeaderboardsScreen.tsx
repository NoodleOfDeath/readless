import React from 'react';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { useFocusEffect } from '@react-navigation/native';
import pluralize from 'pluralize';
import { Avatar } from 'react-native-paper';

import { ScreenComponent } from '../types';

import { InteractionType, MetricsResponse } from '~/api';
import {
  ActivityIndicator,
  Button,
  ChildlessViewProps,
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
import {
  useInAppBrowser,
  useShare,
  useTheme,
} from '~/hooks';
import { strings } from '~/locales';

export type MetricCounterProps = ChildlessViewProps & {
  disclosureIndicator?: boolean;
  reputation?: boolean;
  streak?: boolean;
  longestStreak?: boolean;
  interactionType?: InteractionType;
  vertical?: boolean;
  onReputationPress?: () => void;
  onStreakPress?: () => void;
};

export function MetricCounter({
  disclosureIndicator,
  longestStreak: showLongestStreak, 
  reputation: showReputation,
  streak: showStreak = showLongestStreak,
  interactionType,
  vertical,
  onReputationPress,
  onStreakPress,
  ...props 
}: MetricCounterProps) {
  const theme = useTheme();
  const { shareStandard: _, shareSocial: __ } = useShare({});
  const { 
    currentStreak, 
    longestStreak,
    userData,
  } = React.useContext(StorageContext);
  const count = React.useMemo(() => {
    if (showStreak) {
      return `${currentStreak?.length ?? 1} ${strings.day} ${strings.streak}`;
    } else
    if (interactionType === InteractionType.Read) {
      const readCount = userData?.profile?.stats?.interactionCounts?.read?.count ?? 0;
      return `${readCount} ${pluralize(strings.article, readCount)}`;
    } else if (interactionType === InteractionType.Share) {
      const shareCount = userData?.profile?.stats?.interactionCounts?.share?.count ?? 0;
      return `${shareCount} ${pluralize(strings.share, shareCount)}`;
    }
    return '';
  }, [currentStreak, interactionType, showStreak, userData?.profile?.stats]);
  return (
    <View
      beveled
      p={ 12 }
      bg={ theme.colors.headerBackground }
      flexRow={ !vertical }
      flexWrap='wrap'
      justifySpaceEvenly={ !vertical }
      { ...props }>
      {showReputation && (
        <Button
          body2
          contained
          gap={ 12 }
          leftIcon={ (
            <Avatar.Icon
              accessible
              accessibilityLabel={ strings.reputation }
              icon="trophy"
              size={ 24 } />
          ) }
          onPress={ onReputationPress }
          rightIcon={ disclosureIndicator ? 'chevron-right' : undefined }>
          {`${userData?.profile?.stats?.reputation ?? 0}`}
        </Button>
      )}
      <Button
        body2
        contained
        gap={ 12 }
        leftIcon={ (
          <Avatar.Icon
            accessible
            accessibilityLabel={ strings.streak }
            icon="flash"
            size={ 24 } />
        ) }
        rightIcon={ disclosureIndicator ? 'chevron-right' : undefined }
        onPress={ onStreakPress }>
        { count }
      </Button>
      {showLongestStreak && (
        <Button
          body2
          contained
          gap={ 12 }
          itemsCenter>
          <Text body2>{strings.allTime}</Text>
          <Text body2>{ `${longestStreak?.length ?? 1} ${pluralize(strings.day, longestStreak?.length ?? 1)}`}</Text> 
        </Button>
      )}
    </View>
  );
}

export function LongestStreakLeaderboardScreen({ route }: ScreenComponent<'leaderboards'>) {
  const { metrics } = route?.params ?? {};
  const theme = useTheme();
  const { openURL } = useInAppBrowser();
  const { userData } = React.useContext(StorageContext);
  if (!metrics) {
    return <ActivityIndicator animating />;
  }
  return (
    <Screen>
      <View p={ 12 } gap={ 12 } flex={ 1 }>
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
        <ScrollView>
          <TableView mx={ 12 }>
            <TableViewSection>
              {metrics.streaks.map((streak, index) => (
                <TableViewCell
                  key={ index }
                  bold={ streak.userId === userData?.userId }
                  cellIcon={ <Text bold={ streak.userId === userData?.userId }>{`#${index + 1}`}</Text> }
                  cellStyle="RightDetail"
                  title={ `${streak.user}${streak.userId === userData?.userId ? ` (${strings.you})`: ''}` }
                  detail={ `${streak.length} ${pluralize(strings.day, streak.length)}` } />
              ))}
            </TableViewSection>
          </TableView>
        </ScrollView>
      </View>
    </Screen>
  );
}

export function InteractionCountLeaderboardScreen({ route }: ScreenComponent<'leaderboards'>) {
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
                  cellStyle="RightDetail"
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
            name={ strings.mostReadsInThsPastWeek }
            component={ InteractionCountLeaderboardScreen }
            initialParams={ { interactionType: InteractionType.Read, metrics } } />
          {__DEV__ && (
            <Tab.Screen
              name={ strings.mostSharesInThsPastWeek }
              component={ InteractionCountLeaderboardScreen }
              initialParams={ { interactionType: InteractionType.Share, metrics } } />
          )}
        </Tab.Navigator>
      ) : <ActivityIndicator animating />}
    </Screen>
  );
}