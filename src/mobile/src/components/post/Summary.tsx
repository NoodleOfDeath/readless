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
      alwaysShowReadingFormatSelector, 
      preferredReadingFormat, 
      bookmarkedSummaries, 
      favoritedSummaries,
      readSummaries,
      textScale, 
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
      onInteract?.(InteractionType.Read, 'mark-read-unread', { isRead: !isRead });
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
            col={ !isRead }
            row ={ isRead }
            width={ 120 }
            spacing={ 4 }
            mv={ 4 }
            p={ 8 }
            alignCenter
            justifyCenter
            rounded
            shadowed
            bg={ theme.colors.primary }
            color="white"
            startIcon={ isRead ? 'email-mark-as-unread' : 'email-open' }
            onPress={ onPress }>
            {isRead ? 'Mark as Unread' : 'Mark as Read'}
          </Button>
          <Button 
            col={ !isRead }
            row ={ isRead }
            width={ 120 }
            spacing={ 4 }
            mv={ 4 }
            p={ 8 }
            alignCenter
            justifyCenter
            rounded
            shadowed
            bg={ theme.colors.primary }
            color="white"
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
      onInteract?.(InteractionType.Hide, undefined, undefined, () => {
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
            col={ !isRead }
            row ={ isRead }
            width={ 120 }
            spacing={ 4 }
            mv={ 4 }
            p={ 8 }
            alignCenter
            justifyCenter
            rounded
            shadowed
            bg={ theme.colors.primary }
            color="white"
            startIcon={ 'eye-off' }
            onPress={ hide }>
            Hide
          </Button>
          <Button
            col={ !isRead }
            row ={ isRead }
            width={ 120 }
            spacing={ 4 }
            mv={ 4 }
            p={ 8 }
            alignCenter
            justifyCenter
            rounded
            shadowed
            bg={ theme.colors.primary }
            color="white"
            startIcon={ 'bug' }
            onPress={ report }>
            Report a Bug
          </Button>
        </View>
      </View>
    );
  }, [isRead, theme.colors.primary, onInteract, setPreference, summary, setShowFeedbackDialog]);
  
  return (
    <ViewShot ref={ viewshot }>
      <Swipeable 
        renderLeftActions={ renderLeftActions }
        renderRightActions={ renderRightActions }>
        <View rounded outlined style={ theme.components.card } inactive={ isRead }>
          {!isRead && (
            <React.Fragment>
              <View row alignCenter>
                <View row alignCenter rounded style={ theme.components.category }>
                  <View>
                    <Button 
                      row
                      alignCenter
                      justifyEnd
                      spacing={ 8 }
                      color="contrastText"
                      startIcon={ summary.categoryAttributes?.icon && <Icon name={ summary.categoryAttributes?.icon } color="contrastText" mr={ 8 } /> }
                      onPress={ () => onReferSearch?.(`cat:${summary.category}`) }>
                      {summary.categoryAttributes?.displayName}
                    </Button>
                  </View>
                  <Button
                    justifyEnd
                    alignCenter
                    row
                    spacing={ 4 }
                    color="contrastText"
                    startIcon={ playingAudio ? 'stop' : 'volume-source' }
                    onPress={ () => handlePlayAudio(summary.title) }
                    mr={ 8 }>
                    { playingAudio ? 'Stop' : 'Play' }
                  </Button>
                </View>
              </View>
              <View row justifySpaced alignCenter mb={ 8 }>
                <Button 
                  subtitle2
                  underline
                  onPress={ () => onReferSearch?.(`src:${summary.outletAttributes?.name}`) }>
                  {summary.outletAttributes?.displayName.trim()}
                </Button>
                <Button 
                  subtitle2
                  underline
                  onPress={ () => onInteract?.(InteractionType.Read, 'original source', { url: summary.url }, () => openURL(summary.url)) }>
                  View original source
                </Button>
              </View>
            </React.Fragment>
          )}
          <View onPress={ () => handleFormatChange(preferredReadingFormat ?? ReadingFormat.Concise) }>
            <Text numberOfLines={ isRead ? 2 : 10 } ellipsizeMode='tail' subtitle1>{summary.title.trim()}</Text>
          </View>
          <Divider />
          <View row={ (textScale ?? 1) <= 1 } col={ (textScale ?? 1) > 1 } justifySpaced alignCenter>
            <View col alignCenter={ (textScale ?? 1) > 1 } justifyCenter>
              <Text subtitle2>{timeAgo}</Text>
            </View>
            <View row alignCenter justifyEnd={ (textScale ?? 1) <= 1 }>
              <View mr={ 4 }>
                <Text h6>{String(interactions.view)}</Text>
              </View>
              <Icon
                h6
                name="eye"
                color={ 'primary' }
                mh={ 4 } />
              <Button
                h6
                mh={ 4 }
                color='primary'
                startIcon={ favorited ? 'heart' : 'heart-outline' }
                onPress={ () => onInteract?.(InteractionType.Favorite) } />
              <Button
                h6
                mh={ 4 }
                color='primary'
                startIcon='share'
                onPress={ () => setShowShareFab(true, {
                  content, format, summary, viewshot: viewshot.current, 
                }) } />
            </View>
          </View>
          {alwaysShowReadingFormatSelector && !isRead && (
            <View>
              <ReadingFormatSelector 
                format={ format } 
                preferredFormat={ preferredReadingFormat }
                onChange={ handleFormatChange } />
            </View>
          )}
          {content && (
            <View mt={ 2 }>
              
              <Divider />
              <View row alignCenter justifyStart>
                <Button
                  startIcon={ playingAudio ? 'stop' : 'volume-source' }
                  onPress={ () => handlePlayAudio(content) }
                  mr={ 8 } />
              </View>
              <View mt={ 4 }>
                <Text subtitle1 mt={ 4 }>{content}</Text>
              </View>
            </View>
          )}
        </View>
      </Swipeable>
    </ViewShot>
  );
}
