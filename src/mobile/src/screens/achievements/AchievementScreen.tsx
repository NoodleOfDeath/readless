import React from 'react';

import { format as formatDate } from 'date-fns';

import { ScreenComponent } from '../types';

import {
  Divider,
  HighlightedText,
  Screen,
  Text,
  View,
} from '~/components';
import { getFnsLocale } from '~/locales';

export function AchievementScreen({ route }: ScreenComponent<'achievement'>) {
  const achievement = React.useMemo(() => route?.params?.achievement, [route?.params?.achievement]);
  const achievedAt = React.useMemo(() => route?.params?.achievedAt, [route?.params?.achievedAt]);
  return (
    <Screen>
      <View p={ 12 } gap={ 12 }>
        <View
          flexRow
          justifyBetween
          itemsCenter>
          <Text system h6>{achievement?.displayName}</Text>
          <Text system>{achievedAt && formatDate(new Date(achievedAt), '(E) h:mm a - P', { locale: getFnsLocale() })}</Text>
        </View>
        <Divider />
        <HighlightedText system>{achievement?.description}</HighlightedText> 
      </View>
    </Screen>
  );

}