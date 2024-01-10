import React from 'react';

import pluralize from 'pluralize';

import { InteractionType } from '~/api';
import {
  Button,
  ButtonProps,
  ChildlessViewProps,
  View,
} from '~/components';
import { StorageContext } from '~/core';
import { useTheme } from '~/hooks';
import { strings } from '~/locales';

export type MetricButtonProps = ButtonProps & {
  reputation?: boolean;
  streak?: boolean;
  longestStreak?: boolean;
  daysActive?: boolean;
  interactionType?: InteractionType;
};

export function MetricButton({
  children,
  reputation,
  streak: showStreak,
  longestStreak: showLongestStreak,
  daysActive,
  interactionType,
  ...props
}: Partial<MetricButtonProps> = {}) {
  
  const {
    currentStreak, 
    longestStreak,
    userData,
  } = React.useContext(StorageContext);
  
  const text = React.useMemo(() => {
    if (children) {
      return children;
    } else
    if (reputation) {
      return userData?.profile?.stats?.reputation ?? 0;
    } else
    if (showStreak) {
      return `${currentStreak?.length ?? 1} ${strings.day} ${strings.streak}`;
    } else
    if (showLongestStreak) {
      return `${strings.allTime} | ${longestStreak?.length ?? 1} ${pluralize(strings.day, longestStreak?.length ?? 1)}`;
    } else
    if (daysActive) {
      const days = userData?.profile?.stats?.daysActive.count ?? 1;
      return `${days} ${pluralize(strings.day, days)}`;
    } else
    if (interactionType === InteractionType.Read) {
      const readCount = userData?.profile?.stats?.interactionCounts?.read?.count ?? 0;
      return `${readCount} ${pluralize(strings.article, readCount)}`;
    } else 
    if (interactionType === InteractionType.Share) {
      const shareCount = userData?.profile?.stats?.interactionCounts?.share?.count ?? 0;
      return `${shareCount} ${pluralize(strings.share, shareCount)}`;
    }
    return '';
  }, [children, reputation, showStreak, showLongestStreak, daysActive, interactionType, currentStreak, longestStreak, userData?.profile?.stats]);
  
  return (
    <Button
      accessible
      body2
      contained
      avatar
      flexGrow={ 1 } 
      gap={ 12 }
      iconSize={ 24 }
      { ...props }>
      { text }
    </Button>
  );
}

export type MetricCounterProps = ChildlessViewProps & {
  metrics?: MetricButtonProps[];
};

export function MetricCounter({
  metrics,
  ...props 
}: MetricCounterProps) {
  const theme = useTheme();
  return (
    <View
      beveled
      flexRow
      p={ 12 }
      gap={ 12 }
      bg={ theme.colors.headerBackground }
      { ...props }>
      {metrics?.map((m, i) => (
        <MetricButton key={ i } { ...m } />
      ))}
    </View>
  );
}