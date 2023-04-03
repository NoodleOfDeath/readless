import React from 'react';
import { Linking, Pressable } from 'react-native';

import { formatDistance } from 'date-fns';

import { 
  InteractionType,
  ReadingFormat, 
  SummaryResponse,
} from '~/api';
import {
  Button,
  Divider,
  FlexView,
  ReadingFormatSelector,
  Text,
} from '~/components';
import { SessionContext } from '~/contexts';
import { useTheme } from '~/hooks';

type Props = {
  summary: SummaryResponse;
  tickIntervalMs?: number;
  format?: ReadingFormat;
  onChange?: (format?: ReadingFormat) => void;
  onInteract?: (interaction: InteractionType, content?: string, metadata?: Record<string, unknown>) => void;
};

export function Summary({
  summary,
  tickIntervalMs = 60_000,
  format,
  onChange,
  onInteract,
}: Props) {
  const theme = useTheme();
  const { preferredReadingFormat } = React.useContext(SessionContext);

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
    return (summary.interactions.upvote ?? 0) - (summary.interactions.downvote ?? 0);
  }, [summary.interactions]);
  
  return (
    <FlexView style={ theme.components.card }>
      <FlexView style={ theme.components.category }>
        <Text center color='contrastText'>{summary.category}</Text>
        <Text center color='contrastText'>{summary.subcategory}</Text>
      </FlexView>
      <FlexView row>
        <Text variant='subtitle1'>{summary.outletName.trim()}</Text>
        <Button onPress={ () => Linking.openURL(summary.url) }><Text variant='subtitle1'>View original source</Text></Button>
      </FlexView>
      <Pressable onPress={ () => onChange?.(preferredReadingFormat ?? ReadingFormat.Concise) }>
        <Text variant='title1'>{summary.title.trim()}</Text>
      </Pressable>
      <Divider horizontal />
      <FlexView row>
        <FlexView row>
          <Text variant='subtitle2'>{timeAgo}</Text>
        </FlexView>
        <FlexView row />
        <FlexView row>
          <Button
            icon={ summary.interactions.uservote === 'up' ? 'thumb-up' : 'thumb-up-outline' }
            onPress={ () => onInteract?.(InteractionType.Upvote) } />
          <Text variant='subtitle2'>{String(votes)}</Text>
          <Button 
            icon={ summary.interactions.uservote === 'down' ? 'thumb-down' : 'thumb-down-outline' }
            onPress={ () => onInteract?.(InteractionType.Downvote) } />
        </FlexView>
      </FlexView>
      <FlexView mt={ 2 }>
        <ReadingFormatSelector format={ format } onChange={ onChange } />
        <FlexView mt={ 4 }>
          {content && <Text variant='body1'>{content}</Text>}
        </FlexView>
      </FlexView>
    </FlexView>
  );
}
