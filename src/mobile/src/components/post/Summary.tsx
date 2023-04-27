import React from 'react';

import { formatDistance } from 'date-fns';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import TrackPlayer, { State } from 'react-native-track-player';
import ViewShot from 'react-native-view-shot';

import { 
  InteractionType,
  PublicSummaryAttributes,
  ReadingFormat,
} from '~/api';
import {
  Button,
  Divider,
  Icon,
  Markdown,
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
  keywords?: string[];
  swipeable?: boolean;
  forceStatic?: boolean;
  onFormatChange?: (format?: ReadingFormat) => void;
  onReferSearch?: (prefilter: string) => void;
  onInteract?: (interaction: InteractionType, content?: string, metadata?: Record<string, unknown>, alternateAction?: () => void) => void;
};

type RenderAction = {
  text: string;
  startIcon?: string;
  onPress: () => void;
};

type RenderActionsProps = {
  actions: RenderAction[];
  theme: ReturnType<typeof useTheme>;
  side?: 'left' | 'right';
};

function RenderActions({ actions, side }: RenderActionsProps) {
  return (
    <View ml={ side === 'right' ? 0 : 24 } mr={ side === 'left' ? 0 : 24 }>
      <View col justifyCenter p={ 8 } mb={ 8 } gap={ 8 }>
        {actions.map((action) => (
          <Button 
            key={ action.text }
            elevated
            flexGrow={ 1 }
            flex={ 1 }
            mv={ 4 }
            p={ 8 }
            alignCenter
            justifyCenter
            rounded
            caption
            startIcon={ action.startIcon }
            onPress={ action.onPress }>
            {action.text}
          </Button>
        ))}
      </View>
    </View>
  );
}

export function Summary({
  summary,
  tickIntervalMs = 60_000,
  initialFormat,
  keywords = [],
  swipeable = true,
  forceStatic = false,
  onFormatChange,
  onReferSearch,
  onInteract,
}: Props) {
  const { openURL } = useInAppBrowser();
  const theme = useTheme();
  const {
    preferences: {
      preferredReadingFormat, 
      bookmarkedSummaries, 
      favoritedSummaries,
      readSummaries,
    }, setPreference, 
  } = React.useContext(SessionContext);
  const {
    showShareFab, setShowFeedbackDialog, setShowShareFab, 
  } = React.useContext(DialogContext);
  const {
    trackState, queueSummary, currentTrack, stopAndClearTracks,
  } = React.useContext(MediaContext);
  
  const viewshot = React.useRef<ViewShot | null>(null);

  const [lastTick, setLastTick] = React.useState(new Date());

  const [format, setFormat] = React.useState<ReadingFormat | undefined>(initialFormat);

  const isRead = React.useMemo(() => !forceStatic && Boolean(readSummaries?.[summary.id]) && !initialFormat &&!showShareFab, [forceStatic, initialFormat, readSummaries, showShareFab, summary.id]);
  const bookmarked = React.useMemo(() => Boolean(bookmarkedSummaries?.[summary.id]), [bookmarkedSummaries, summary]);
  const favorited = React.useMemo(() => Boolean(favoritedSummaries?.[summary.id]), [favoritedSummaries, summary]);
  
  const playingAudio = React.useMemo(() => trackState === State.Playing && currentTrack?.id === ['summary', summary.id].join('-'), [currentTrack?.id, summary.id, trackState]);

  const markdownTitle = React.useMemo(() => {
    let title = summary.title;
    for (const word of keywords) {
      title = title.replace(new RegExp(`(${word})`, 'gi'), ' _$1_ ');
    }
    return title;
  }, [keywords, summary.title]);

  const timeAgo = React.useMemo(() => {
    if ((new Date(summary.originalDate ?? 0)).valueOf() > Date.now()) {
      return <Text bold caption>just now</Text>;
    }
    const originalTime = formatDistance(new Date(summary.originalDate ?? 0), lastTick, { addSuffix: true })
      .replace(/about /, '')
      .replace(/less than a minute ago/, 'just now')
      .replace(/ minutes/, 'm')
      .replace(/ hours?/, 'h')
      .replace(/ days?/, 'd')
      .replace(/ months?/, 'm')
      .replace(/ years?/, 'y');
    const generatedTime = formatDistance(new Date(summary.createdAt ?? 0), lastTick, { addSuffix: true })
      .replace(/about /, '')
      .replace(/less than a minute ago/, 'just now')
      .replace(/ minutes/, 'm')
      .replace(/ hours?/, 'h')
      .replace(/ days?/, 'd')
      .replace(/ months?/, 'm')
      .replace(/ years?/, 'y');
    return new Date(summary.originalDate ?? 0).valueOf() > 0 && originalTime !== generatedTime ? 
      (
        <React.Fragment>
          <Text bold caption>{originalTime}</Text>
          <Text bold caption>
            {`(generated ${generatedTime})`}
          </Text>
        </React.Fragment>
      ) : 
      (<Text bold caption>{new Date(summary.originalDate ?? 0).valueOf() > 0 ? generatedTime : `generated ${generatedTime}`}</Text>);
  }, [summary.createdAt, summary.originalDate, lastTick]);

  const content = React.useMemo(() => {
    if (!format || !summary) {
      return;
    }
    let content: string = summary.shortSummary;
    if (format === 'bullets') {
      content = summary.bullets.join('\n');
    }
    for (const word of keywords) {
      content = content.replace(new RegExp(`(${word})`, 'gi'), ' _$1_ ');
    }
    return content;
  }, [format, keywords, summary]);

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
    }, 200);
    if (!initialFormat) {
      return;
    }
    setFormat(newFormat);
  }, [initialFormat, onFormatChange, setPreference, summary]);

  const handlePlayAudio = React.useCallback(async (text: string) => {
    if (trackState === State.Playing && currentTrack?.id === ['summary', summary.id].join('-')) {
      await stopAndClearTracks();
      return;
    }
    await queueSummary(summary, text);
    TrackPlayer.play();
  }, [currentTrack?.id, queueSummary, summary, trackState, stopAndClearTracks]);

  const renderLeftActions = React.useCallback(() => {
    const actions = [{
      onPress: () => setPreference('readSummaries', (prev) => {
        onInteract?.(InteractionType.Read, 'mark-read-unread', { isRead: !isRead });
        const newBookmarks = { ...prev };
        if (isRead) {
          delete newBookmarks[summary.id];
        } else {
          newBookmarks[summary.id] = new Bookmark(summary);
        }
        return (prev = newBookmarks);
      }),
      startIcon: isRead ? 'email-mark-as-unread' : 'email-open',
      text: isRead ? 'Mark as Unread' : 'Mark as Read',
    }, {
      onPress: () => 
        onInteract?.(InteractionType.Bookmark, undefined, undefined, () => {
          if (!bookmarked) {
            setPreference('readSummaries', (prev) => {
              const state = { ...prev };
              delete state[summary.id];
              return (prev = state);
            });
          }
        }),
      startIcon: bookmarked ? 'bookmark' : 'bookmark-outline',
      text: 'Read Later',
    }];
    return (
      <RenderActions actions={ actions } theme={ theme } side='left' />
    );
  }, [bookmarked, isRead, onInteract, setPreference, summary, theme]);
  
  const renderRightActions = React.useCallback(() => {
    const actions = [{
      onPress: () => {
        onInteract?.(InteractionType.Hide, undefined, undefined, () => {
          setPreference('removedSummaries', (prev) => ({
            ...prev,
            [summary.id]: new Bookmark(summary),
          }));
        });
      },
      startIcon: 'eye-off',
      text: 'Hide',
    }, {
      onPress: () => { 
        onInteract?.(InteractionType.Feedback, undefined, undefined, () => {
          setShowFeedbackDialog(true, { summary });
        });
      },
      startIcon: 'bug',
      text: 'Report a Bug',
    }];
    return (
      <RenderActions actions={ actions } theme={ theme } side='right' />
    );
  }, [theme, onInteract, setPreference, summary, setShowFeedbackDialog]);
  
  return (
    <ViewShot ref={ viewshot }>
      <GestureHandlerRootView>
        <Swipeable 
          enabled={ swipeable }
          renderLeftActions={ renderLeftActions }
          renderRightActions={ renderRightActions }>
          <View 
            elevated
            mh={ 16 }
            rounded 
            style={ theme.components.card } 
            inactive={ isRead } 
            onPress={ () => handleFormatChange(preferredReadingFormat ?? ReadingFormat.Summary) }
            gap={ 4 }>
            {!forceStatic && (
              <View row alignCenter mb={ 8 } gap={ 8 }>
                <Button 
                  elevated
                  p={ 5 }
                  rounded
                  startIcon={ summary.categoryAttributes?.icon && <Icon name={ summary.categoryAttributes?.icon } color="text" /> }
                  onPress={ () => onReferSearch?.(`cat:${summary.category}`) } />
                <Button 
                  elevated
                  p={ 4 }
                  rounded
                  onPress={ () => onReferSearch?.(`src:${summary.outletAttributes?.name}`) }>
                  {summary.outletAttributes?.displayName}
                </Button>
                <View row />
                <Button 
                  elevated
                  p={ 4 }
                  rounded
                  onPress={ () => onInteract?.(InteractionType.Read, 'original source', { url: summary.url }, () => openURL(summary.url)) }>
                  View original source
                </Button>
              </View>
            )}
            <Text
              bold 
              subtitle1
              onPress={ () => handleFormatChange(preferredReadingFormat ?? ReadingFormat.Summary) }>
              {showShareFab ? markdownTitle : (
                <Markdown 
                  bold
                  subtitle1
                  styles={ {
                    em: { 
                      backgroundColor: 'yellow',
                      color: 'black', 
                    }, 
                  } }
                  onPress={ () => handleFormatChange(preferredReadingFormat ?? ReadingFormat.Summary) }>
                  {markdownTitle}
                </Markdown>
              )}
            </Text>
            {!forceStatic && (
              <React.Fragment>
                <Divider />
                <View row justifySpaced alignCenter>
                  <View row gap={ 4 }>
                    {timeAgo}
                  </View>
                  <View>
                    <View row alignCenter justifyEnd gap={ 8 }>
                      <Button
                        elevated
                        p={ 4 }
                        rounded
                        alignCenter
                        subtitle2
                        color='text'
                        startIcon={ favorited ? 'heart' : 'heart-outline' }
                        onPress={ () => onInteract?.(InteractionType.Favorite) } />
                      <Button
                        elevated
                        p={ 4 }
                        rounded
                        subtitle2
                        color='text'
                        startIcon='share'
                        onPress={ () => setShowShareFab(true, {
                          content, format, summary, viewshot: viewshot.current, 
                        }) } />
                      <Button
                        elevated
                        p={ 4 }
                        rounded
                        alignCenter
                        subtitle2
                        color="text"
                        startIcon={ playingAudio ? 'stop' : 'volume-source' }
                        onPress={ () => handlePlayAudio(summary.title) } />
                    </View>
                  </View>
                </View>
              </React.Fragment>
            )}
            {initialFormat && (
              <View mt={ 8 }>
                <ReadingFormatSelector 
                  format={ format } 
                  preferredFormat={ preferredReadingFormat }
                  onChange={ handleFormatChange } />
              </View>
            )}
            {content && (
              <View>
                <Divider />
                <View>
                  {showShareFab ? content : content.split(/\n/).map((line, i) => (
                    <Markdown
                      key={ i }
                      styles={ {
                        em: { 
                          backgroundColor: 'yellow',
                          color: 'black',
                        }, 
                      } }>
                      {line}
                    </Markdown>
                  ))}
                </View>
              </View>
            )}
          </View>
        </Swipeable>
      </GestureHandlerRootView>
    </ViewShot>
  );
}
