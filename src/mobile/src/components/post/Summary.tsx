import React from 'react';

import { formatDistance } from 'date-fns';
import { Swipeable } from 'react-native-gesture-handler';
import ViewShot from 'react-native-view-shot';

import { 
  InteractionResponse,
  InteractionType,
  PublicSummaryAttributes,
  ReadingFormat,
} from '~/api';
import {
  Button,
  Divider,
  Icon,
  ReadingFormatSelector,
  Text,
  View,
} from '~/components';
import {
  Bookmark,
  DialogContext,
  MediaContext,
  SessionContext,
} from '~/contexts';
import { useInAppBrowser, useTheme } from '~/hooks';

type Props = {
  summary: PublicSummaryAttributes;
  tickIntervalMs?: number;
  initialFormat?: ReadingFormat;
  realtimeInteractions?: InteractionResponse;
  bookmarked?: boolean;
  favorited?: boolean;
  onFormatChange?: (format?: ReadingFormat) => void;
  onReferSearch?: (prefilter: string) => void;
  onCollapse?: (collapsed: boolean) => void;
  onInteract?: (interaction: InteractionType, content?: string, metadata?: Record<string, unknown>, alternateAction?: () => void) => void;
};

export function Summary({
  summary,
  tickIntervalMs = 60_000,
  initialFormat,
  realtimeInteractions,
  onFormatChange,
  onReferSearch,
  onInteract,
}: Props) {
  const { openURL } = useInAppBrowser();
  const theme = useTheme();
  const {
    preferences: {
      preferredReadingFormat, bookmarkedSummaries, favoritedSummaries, readSummaries, textScale, 
    }, setPreference, 
  } = React.useContext(SessionContext);
  const {
    showShareFab, setShowFeedbackDialog, setShowShareFab, 
  } = React.useContext(DialogContext);
  const {
    firstResponder, readText, cancelTts, 
  } = React.useContext(MediaContext);
  
  const viewshot = React.useRef<ViewShot | null>(null);

  const [lastTick, setLastTick] = React.useState(new Date());

  const [format, setFormat] = React.useState<ReadingFormat | undefined>(initialFormat);
  const interactions = React.useMemo(() => realtimeInteractions ?? summary.interactions, [realtimeInteractions, summary.interactions]);

  const isRead = React.useMemo(() => Boolean(readSummaries?.[summary.id]) && !initialFormat &&!showShareFab, [initialFormat, readSummaries, showShareFab, summary.id]);
  const bookmarked = React.useMemo(() => Boolean(bookmarkedSummaries?.[summary.id]), [bookmarkedSummaries, summary]);
  const favorited = React.useMemo(() => Boolean(favoritedSummaries?.[summary.id]), [favoritedSummaries, summary]);
  
  const playingAudio = React.useMemo(() => firstResponder === ['summary', summary.id].join('-'), [firstResponder, summary]);

  const timeAgo = React.useMemo(() => {
    if (!summary.createdAt) {
      return;
    }
    return formatDistance(new Date(summary.createdAt), lastTick, { addSuffix: true });
  }, [summary.createdAt, lastTick]);

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

  // update time ago every `tickIntervalMs` milliseconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setLastTick(new Date());
    }, tickIntervalMs);
    return () => clearInterval(interval);
  }, [tickIntervalMs]);

  const handleFormatChange = React.useCallback((newFormat?: ReadingFormat) => {
    onFormatChange?.(newFormat);
    setTimeout(() => {
      setPreference('readSummaries', (prev) => ({
        ...prev,
        [summary.id]: new Bookmark(summary),
      }));
    }, 1000);
    if (!initialFormat) {
      return;
    }
    setFormat(newFormat);
  }, [initialFormat, onFormatChange, setPreference, summary]);

  const handlePlayAudio = React.useCallback(async (text: string) => {
    if (firstResponder) {
      cancelTts();
      if (firstResponder === ['summary', summary.id].join('-')) {
        return;
      }
    }
    onInteract?.(InteractionType.Listen, text);
    try {
      await readText(text, ['summary', summary.id].join('-'));
    } catch (e) {
      console.error(e);
    }
  }, [cancelTts, onInteract, firstResponder, readText, summary]);

  const renderLeftActions = React.useCallback(() => {
    const onPress = () => setPreference('readSummaries', (prev) => {
      const newBookmarks = { ...prev };
      if (isRead) {
        delete newBookmarks[summary.id];
      } else {
        newBookmarks[summary.id] = new Bookmark(summary);
      }
      return (prev = newBookmarks);
    });
    return (
      <View 
        rounded
        justifyCenter>
        <View col p={ 8 } mb={ 8 }>
          <Button
            col
            alignCenter
            justifyCenter
            rounded
            shadowed
            bg={ theme.colors.primary }
            color="white"
            mv={ 4 }
            p={ 16 }
            startIcon={ isRead ? 'email-mark-as-unread' : 'read' }
            onPress={ onPress }>
            {isRead ? 'Mark as Unread' : 'Mark as Read'}
          </Button>
          <Button 
            col
            alignCenter
            justifyCenter
            rounded
            shadowed
            bg={ theme.colors.primary }
            color="white"
            mv={ 4 }
            p={ 16 }
            startIcon={ bookmarked ? 'bookmark' : 'bookmark-outline' }
            onPress={ () => onInteract?.(InteractionType.Bookmark) }>
            Read Later
          </Button>
        </View>
      </View>
    );
  }, [bookmarked, isRead, onInteract, setPreference, summary, theme.colors.primary]);
  
  const renderRightActions = React.useCallback(() => {
    const hide = () => {
      onInteract?.(InteractionType.Feedback, 'hide', undefined, () => {
        setPreference('removedSummaries', (prev) => ({
          ...prev,
          [summary.id]: new Bookmark(summary),
        }));
      });
    };
    const report = () => { 
      onInteract?.(InteractionType.Feedback, undefined, undefined, () => {
        setShowFeedbackDialog(true, { summary });
      });
    };
    return (
      <View 
        rounded
        justifyCenter>
        <View col p={ 8 } mb={ 8 }>
          <Button
            col
            alignCenter
            justifyCenter
            rounded
            shadowed
            bg={ theme.colors.primary }
            mv={ 4 }
            p={ 16 }
            color="white"
            startIcon={ 'eye-off' }
            onPress={ hide }>
            Hide
          </Button>
          <Button
            col
            alignCenter
            justifyCenter
            rounded
            shadowed
            bg={ theme.colors.primary }
            color="white"
            mv={ 4 }
            p={ 16 }
            startIcon={ 'bug' }
            onPress={ report }>
            Report a Bug
          </Button>
        </View>
      </View>
    );
  }, [theme.colors.primary, onInteract, setShowFeedbackDialog, summary, setPreference]);
  
  return (
    <ViewShot ref={ viewshot }>
      <Swipeable 
        renderLeftActions={ renderLeftActions }
        renderRightActions={ renderRightActions }>
        <View rounded shadowed style={ theme.components.card } inactive={ isRead }>
          <View row alignCenter>
            <View row rounded style={ theme.components.category }>
              <View 
                row
                alignCenter
                onPress={ () => onReferSearch?.(`cat:${summary.category}`) }>
                {summary.categoryAttributes?.icon && <Icon name={ summary.categoryAttributes?.icon } color="contrastText" mr={ 8 } />}
                <Text color='contrastText'>{summary.categoryAttributes?.displayName}</Text>
              </View>
              <View row alignCenter justifyEnd>
                <Button
                  justifyEnd
                  alignCenter
                  row
                  spacing={ 4 }
                  startIcon={ playingAudio ? 'stop' : 'volume-source' }
                  onPress={ () => handlePlayAudio(summary.title) }
                  color={ 'contrastText' }
                  mr={ 8 }>
                  Play Headline as Audio
                </Button>
              </View>
            </View>
          </View>
          <View row justifySpaced alignCenter>
            <Button 
              onPress={ () => onReferSearch?.(`src:${summary.outletAttributes?.name}`) }>
              <Text underline subtitle2>
                {summary.outletAttributes?.displayName.trim()}
              </Text>
            </Button>
            <Button 
              onPress={ () => onInteract?.(InteractionType.Read, 'original source', { url: summary.url }, () => openURL(summary.url)) }>
              <Text right subtitle2 underline>View original source</Text>
            </Button>
          </View>
          <View onPress={ () => handleFormatChange(preferredReadingFormat ?? ReadingFormat.Concise) }>
            <Text subtitle1>{summary.title.trim()}</Text>
          </View>
          <Divider />
          <View row={ (textScale ?? 1) <= 1 } col={ (textScale ?? 1) > 1 } justifySpaced alignCenter>
            <View col alignCenter={ (textScale ?? 1) > 1 } justifyCenter>
              <Text body1>{timeAgo}</Text>
            </View>
            <View row alignCenter justifyEnd={ (textScale ?? 1) <= 1 }>
              <View>
                <Text body1>{String(interactions.view)}</Text>
              </View>
              <Icon
                name="eye"
                color={ 'primary' }
                mh={ 4 } />
              <Button
                startIcon={ favorited ? 'heart' : 'heart-outline' }
                h5
                mh={ 4 }
                color='primary'
                onPress={ () => onInteract?.(InteractionType.Favorite) } />
              <View>
                <Button
                  h5
                  mh={ 4 }
                  color='primary'
                  onPress={ () => setShowShareFab(true, {
                    content, format, summary, viewshot: viewshot.current, 
                  }) }
                  startIcon='share' />
              </View>
            </View>
          </View>
          <View mt={ 2 }>
            <ReadingFormatSelector 
              format={ format } 
              preferredFormat={ preferredReadingFormat }
              onChange={ handleFormatChange } />
            {content && <Divider />}
            {content && (
              <View row alignCenter justifyStart>
                <Button
                  startIcon={ playingAudio ? 'stop' : 'volume-source' }
                  onPress={ () => handlePlayAudio(content) }
                  mr={ 8 } />
              </View>
            )}
            <View mt={ 4 }>
              {content && <Text subtitle1 mt={ 4 }>{content}</Text>}
            </View>
          </View>
        </View>
      </Swipeable>
    </ViewShot>
  );
}
