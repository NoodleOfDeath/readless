import React from 'react';

import pluralize from 'pluralize';
import { Avatar } from 'react-native-paper';

import { InteractionType } from '~/api';
import {
  Button,
  ChildlessViewProps,
  Text,
  View,
} from '~/components';
import { StorageContext } from '~/core';
import { useShare, useTheme } from '~/hooks';
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
      justifySpaceEvenly={ !vertical }
      { ...props }>
      {showReputation && (
        <Button
          accessible
          accessibilityLabel={ strings.reputation }
          body2
          contained
          gap={ 12 }
          leftIcon={ (
            <Avatar.Icon
              icon="trophy"
              size={ 24 } />
          ) }
          onPress={ onReputationPress }
          rightIcon={ disclosureIndicator ? 'chevron-right' : undefined }>
          {`${userData?.profile?.stats?.reputation ?? 0}`}
        </Button>
      )}
      <Button
        accessible
        accessibilityLabel={ strings.streak }
        body2
        contained
        gap={ 12 }
        leftIcon={ (
          <Avatar.Icon
            icon="flash"
            size={ 24 } />
        ) }
        rightIcon={ disclosureIndicator ? 'chevron-right' : undefined }
        onPress={ onStreakPress }>
        { count }
      </Button>
      {showLongestStreak && (
        <Button
          accessible
          accessibilityLabel={ strings.longestStreak }
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