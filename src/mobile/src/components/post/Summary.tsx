import React from 'react';

import { formatDistance } from 'date-fns';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { State } from 'react-native-track-player';
import ViewShot from 'react-native-view-shot';

import { 
  InteractionType,
  PublicSummaryAttributes,
  ReadingFormat,
} from '~/api';
import {
  AnalyticsView,
  Button,
  Divider,
  Icon,
  Image,
  Markdown,
  Menu,
  MeterDial,
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
import {
  useInAppBrowser,
  useShare,
  useTheme,
} from '~/hooks';

type Props = {
  summary?: PublicSummaryAttributes;
  tickIntervalMs?: number;
  initialFormat?: ReadingFormat;
  keywords?: string[];
  compact?: boolean;
  swipeable?: boolean;
  disableInteractions?: boolean;
  collapsed?: boolean | {
    summary?: boolean;
    analytics?: boolean;
  }
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

const MOCK_SUMMARY: PublicSummaryAttributes = {
  bullets: ['• this is a bullet', '• this is another bullet'],
  category: '',
  categoryAttributes: {
    displayName: 'Category', icon: 'popcorn', name: '',
  },
  formats: [],
  id: 1,
  imageUrl: 'https://readless.nyc3.cdn.digitaloceanspaces.com/img/s/01084930-e927-11ed-a438-a9ea5ed3eb49.jpg',
  originalTitle: '',
  outletAttributes: {
    displayName: 'News Source', id: -1, name: '', 
  },
  outletId: -1,
  sentiments: { chatgpt: { score: 0.1, tokens: { test: 2 } } },
  shortSummary: 'This is a short 30-40 word summary that can appear under titles if you set it to show in the settings',
  summary: 'This is a 100-120 word summary that will only appear if you open the summary.',
  text: '',
  title: 'This is an example summary title',
  url: 'https://www.readless.ai',
};

export function Summary({
  summary = MOCK_SUMMARY,
  tickIntervalMs = 60_000,
  initialFormat,
  keywords = [],
  compact = false,
  swipeable = true,
  disableInteractions = false,
  collapsed,
  onFormatChange,
  onReferSearch,
  onInteract,
}: Props) {
  const { openURL } = useInAppBrowser();
  const theme = useTheme();
  const { copyToClipboard } = useShare({ onInteract });
  const {
    preferences: {
      showShortSummary,
      preferredReadingFormat, 
      bookmarkedSummaries, 
      readSummaries,
    }, setPreference, 
  } = React.useContext(SessionContext);
  const {
    showShareDialog, setShowFeedbackDialog, setShowShareDialog, 
  } = React.useContext(DialogContext);
  const {
    trackState, queueSummary, currentTrack, stopAndClearTracks,
  } = React.useContext(MediaContext);
  
  const viewshot = React.useRef<ViewShot | null>(null);

  const [lastTick, setLastTick] = React.useState(new Date());

  const [format, setFormat] = React.useState<ReadingFormat | undefined>(initialFormat);
  const [collapseSummary, setCollapseSummary] = React.useState(Boolean(collapsed));
  const [collapseAnalytics, setCollapseAnalytics] = React.useState(Boolean(collapsed));

  const isRead = React.useMemo(() => !compact && !disableInteractions && Boolean(readSummaries?.[summary.id]) && !initialFormat &&!showShareDialog, [compact, disableInteractions, initialFormat, readSummaries, showShareDialog, summary.id]);
  const bookmarked = React.useMemo(() => Boolean(bookmarkedSummaries?.[summary.id]), [bookmarkedSummaries, summary]);
  
  const playingAudio = React.useMemo(() => trackState === State.Playing && currentTrack?.id === ['summary', summary.id].join('-'), [currentTrack?.id, summary.id, trackState]);

  const markdown = React.useCallback((text: string) => {
    for (const word of keywords) {
      text = text.replace(new RegExp(`(${word})`, 'gi'), ' _$1_ ');
    }
    return text;
  }, [keywords]);

  const timeAgo = React.useMemo(() => {
    if (new Date(summary.originalDate ?? 0) > lastTick) {
      return 'just now';
    }
    const originalTime = formatDistance(new Date(summary.originalDate ?? 0), lastTick, { addSuffix: true })
      .replace(/about /, '')
      .replace(/less than a minute ago/, 'just now')
      .replace(/ minutes?/, 'm')
      .replace(/ hours?/, 'h')
      .replace(/ days?/, 'd');
    const generatedTime = formatDistance(new Date(summary.createdAt ?? 0), lastTick, { addSuffix: true })
      .replace(/about /, '')
      .replace(/less than a minute ago/, 'just now')
      .replace(/ minutes/, 'm')
      .replace(/ hours?/, 'h')
      .replace(/ days?/, 'd');
    return new Date(summary.originalDate ?? 0).valueOf() > 0 && originalTime !== generatedTime ? 
      `${originalTime} ${`(generated ${generatedTime})`}` : 
      `${new Date(summary.originalDate ?? 0).valueOf() > 0 ? generatedTime : `generated ${generatedTime}`}`;
  }, [summary.createdAt, summary.originalDate, lastTick]);
  
  const content = React.useMemo(() => {
    if (!format) {
      return;
    }
    let content = summary.summary;
    if (format === 'bullets') {
      content = summary.bullets.join('\n');
    }
    for (const word of keywords) {
      content = content?.replace(new RegExp(`(${word})`, 'gi'), ' _$1_ ');
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
    setTimeout(async () => {
      setPreference('readSummaries', (prev) => ({
        ...prev,
        [summary.id]: new Bookmark(true),
      }));
      setPreference('summaryHistory', (prev) => ({
        ...prev,
        [summary.id]: new Bookmark(InteractionType.Read),
      }));
    }, 200);
    if (!initialFormat) {
      return;
    }
    setFormat(newFormat);
  }, [initialFormat, onFormatChange, setPreference, summary]);
  
  const toggleBookmarked = React.useCallback(() => {
    onInteract?.(InteractionType.Bookmark, undefined, undefined, () => {
      if (!bookmarked) {
        setPreference('readSummaries', (prev) => {
          const state = { ...prev };
          delete state[summary.id];
          return (prev = state);
        });
      }
      setPreference('summaryHistory', (prev) => ({
        ...prev,
        [summary.id]: new Bookmark(InteractionType.Bookmark),
      }));
    });
  }, [bookmarked, onInteract, setPreference, summary.id]);

  const handlePlayAudio = React.useCallback(async () => {
    if (trackState === State.Playing && currentTrack?.id === ['summary', summary.id].join('-')) {
      await stopAndClearTracks();
      return;
    }
    queueSummary(summary);
  }, [trackState, currentTrack?.id, summary, queueSummary, stopAndClearTracks]);
  
  const renderRightActions = React.useCallback(() => {
    const actions = [{
      onPress: () => setPreference('readSummaries', (prev) => {
        onInteract?.(InteractionType.Read, 'mark-read-unread', { isRead: !isRead });
        const newBookmarks = { ...prev };
        if (isRead) {
          delete newBookmarks[summary.id];
        } else {
          newBookmarks[summary.id] = new Bookmark(true);
        }
        return (prev = newBookmarks);
      }),
      startIcon: isRead ? 'email-mark-as-unread' : 'email-open',
      text: isRead ? 'Mark as Unread' : 'Mark as Read',
    }, {
      onPress: () => {
        onInteract?.(InteractionType.Hide, undefined, undefined, () => {
          setPreference('removedSummaries', (prev) => ({
            ...prev,
            [summary.id]: new Bookmark(true),
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
      <RenderActions actions={ actions } side='right' />
    );
  }, [isRead, setPreference, onInteract, summary, setShowFeedbackDialog]);
  
  return (
    <GestureHandlerRootView>
      <Swipeable 
        enabled={ swipeable && !initialFormat && !disableInteractions }
        renderRightActions={ renderRightActions }>
        <ViewShot ref={ viewshot }>
          <View 
            elevated
            mh={ 16 }
            rounded 
            style={ theme.components.card } 
            inactive={ isRead } 
            onPress={ () => handleFormatChange(preferredReadingFormat ?? ReadingFormat.Summary) }
            gap={ 3 }>
            <View row gap={ 12 }>
              <View col width="100%" gap={ 6 }>
                <View col>
                  {showShareDialog || keywords.length === 0 ? <Text bold subtitle1>{summary.title}</Text> : (
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
                      {markdown(summary.title)}
                    </Markdown>
                  )}
                  <View col />
                  <View>
                    <View row alignCenter gap={ 6 }>
                      <Button 
                        elevated
                        row
                        alignCenter
                        gap={ 6 }
                        p={ 4 }
                        rounded
                        startIcon={ summary.categoryAttributes?.icon && <Icon name={ summary.categoryAttributes?.icon } color="text" /> }
                        onPress={ () => onReferSearch?.(`cat:${summary.category}`) } />
                      <Button 
                        row
                        elevated
                        p={ 4 }
                        rounded
                        onPress={ () => onReferSearch?.(`src:${summary.outletAttributes?.name}`) }>
                        {summary.outletAttributes?.displayName}
                      </Button>
                    </View>
                  </View>
                </View>
              </View>
              {!compact && summary.imageUrl && (
                <View
                  width="33%" 
                  gap={ 6 }>
                  <Image
                    source={ { uri: summary.imageUrl } }  
                    rounded
                    aspectRatio={ 1 } />
                  <View row gap={ 6 } alignCenter justifyCenter>
                    <MeterDial 
                      value={ summary.sentiments?.chatgpt?.score ?? 0 }
                      width={ 50 } />
                    <Menu
                      autoAnchor={
                        <Icon size={ 24 } name="information" />
                      }>
                      <Text>This image was generated using AI and is not a real photo of a real event, place, thing, or person.</Text>
                    </Menu>
                  </View>
                </View>
              )}
            </View>
            {!compact && showShortSummary === true && (
              <View>
                <Divider />
                {(showShareDialog || keywords.length === 0) ? <Text>{summary.shortSummary}</Text> : (
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
                    {markdown(summary.shortSummary ?? '')}
                  </Markdown>
                )}
              </View>
            )}
            {!compact && (
              <React.Fragment>
                <Divider />
                <View row alignCenter gap={ 6 }>
                  <View row>
                    <View gap={ 0 } width="100%">
                      <Text bold caption>{`${timeAgo} from`}</Text>
                      <Text 
                        row
                        numberOfLines={ 1 }
                        underline
                        rounded
                        caption
                        onPress={ () => onInteract?.(InteractionType.Read, 'original source', { url: summary.url }, () => openURL(summary.url)) }
                        onLongPress={ () => copyToClipboard(summary.url) }>
                        {summary.url}
                      </Text>
                    </View>
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
                        startIcon={ bookmarked ? 'bookmark' : 'bookmark-outline' }
                        onPress={ () => toggleBookmarked() } />
                      <Button
                        elevated
                        p={ 4 }
                        rounded
                        subtitle2
                        color='text'
                        startIcon='share'
                        onPress={ () => setShowShareDialog(true, {
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
                        onPress={ () => handlePlayAudio() } />
                    </View>
                  </View>
                </View>
              </React.Fragment>
            )}
            {initialFormat && (
              <View>
                <Divider />
                <View row mv={ 8 } gap={ 6 } alignCenter>
                  <Button
                    elevated
                    p={ 6 }
                    rounded
                    iconSize={ 24 }
                    onPress={ () => setCollapseSummary((prev) => !prev) }
                    startIcon={ collapseSummary ? 'chevron-right' : 'chevron-down' } />
                  <Text subtitle1>Summary/Bullets</Text>
                </View>
              </View>
            )}
            {content && !collapseSummary && (
              <View gap={ 12 }>
                <ReadingFormatSelector 
                  format={ format } 
                  preferredFormat={ preferredReadingFormat }
                  onChange={ handleFormatChange } />
                <View>
                  {showShareDialog || keywords.length === 0 ? (
                    <Text>{content}</Text>
                  ) : content.split(/\n/).map((line, i) => (
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
            {initialFormat && summary.sentiments && (
              <View>
                <Divider />
                <View row mv={ 8 } gap={ 6 } alignCenter>
                  <Button
                    elevated
                    p={ 6 }
                    rounded
                    iconSize={ 24 }
                    onPress={ () => setCollapseAnalytics((prev) => !prev) }
                    startIcon={ collapseAnalytics ? 'chevron-right' : 'chevron-down' } />
                  <Text subtitle1>Analytics</Text>
                  <View>
                    <View row gap={ 6 } alignCenter>
                      <View 
                        bg={ 'blue' }
                        p={ 3 }
                        rounded>
                        <Text
                          color="white">
                          beta
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>
                {!collapseAnalytics && (
                  <AnalyticsView
                    sentiments={ summary.sentiments } />
                )}
              </View>
            )}
          </View>
        </ViewShot>
      </Swipeable>
    </GestureHandlerRootView>
  );
}
