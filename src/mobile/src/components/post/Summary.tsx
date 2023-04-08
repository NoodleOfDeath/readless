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
  bookmarked?: boolean;
  collapsible?: boolean;
  forceCompact?: boolean;
  forceCollapse?: boolean;
  onFormatChange?: (format?: ReadingFormat) => void;
  onReferSearch?: (prefilter: string) => void;
  onCollapse?: (collapsed: boolean) => void;
  onInteract?: (interaction: InteractionType, content?: string, metadata?: Record<string, unknown>) => void;
};

export function Summary({
  summary,
  tickIntervalMs = 60_000,
  format,
  realtimeInteractions,
  collapsible = true,
  bookmarked,
  forceCompact,
  forceCollapse,
  onFormatChange,
  onReferSearch,
  onCollapse,
  onInteract,
}: Props) {
  const theme = useTheme();
  const { preferences: { preferredReadingFormat } } = React.useContext(SessionContext);

  const [lastTick, setLastTick] = React.useState(new Date());

  const [compact, setCompact] = React.useState(forceCompact);
  const [collapsed, setCollapsed] = React.useState(forceCollapse);
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

  React.useEffect(() => {
    setCompact(forceCompact);
  }, [forceCompact]);

  React.useEffect(() => {
    setCollapsed(forceCollapse);
  }, [forceCollapse]);

  const toggleCollapse = React.useCallback(() => {
    setCollapsed((prev) => {
      onCollapse?.(!prev);
      return !prev;
    });
  }, [onCollapse]);
  
  return (
    <View rounded style={ theme.components.card }>
      <View row alignCenter>
        <View row justifySpaced rounded style={ theme.components.category }>
          {collapsed ? (
            <Pressable onPress={ () => onFormatChange?.(preferredReadingFormat ?? ReadingFormat.Concise) }>
              <Text fontSize={ 16 } color="contrastText">{summary.title.trim()}</Text>
            </Pressable>
          ) : (
            <React.Fragment>
              <View 
                row
                alignCenter
                onPress={ () => onReferSearch?.(`category:${summary.category.replace(/\s/g, '.') }`) }>
                {summary.categoryAttributes?.icon && <Icon name={ summary.categoryAttributes?.icon } color="contrastText" mr={ 8 } />}
                <Text color='contrastText'>{summary.category}</Text>
              </View>
              <View row />
              <View right alignEnd>
                <Button 
                  row
                  alignCenter
                  small
                  right
                  startIcon={ bookmarked ? 'bookmark' : 'bookmark-outline' }
                  color="contrastText"
                  onPress={ () => onInteract?.(InteractionType.Bookmark) }>
                  Read Later
                </Button>
              </View>
            </React.Fragment>
          )}
        </View>
        {collapsible && (
          <View alignCenter>
            <Button 
              big
              startIcon={ collapsed ? 'chevron-left' : 'chevron-down' }
              onPress={ () => toggleCollapse() }
              color={ theme.colors.text }
              ml={ 8 } />
          </View>
        )}
      </View>
      {!collapsed && (
        <React.Fragment>
          <View row justifySpaced>
            <Button 
              onPress={ () => onReferSearch?.(`outlet:${summary.outletId}`) }>
              <Text variant='subtitle1' underline>
                {summary.outletName.trim()}
              </Text>
            </Button>
            <Button onPress={ () => Linking.openURL(summary.url) } pv={ 2 }>
              <Text variant='subtitle1' underline>View original source</Text>
            </Button>
          </View>
          <Pressable onPress={ () => onFormatChange?.(preferredReadingFormat ?? ReadingFormat.Concise) }>
            <Text variant={ compact ? 'subtitle2' : 'title2' }>{summary.title.trim()}</Text>
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
            <ReadingFormatSelector 
              format={ format } 
              compact={ compact }
              onChange={ onFormatChange } />
            <View mt={ 4 }>
              {content && <Text variant='body1'>{content}</Text>}
            </View>
          </View>
        </React.Fragment>
      )}
    </View>
  );
}
