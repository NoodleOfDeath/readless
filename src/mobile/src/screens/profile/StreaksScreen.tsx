import React from 'react';

import pluralize from 'pluralize';

import { MetricsResponse } from '~/api';
import {
  ActivityIndicator,
  Button,
  ChildlessViewProps,
  Divider,
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
};

export function StreakCounter({
  disclosureIndicator,
  longestStreak: showLongestStreak, 
  ...props 
}: StreakCounterProps) {
  const theme = useTheme();
  const { shareStandard: _, shareSocial: __ } = useShare({});
  const { currentStreak, longestStreak } = React.useContext(StorageContext);
  return (
    <View
      p={ 6 }
      bg={ theme.colors.headerBackground }
      beveled
      { ...props }>
      <Button 
        body2
        leftIcon={ 'flash' }
        rightIcon={ disclosureIndicator ? 'chevron-right' : undefined }
        iconSize={ 24 }>
        { `${currentStreak?.length ?? 1} ${strings.day} ${strings.streak}`}
      </Button>
      {showLongestStreak && (
        <View itemsCenter>
          <Divider my={ 6 } />
          <Text body2>{strings.yourLongestStreak}</Text>
          <Text body2>{ `${longestStreak?.length ?? 1} ${pluralize(strings.day, longestStreak?.length ?? 1)}`}</Text> 
        </View>
      )}
    </View>
  );
}

export function StreaksScreen() {

  const { openURL } = useInAppBrowser();
  const { api: { getMetrics }, userData } = React.useContext(StorageContext);
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
      <View
        p={ 12 } 
        style={ { flex: 1 } }
        gap={ 12 }>
        <StreakCounter longestStreak />
        <Text h2 textCenter>{strings.leaderboard}</Text>
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