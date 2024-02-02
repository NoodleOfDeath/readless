import React from 'react';

import pluralize from 'pluralize';

import { MetricButtonProps, MetricCounter } from './MetricCounter';

import {
  InteractionCount,
  InteractionType,
  Streak,
} from '~/api';
import {
  Button,
  Divider,
  FlatList,
  Icon,
  Popover,
  Screen,
  ScrollView,
  TableViewCell,
  Text,
  View,
} from '~/components';
import { StorageContext } from '~/core';
import { useInAppBrowser, useTheme } from '~/hooks';
import { strings } from '~/locales';
import { ScreenComponent } from '~/screens/types';

export function LeaderboardScreen({ route }: ScreenComponent<'leaderboard'>) {

  const {
    metrics, title, unit, 
  } = route?.params ?? {};
  const theme = useTheme();
  const { openURL } = useInAppBrowser();
  const { userData } = React.useContext(StorageContext);

  const ranking = React.useMemo(() => {
    let rank = 100;
    if (title === strings.longestStreak) {
      rank = metrics?.userRankings?.streaks ?? Number.MAX_SAFE_INTEGER;
    } else
    if (title === strings.daysActive) {
      rank = metrics?.userRankings?.daysActive ?? Number.MAX_SAFE_INTEGER;
    } else
    if (title === strings.mostReads) {
      rank = metrics?.userRankings?.interactionCounts.read ?? Number.MAX_SAFE_INTEGER;
    } else
    if (title === strings.mostShares) {
      rank = metrics?.userRankings?.interactionCounts.share ?? Number.MAX_SAFE_INTEGER;
    }
    return rank > 100 ? '100+' : rank;
  }, [metrics?.userRankings?.daysActive, metrics?.userRankings?.interactionCounts.read, metrics?.userRankings?.interactionCounts.share, metrics?.userRankings?.streaks, title]);

  const counters = React.useMemo<MetricButtonProps[]>(() => {
    if (title === strings.longestStreak) {
      return [
        { streak: true },
        { longestStreak: true },
      ];
    } else
    if (title === strings.daysActive) {
      return [{ daysActive: true }];
    } else
    if (title === strings.mostReads) {
      return [{ interactionType: InteractionType.Read }];
    } else
    if (title === strings.mostShares) {
      return [{ interactionType: InteractionType.Share }];
    }
    return [];
  }, [title]);

  const data = React.useMemo<(InteractionCount | Streak)[]>(() => {
    if (title === strings.longestStreak) {
      return metrics?.streaks ?? [];
    } else
    if (title === strings.daysActive) {
      return metrics?.daysActive ?? [];
    } else
    if (title === strings.mostReads) {
      return metrics?.interactionCounts?.read ?? [];
    } else
    if (title === strings.mostShares) {
      return metrics?.interactionCounts?.share ?? [];
    }
    return [];
  }, [metrics?.daysActive, metrics?.interactionCounts?.read, metrics?.interactionCounts?.share, metrics?.streaks, title]);

  if (!metrics) {
    return null;
  }

  return (
    <Screen>
      <View
        p={ 12 }
        gap={ 12 }
        flex={ 1 }>
        <Text h2 textCenter>{title}</Text>
        <View
          p={ 12 }
          beveled
          flexCol
          itemsCenter
          bg={ theme.colors.headerBackground }>
          <Text>{strings.yourRank}</Text>
          <Text h3>{`${strings.rank} #${ranking}`}</Text>
        </View>
        <MetricCounter metrics={ counters } />
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
          <View
            beveled
            overflow='hidden'
            flexGrow={ 1 }
            minHeight={ 600 } 
            bg={ theme.colors.headerBackground }>
            <FlatList
              flexGrow={ 1 }
              data={ data }
              renderItem={ ({ item, index }) => (
                <TableViewCell 
                  key={ `${item.userId}${item.createdAt}` }
                  bold={ item.userId === userData?.userId }
                  cellIcon={ <Text bold={ item.userId === userData?.userId }>{`#${index + 1}`}</Text> }
                  title={ `${item.user}${item.userId === userData?.userId ? ` (${strings.you})`: ''}` }
                  detail={ `${item.count} ${pluralize(unit ?? strings.item, item.count)}` } />
              ) }
              ItemSeparatorComponent={ ({ index }) => <Divider key={ `divider-${index}` } /> }
              estimatedItemSize={ 50 } />
          </View>
        </ScrollView>
      </View>
    </Screen>
  );
}