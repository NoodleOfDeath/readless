import React from 'react';
import { Linking, Pressable } from 'react-native';

import { formatDistance } from 'date-fns';

import { 
  InteractionResponse,
  InteractionType,
  ReadingFormat, 
  SummaryResponse,
} from '~/api';
import {
  Button,
  Divider,
  Icon,
  ReadingFormatSelector,
  Text,
  View,
} from '~/components';
import { SessionContext } from '~/contexts';
import { useTheme } from '~/hooks';

type Props = {
  summary: SummaryResponse;
  tickIntervalMs?: number;
  format?: ReadingFormat;
  realtimeInteractions?: InteractionResponse;
  onChange?: (format?: ReadingFormat) => void;
  onInteract?: (interaction: InteractionType, content?: string, metadata?: Record<string, unknown>) => void;
};

export function Summary({
  summary,
  tickIntervalMs = 60_000,
  format,
  realtimeInteractions,
  onChange,
  onInteract,
}: Props) {
  const theme = useTheme();
  const { preferences: { preferredReadingFormat } } = React.useContext(SessionContext);

  const [lastTick, setLastTick] = React.useState(new Date());

  const interactions = React.useMemo(() => realtimeInteractions ?? summary.interactions, [realtimeInteractions, summary.interactions]);

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
      return;
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
    return (interactions.upvote ?? 0) - (interactions.downvote ?? 0);
  }, [interactions]);
  
  return (
    <View rounded style={ theme.components.card }>
      <View row justifySpaced rounded style={ theme.components.category }>
        <View>
          <Text color='contrastText'>{summary.category}</Text>
          <Text color='contrastText'>{summary.subcategory}</Text>
        </View>
        <View row />
      </View>
      <View row justifySpaced>
        <Text variant='subtitle1'>{summary.outletName.trim()}</Text>
        <Button onPress={ () => Linking.openURL(summary.url) } pv={ 2 }>
          <Text variant='subtitle1'>View original source</Text>
        </Button>
      </View>
      <Pressable onPress={ () => onChange?.(preferredReadingFormat ?? ReadingFormat.Concise) }>
        <Text variant='title1'>{summary.title.trim()}</Text>
      </Pressable>
      <Divider horizontal />
      <View row justifySpaced>
        <View row>
          <Text variant='subtitle2'>{timeAgo}</Text>
        </View>
        <View row justifySpaced>
          <View>
            <Text variant='subtitle2'>{String(interactions.view)}</Text>
          </View>
          <Icon
            name="eye"
            color={ 'primary' }
            mh={ 8 } />
          <Button
            color={ 'primary' }
            startIcon={ interactions.uservote === 'up' ? 'thumb-up' : 'thumb-up-outline' }
            onPress={ () => onInteract?.(InteractionType.Upvote) }
            mh={ 8 } />
          <Text variant='subtitle2'>{String(votes)}</Text>
          <Button 
            color={ 'primary' }
            startIcon={ interactions.uservote === 'down' ? 'thumb-down' : 'thumb-down-outline' }
            onPress={ () => onInteract?.(InteractionType.Downvote) }
            mh={ 8 } />
        </View>
      </View>
      <View mt={ 2 }>
        <ReadingFormatSelector format={ format } onChange={ onChange } />
        <View mt={ 4 }>
          {content && <Text variant='body1'>{content}</Text>}
        </View>
      </View>
    </View>
  );
}
