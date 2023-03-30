import React from 'react';
import {
  Linking,
  Pressable,
  Text,
} from 'react-native';

import { formatDistance } from 'date-fns';
import { Divider } from 'react-native-elements';

import ConsumptionModeSelector, { ConsumptionMode } from './ConsumptionModeSelector';
import { SummaryResponse } from '../../api';
import FlexView from '../common/FlexView';
import Menu from '../common/Menu';
import { useTheme } from '../theme';

type Props = {
  summary: SummaryResponse;
  tickIntervalMs?: number;
  mode?: ConsumptionMode;
  onChange?: (mode?: ConsumptionMode) => void;
};

export default function Post({
  summary,
  tickIntervalMs = 60_000,
  mode,
  onChange,
}: Props) {
  const theme = useTheme();

  const [lastTick, setLastTick] = React.useState(new Date());

  const timeAgo = React.useMemo(() => {
    return formatDistance(new Date(summary.createdAt), lastTick, { addSuffix: true });
  }, [summary.createdAt, lastTick]);

  const options = React.useMemo(() => {
    return [
      {
        label: 'View original summary',
        onPress: async () => {
          await Linking.openURL(summary.url);
        },
      },
    ];
  }, [summary.url]);

  // pdate time ago every `tickIntervalMs` milliseconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setLastTick(new Date());
    }, tickIntervalMs);
    return () => clearInterval(interval);
  }, [tickIntervalMs]);

  const content = React.useMemo(() => {
    if (!mode || !summary) {
      return null;
    }
    switch (mode) {
    case 'keyPoints':
      return summary.bullets.join('\n');
    case 'concise':
      return summary.shortSummary;
    case 'casual':
      return summary.summary;
    case 'comprehensive':
      return summary.longSummary;
    default:
      return null;
    }
  }, [mode, summary]);

  return (
    <FlexView style={ theme.components.card }>
      <Text style={ theme.typography.subtitle1 }>{summary.outletName.trim()}</Text>
      <Pressable onPress={ () => onChange?.('casual') }>
        <Text style={ theme.typography.title1 }>{summary.title.trim()}</Text>
      </Pressable>
      <Divider orientation="horizontal" style={ theme.components.divider } />
      <FlexView row>
        <Text style={ theme.typography.subtitle2 }>{timeAgo}</Text>
        <Menu icon="dots-horizontal" options={ options } />
      </FlexView>
      <FlexView mt={ 2 }>
        <ConsumptionModeSelector mode={ mode } onChange={ onChange } />
        <FlexView mt={ 4 }>
          {content && <Text style={ theme.typography.body1 }>{content}</Text>}
        </FlexView>
      </FlexView>
    </FlexView>
  );
}
