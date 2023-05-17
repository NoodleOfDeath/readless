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
  CollapsedView,
  Divider,
  Highlighter,
  Icon,
  Image,
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
  useNavigation,
  useShare,
  useTheme,
} from '~/hooks';
import { averageOfSentiments } from '~/utils';

type Props = {
  summary?: PublicSummaryAttributes;
  tickIntervalMs?: number;
  selected?: boolean;
  initialFormat?: ReadingFormat;
  keywords?: string[];
  compact?: boolean;
  swipeable?: boolean;
  disableInteractions?: boolean;
  onFormatChange?: (format?: ReadingFormat) => void;
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

function RenderActions({ actions }: RenderActionsProps) {
  return (
    <View>
      <View col justifyCenter p={ 8 } mb={ 8 } gap={ 8 }>
        {actions.map((action) => (
          <Button 
            key={ action.text }
            elevated
            flexGrow={ 1 }
            flex={ 1 }
            p={ 8 }
            alignCenter
            justifyCenter
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
  category: {
    averageSentiment: 0.1, displayName: 'Category', icon: 'popcorn', name: '', sentiment: 0.1,
  },
  categoryId: -1,
  formats: [],
  id: 1,
  imageUrl: 'https://readless.nyc3.cdn.digitaloceanspaces.com/img/s/01084930-e927-11ed-a438-a9ea5ed3eb49.jpg',
  originalTitle: '',
  outlet: {
    averageSentiment: 0.1, displayName: 'News Source', name: '', sentiment: 0.1,
  },
  outletId: -1,
  sentiments: [
    {
      id: 0, method: 'chatgpt', parentId: 0, score: 0.1, tokens: [{
        id:0, parentId:0, text: 'token', 
      }],
    },
  ],
  shortSummary: 'This is a short 30-40 word summary that can appear under titles if you set it to show in the settings (this will appear instead of titles when in headline mode)',
  summary: 'This is a 100-120 word summary that will only appear if you open the summary.',
  text: '',
  title: 'This is an example summary title',
  url: 'https://www.readless.ai',
};

export function Summary({
  summary = MOCK_SUMMARY,
  tickIntervalMs = 60_000,
  selected,
  initialFormat,
  keywords = [],
  compact = false,
  swipeable = true,
  disableInteractions = false,
  onFormatChange,
  onInteract,
}: Props) {

  const { openURL } = useInAppBrowser();
  const { openOutlet, openCategory } = useNavigation();
  const { copyToClipboard } = useShare({ onInteract });

  const theme = useTheme();

  const {
    preferences: {
      compactMode,
      showShortSummary,
      preferredReadingFormat, 
      bookmarkedSummaries, 
      readSummaries,
      readSources,
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

  const isRead = React.useMemo(() => !disableInteractions && Boolean(readSummaries?.[summary.id]) && !initialFormat &&!showShareDialog, [disableInteractions, initialFormat, readSummaries, showShareDialog, summary.id]);
  const bookmarked = React.useMemo(() => Boolean(bookmarkedSummaries?.[summary.id]), [bookmarkedSummaries, summary]);
  
  const playingAudio = React.useMemo(() => trackState === State.Playing && currentTrack?.id === ['summary', summary.id].join('-'), [currentTrack?.id, summary.id, trackState]);

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
    return originalTime;
  }, [summary.originalDate, lastTick]);
  
  const content = React.useMemo(() => {
    if (!format) {
      return;
    }
    let content = summary.summary;
    if (format === 'bullets') {
      content = summary.bullets.join('\n');
    }
    return content;
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
    setTimeout(async () => {
      setPreference('readSummaries', (prev) => ({
        ...prev,
        [summary.id]: new Bookmark(true),
      }));
    }, 200);
    if (!initialFormat) {
      return;
    }
    setFormat(newFormat);
  }, [initialFormat, onFormatChange, setPreference, summary]);
  
  const handlePlayAudio = React.useCallback(async () => {
    if (trackState === State.Playing && currentTrack?.id === ['summary', summary.id].join('-')) {
      await stopAndClearTracks();
      return;
    }
    queueSummary(summary);
  }, [trackState, currentTrack?.id, summary, queueSummary, stopAndClearTracks]);
  
  const renderRightActions = React.useCallback(() => {
    const actions = [{
      onPress: () => {
        setPreference('readSummaries', (prev) => {
          onInteract?.(InteractionType.Read, 'mark-read-unread', { isRead: !isRead });
          const newBookmarks = { ...prev };
          if (isRead) {
            delete newBookmarks[summary.id];
          } else {
            newBookmarks[summary.id] = new Bookmark(true);
          }
          return (prev = newBookmarks);
        });
        setPreference('readSources', (prev) => {
          onInteract?.(InteractionType.Read, 'mark-source-unread', { isRead: !isRead });
          const newBookmarks = { ...prev };
          if (isRead) {
            delete newBookmarks[summary.id];
          } else {
            newBookmarks[summary.id] = new Bookmark(true);
          }
          return (prev = newBookmarks);
        });
      },
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
      <RenderActions actions={ actions } />
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
            style={ theme.components.card } 
            inactive={ isRead } 
            onPress={ !initialFormat ? () => handleFormatChange(preferredReadingFormat ?? ReadingFormat.Summary) : undefined }>
            <View col gap={ 12 }>
              <View row>
                {!initialFormat && !showShareDialog && selected && (
                  <View
                    width={ 12 }
                    ml={ -12 }
                    mr={ 12 }
                    mb={ -12 }
                    mt={ -12 }
                    bg={ theme.colors.primary } />
                )}
                <View col gap={ 12 }>
                  <View row gap={ 12 }>
                    <View col width="100%">
                      <View col gap={ 12 }>
                        <View>
                          <View row alignCenter gap={ 12 }>
                            <Text 
                              italic
                              onPress={ () => openOutlet(summary.outlet) }>
                              {summary.outlet.displayName}
                            </Text>
                            <View row />
                            <MeterDial 
                              value={ averageOfSentiments(summary.sentiments)?.score ?? 0 }
                              width={ 40 } />
                          </View>
                        </View>
                        <View>
                          <View row gap={ 12 }>
                            {!(compact || compactMode) && summary.imageUrl && (
                              <View
                                justifyCenter
                                width={ '20%' }>
                                <Menu
                                  autoAnchor={ (
                                    <Image
                                      source={ { uri: summary.imageUrl } }  
                                      rounded
                                      aspectRatio={ 1 } />
                                  ) }>
                                  <Text>This image was generated using AI and is not a real photo of a real event, place, thing, or person.</Text>
                                </Menu>
                              </View>
                            )}
                            <View row alignCenter>
                              {showShareDialog || keywords.length === 0 ? (
                                <Text 
                                  bold
                                  justifyCenter
                                  subtitle1
                                  color={ !initialFormat && !showShareDialog && readSummaries?.[summary.id] ? theme.colors.textDisabled : theme.colors.text }>
                                  {(compact || compactMode && showShortSummary) ? summary.shortSummary : summary.title}
                                </Text>
                              ) : (
                                <Highlighter
                                  bold
                                  subtitle1
                                  justifyCenter
                                  highlightStyle={ { backgroundColor: 'yellow', color: theme.colors.textDark } }
                                  searchWords={ keywords }
                                  textToHighlight={ summary.title } />
                              )}
                            </View>
                          </View>
                        </View>
                      </View>
                    </View>
                  </View>
                  {!(compact || compactMode) && showShortSummary === true && (
                    <View row>
                      <Divider />
                      {(showShareDialog || keywords.length === 0) ? <Text>{summary.shortSummary}</Text> : (
                        <Highlighter 
                          highlightStyle={ { backgroundColor: 'yellow', color: theme.colors.textDark } }
                          searchWords={ keywords }
                          textToHighlight={ summary.shortSummary ?? '' } />
                      )}
                    </View>
                  )}
                  {!(compact || compactMode) && (
                    <View row alignCenter gap={ 12 }>
                      <Button 
                        elevated
                        rounded
                        alignCenter
                        p={ 4 }
                        startIcon={ summary.category.icon && <Icon name={ summary.category.icon } color="text" /> }
                        onPress={ () => openCategory(summary.category) } />
                      <View row>
                        <View gap={ 0 } width="100%">
                          <View row gap={ 6 }>
                            <Text 
                              bold 
                              caption
                              color={ !initialFormat && !showShareDialog && readSummaries?.[summary.id] ? theme.colors.textDisabled : theme.colors.text }>
                              {`${timeAgo} from`}
                            </Text>
                          </View>
                          <Text 
                            row
                            numberOfLines={ 1 }
                            underline
                            rounded
                            caption
                            color={ !initialFormat && !showShareDialog && readSources?.[summary.id] ? theme.colors.textDisabled : theme.colors.text }
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
                            onPress={ () => onInteract?.(InteractionType.Bookmark) } />
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
                  )}
                </View>
              </View>
              {initialFormat && <Divider />}
              {initialFormat && (
                <CollapsedView 
                  startCollapsed={ false }
                  indent={ 0 }
                  title={ (
                    <Text subtitle1>Summary/Bullets</Text>
                  ) }>
                  {content && (
                    <View gap={ 12 }>
                      <ReadingFormatSelector 
                        format={ format } 
                        preferredFormat={ preferredReadingFormat }
                        onChange={ handleFormatChange } />
                      <View>
                        {showShareDialog || keywords.length === 0 ? (
                          <Text>{content}</Text>
                        ) : (
                          <Highlighter 
                            highlightStyle={ { backgroundColor: 'yellow', color: theme.colors.textDark } }
                            searchWords={ keywords }
                            textToHighlight={ content } />
                        )}
                      </View>
                    </View>
                  )}
                </CollapsedView>
              )}
              {initialFormat && summary.sentiments && (
                <CollapsedView startCollapsed={ false } title={ 'Analytics' }>
                  <AnalyticsView sentiments={ Object.values(summary.sentiments) } />
                </CollapsedView>
              )}
            </View>
          </View>
        </ViewShot>
      </Swipeable>
    </GestureHandlerRootView>
  );
}
