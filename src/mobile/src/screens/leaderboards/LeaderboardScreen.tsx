import React from 'react';

import pluralize from 'pluralize';

import { MetricCounter } from './MetricCounter';
import { ScreenComponent } from '../types';

import {
  Button,
  Icon,
  Popover,
  Screen,
  ScrollView,
  TableView,
  TableViewCell,
  TableViewSection,
  Text,
  View,
} from '~/components';
import { StorageContext } from '~/core';
import { useInAppBrowser, useTheme } from '~/hooks';
import { strings } from '~/locales';

export function LeaderboardScreen({ route }: ScreenComponent<'leaderboards'>) {
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
        <ScrollView>
          <TableView mx={ 12 }>
            <TableViewSection>
              {metrics.streaks.map((streak, index) => (
                <TableViewCell
                  key={ index }
                  bold={ streak.userId === userData?.userId }
                  cellIcon={ <Text bold={ streak.userId === userData?.userId }>{`#${index + 1}`}</Text> }
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