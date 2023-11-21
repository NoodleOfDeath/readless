import React from 'react';

import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import pluralize from 'pluralize';

import { ScreenComponent } from '../types';

import { MetricsResponse } from '~/api';
import {
  ActivityIndicator,
  Button,
  ChildlessViewProps,
  Divider,
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

export type StreakCounterProps = ChildlessViewProps & {
  disclosureIndicator?: boolean;
  longestStreak?: boolean;
  horizontal?: boolean;
};

export function StreakCounter({
  disclosureIndicator,
  longestStreak: showLongestStreak, 
  horizontal,
  ...props 
}: StreakCounterProps) {
  const theme = useTheme();
  const { shareStandard: _, shareSocial: __ } = useShare({});
  const { currentStreak, longestStreak } = React.useContext(StorageContext);
  return (
    <View
      beveled
      p={ 12 }
      bg={ theme.colors.headerBackground }
      flexRow={ horizontal }
      justifySpaceEvenly={ horizontal }
      { ...props }>
      <Button
        body2
        gap={ 6 }
        leftIcon={ 'flash' }
        rightIcon={ disclosureIndicator ? 'chevron-right' : undefined }>
        { `${currentStreak?.length ?? 1} ${strings.day} ${strings.streak}`}
      </Button>
      {showLongestStreak && (
        <React.Fragment>
          <Divider my={ horizontal ? 0 : 6 } vertical={ horizontal } />
          <Text body2>{strings.yourLongestStreak}</Text>
          <Text body2>{ `${longestStreak?.length ?? 1} ${pluralize(strings.day, longestStreak?.length ?? 1)}`}</Text> 
        </React.Fragment>
      )}
    </View>
  );
}

export function LongestStreakLeaderboardScreen({ route }: ScreenComponent<'leaderboards'>) {
  const { metrics } = route?.params ?? {};
  const theme = useTheme();
  const { openURL } = useInAppBrowser();
  const { userData } = React.useContext(StorageContext);
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
          {metrics ? <Text h3>{`${strings.rank} #${metrics?.userRankings?.streaks}`}</Text> : <ActivityIndicator animating />}
        </View>
        <StreakCounter horizontal longestStreak />
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
          {!metrics ? (
            <ActivityIndicator animating />
          ) : (
            <TableView mx={ 12 }>
              <TableViewSection>
                {metrics?.streaks.map((streak, index) => (
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
          )}
        </ScrollView>
      </View>
    </Screen>
  );
}

const Tab = createMaterialTopTabNavigator();

export function LeaderboardsScreen({ route: _route }: ScreenComponent<'leaderboards'>) {

  const theme = useTheme();
  const { api: { getMetrics } } = React.useContext(StorageContext);
  const { showToast } = React.useContext(ToastContext);

  const [metrics, setMetrics] = React.useState<MetricsResponse>();

  const onMount = React.useCallback(async () => {
    try {
      const { data, error } = await getMetrics();
      if (error) {
        throw error;
      }
      setMetrics(data);
    } catch (e) {
      console.error(e);
      showToast(e);
    }
  }, [getMetrics, showToast]);

  React.useEffect(() => {
    onMount();
  }, [onMount]);

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
        </Tab.Navigator>
      ) : <ActivityIndicator animating />}
    </Screen>
  );
}