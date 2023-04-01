import React from 'react';
import {
  Linking,
  Pressable,
  Text,
} from 'react-native';

import { formatDistance } from 'date-fns';
import { Divider } from 'react-native-elements';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import ReadingFormatSelector from './ReadingFormatSelector';
import { ReadingFormat, SummaryResponse } from '../../api';
import FlexView from '../common/FlexView';
import Menu from '../common/Menu';
import { useTheme } from '../theme';

type Props = {
  summary: SummaryResponse;
  tickIntervalMs?: number;
  format?: ReadingFormat;
  onChange?: (format?: ReadingFormat) => void;
};

export default function Summary({
  summary,
  tickIntervalMs = 60_000,
  format,
  onChange,
}: Props) {
  const theme = useTheme();

  const [lastTick, setLastTick] = React.useState(new Date());

  const timeAgo = React.useMemo(() => {
    if (!summary.createdAt) {
      return;
    }
    return formatDistance(new Date(summary.createdAt), lastTick, { addSuffix: true });
  }, [summary.createdAt, lastTick]);

  // pdate time ago every `tickIntervalMs` milliseconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setLastTick(new Date());
    }, tickIntervalMs);
    return () => clearInterval(interval);
  }, [tickIntervalMs]);

  const content = React.useMemo(() => {
    if (!format || !summary) {
      return null;
    }
    switch (format) {
    case 'bullets':
      return summary.bullets.join('\n');
    case 'concise':
      return summary.shortSummary;
    case 'casual':
      return summary.summary;
    case 'detailed':
      return summary.longSummary;
    default:
      return summary.text;
    }
  }, [format, summary]);
  
  const votes = React.useMemo(() => {
    return (summary.interactions.upvotes ?? 0) - (summary.interactions.downvotes ?? 0);
  }, [summary.interactions]);

  return (
    <FlexView style={ theme.components.card }>
      <FlexView style={ theme.components.category }>
        <Text style={ theme.components.categoryText }>{summary.category}</Text>
        <Text style={ theme.components.categoryText }>{summary.subcategory}</Text>
      </FlexView>
      <FlexView row>
        <Text style={ theme.typography.subtitle1 }>{summary.outletName.trim()}</Text>
        <Text style={ theme.typography.subtitle1 } onPress={ () => Linking.openURL(summary.url) }>View original source</Text>
      </FlexView>
      <Pressable onPress={ () => onChange?.(ReadingFormat.Concise) }>
        <Text style={ theme.typography.title1 }>{summary.title.trim()}</Text>
      </Pressable>
      <Divider orientation="horizontal" style={ theme.components.divider } />
      <FlexView row>
        <FlexView row>
          <Text style={ theme.typography.subtitle2 }>{timeAgo}</Text>
        </FlexView>
        <FlexView row />
        <FlexView row>
          <Pressable style={ theme.components.button }>
            <MaterialCommunityIcons
              name={ summary.interactions.uservote === 'up' ? 'thumb-up' : 'thumb-up-outline' }
              size={ 24 }
              style={ theme.components.button } />
          </Pressable>
          <Text style={ theme.typography.subtitle2 }>{votes}</Text>
          <Pressable style={ theme.components.button }>
            <MaterialCommunityIcons
              name={ summary.interactions.uservote === 'down' ? 'thumb-down' : 'thumb-down-outline' }
              size={ 24 }
              style={ theme.components.button } />
          </Pressable>
        </FlexView>
      </FlexView>
      <FlexView mt={ 2 }>
        <ReadingFormatSelector format={ format } onChange={ onChange } />
        <FlexView mt={ 4 }>
          {content && <Text style={ theme.typography.body1 }>{content}</Text>}
        </FlexView>
      </FlexView>
    </FlexView>
  );
}
