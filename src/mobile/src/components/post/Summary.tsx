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
  useSearch,
  useShare,
  useTheme,
} from '~/hooks';
import { averageOfSentiments } from '~/utils';

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
    displayName: 'Category', icon: 'popcorn', name: '', sentiment: 0.1,
  },
  categoryId: -1,
  formats: [],
  id: 1,
  imageUrl: 'https://readless.nyc3.cdn.digitaloceanspaces.com/img/s/01084930-e927-11ed-a438-a9ea5ed3eb49.jpg',
  originalTitle: '',
  outlet: {
    displayName: 'News Source', id: -1, name: '', sentiment: 0.1, 
  },
  outletId: -1,
  sentiments: {
    chatgpt: {
      id: 0, method: 'chatgpt', parentId: 0, score: 0.1, tokens: [{
        id:0, parentId:0, text: 'token', 
      }],
    },
  },
  shortSummary: 'This is a short 30-40 word summary that can appear under titles if you set it to show in the settings (this will appear instead of titles when in headline mode)',
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
  onInteract,
}: Props) {

  const { openURL } = useInAppBrowser();
  const { openOutlet, openCategory } = useSearch();
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
  const [collapseSummary, setCollapseSummary] = React.useState(Boolean(collapsed));
  const [collapseAnalytics, setCollapseAnalytics] = React.useState(Boolean(collapsed));

  const isRead = React.useMemo(() => !disableInteractions && Boolean(readSummaries?.[summary.id]) && !initialFormat &&!showShareDialog, [disableInteractions, initialFormat, readSummaries, showShareDialog, summary.id]);
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
            onPress={ !initialFormat ? () => handleFormatChange(preferredReadingFormat ?? ReadingFormat.Summary) : undefined }
            gap={ 3 }>
            <View row gap={ 12 }>
              <View col width="100%">
                <View col gap={ 12 }>
                  <View>
                    <View row alignCenter gap={ 6 }>
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
                    <View row gap={ 16 }>
                      {!(compact || compactMode) && summary.imageUrl && (
                        <View
                          justifyCenter
                          width={ isRead ? '15%' : '20%' }
                          gap={ 6 }>
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
                      <View row>
                        {showShareDialog || keywords.length === 0 ? (
                          <Text 
                            bold
                            justifyCenter
                            subtitle1
                            color={ !showShareDialog && readSummaries?.[summary.id] ? theme.colors.textDisabled : theme.colors.text }>
                            {(compact || compactMode && showShortSummary) ? summary.shortSummary : summary.title}
                          </Text>
                        ) : (
                          <Markdown 
                            bold
                            subtitle1
                            styles={ {
                              em: { 
                                backgroundColor: 'yellow',
                                color: 'black',
                                flexDirection: 'row',
                                flexGrow: 1,
                              }, 
                            } }>
                            {markdown((compact || compactMode && showShortSummary) ? summary.shortSummary : summary.title )}
                          </Markdown>
                        )}
                      </View>
                    </View>
                  </View>
                  <View col />
                </View>
              </View>
            </View>
            {!(compact || compactMode) && showShortSummary === true && (
              <View row>
                <Divider />
                {(showShareDialog || keywords.length === 0) ? <Text>{summary.shortSummary}</Text> : (
                  <Markdown 
                    bold
                    subtitle1
                    styles={ {
                      em: { 
                        backgroundColor: 'yellow',
                        color: 'black', 
                        flexDirection: 'row',
                        flexGrow: 1, 
                      }, 
                    } }>
                    {markdown(summary.shortSummary ?? '')}
                  </Markdown>
                )}
              </View>
            )}
            {!(compact || compactMode) && (
              <React.Fragment>
                <Divider />
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
                          color={ !showShareDialog && readSummaries?.[summary.id] ? theme.colors.textDisabled : theme.colors.text }>
                          {`${timeAgo} from`}
                        </Text>
                      </View>
                      <Text 
                        row
                        numberOfLines={ 1 }
                        underline
                        rounded
                        caption
                        color={ !showShareDialog && readSources?.[summary.id] ? theme.colors.textDisabled : theme.colors.text }
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
                    sentiments={ Object.values(summary.sentiments) } />
                )}
              </View>
            )}
          </View>
        </ViewShot>
      </Swipeable>
    </GestureHandlerRootView>
  );
}
