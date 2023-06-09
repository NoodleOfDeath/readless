import React from 'react';

import { useFocusEffect } from '@react-navigation/native';
import { formatDistance } from 'date-fns';
import ms from 'ms';
import { SheetManager } from 'react-native-actions-sheet';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { List } from 'react-native-paper';
import { State } from 'react-native-track-player';
import ViewShot from 'react-native-view-shot';

import { 
  InteractionType,
  PublicSummaryGroups,
  PublicSummaryTranslationAttributes,
  ReadingFormat,
} from '~/api';
import {
  ActivityIndicator,
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
  ScrollView,
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
  useServiceClient,
  useShare,
  useTheme,
} from '~/hooks';
import {
  getFnsLocale,
  getLocale,
  strings,
} from '~/locales';
import { DateSorter, fixedSentiment } from '~/utils';

type Props = {
  summary: PublicSummaryGroups;
  tickInterval?: string;
  selected?: boolean;
  initialFormat?: ReadingFormat;
  initiallyTranslated?: boolean;
  keywords?: string[];
  compact?: boolean;
  swipeable?: boolean;
  disableInteractions?: boolean;
  showAnalytics?: boolean;
  onFormatChange?: (format?: ReadingFormat) => void;
  onInteract?: (interaction: InteractionType, content?: string, metadata?: Record<string, unknown>, alternateAction?: () => void) => Promise<unknown>;
  onLocalize?: (translations: PublicSummaryTranslationAttributes[]) => void;
  onToggleTranslate?: (onOrOff: boolean) => void;
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
      <View 
        col
        justifyEvenly
        p={ 6 }
        mr={ 18 }
        mb={ 12 }
        gap={ 6 }>
        {actions.map((action) => (
          <View
            key={ action.text }
            flexGrow={ 1 }
            flex={ 1 }>
            <Button 
              row
              rounded
              outlined
              flexGrow={ 1 }
              flex={ 1 }
              gap={ 6 }
              ph={ 4 }
              alignCenter
              justifyCenter
              caption
              startIcon={ action.startIcon }
              onPress={ action.onPress }>
              {action.text}
            </Button>
          </View>
        ))}
      </View>
    </View>
  );
}

export function Summary({
  summary,
  tickInterval = '2m',
  selected,
  initialFormat,
  initiallyTranslated = true,
  keywords = [],
  compact = false,
  swipeable = true,
  disableInteractions = false,
  showAnalytics = false,
  onFormatChange,
  onInteract,
  onLocalize,
  onToggleTranslate,
}: Props) {

  const { openURL } = useInAppBrowser();
  const {
    openOutlet, openCategory, openSummary, 
  } = useNavigation();
  const { copyToClipboard } = useShare({ onInteract });
  const { localizeSummary } = useServiceClient();

  const theme = useTheme();

  const {
    compactMode,
    showShortSummary,
    preferredReadingFormat, 
    bookmarkedSummaries,
    readSummaries,
    readSources,
    setPreference, 
  } = React.useContext(SessionContext);

  const { shareTarget } = React.useContext(DialogContext);
  const {
    trackState, queueSummary, currentTrack, stopAndClearTracks,
  } = React.useContext(MediaContext);
  
  const viewshot = React.useRef<ViewShot | null>(null);

  const [lastTick, setLastTick] = React.useState(new Date());
  const [isShareTarget, setIsShareTarget] = React.useState(summary.id === shareTarget?.id);
  const [isRead, setIsRead] = React.useState(Boolean(readSummaries?.[summary.id]) && !initialFormat && !disableInteractions && !isShareTarget);
  const [isSiblingRead, setIsSiblingRead] = React.useState(Object.fromEntries(summary.siblings?.map((s) => [s.id, Boolean(readSummaries?.[s.id])]) ?? []));
  const [sourceIsRead, setSourceIsRead] = React.useState(Boolean(readSources?.[summary.id]) && !initialFormat && !disableInteractions && !isShareTarget);

  const [format, setFormat] = React.useState<ReadingFormat | undefined>(initialFormat);
  const [translations, setTranslations] = React.useState<Record<string, string> | undefined>(summary.translations && summary.translations.length > 0 ? Object.fromEntries((summary.translations).map((t) => [t.attribute, t.value])) : undefined);
  const [showTranslations, setShowTranslations] = React.useState(initiallyTranslated && Boolean(translations));
  const [isLocalizing, setIsLocalizing] = React.useState(false);

  const localizedStrings = React.useMemo(() => {
    return showTranslations && translations ? translations : {
      bullets: summary.bullets.join('\n'),
      shortSummary: summary.shortSummary,
      summary: summary.summary,
      title: summary.title,
    };
  }, [showTranslations, summary.bullets, summary.shortSummary, summary.summary, summary.title, translations]);

  const bookmarked = React.useMemo(() => Boolean(bookmarkedSummaries?.[summary.id]), [bookmarkedSummaries, summary]);
  
  const playingAudio = React.useMemo(() => trackState === State.Playing && currentTrack?.id === ['summary', summary.id].join('-'), [currentTrack?.id, summary.id, trackState]);

  const formatTime = React.useCallback((time?: string) => {
    if (!time) {
      return null;
    }
    return formatDistance(new Date(time ?? 0), lastTick, { addSuffix: true, locale: getFnsLocale() });
  }, [lastTick]);
  
  const content = React.useMemo(() => {
    if (!format) {
      return;
    }
    let content = localizedStrings.summary;
    if (format === 'bullets') {
      content = localizedStrings.bullets.replace(/•\s*/g, '');
    }
    return content;
  }, [format, localizedStrings.bullets, localizedStrings.summary]);

  // update time ago every `tickIntervalMs` milliseconds
  useFocusEffect(React.useCallback(() => {
    const interval = setInterval(() => {
      setLastTick(new Date());
    }, ms(tickInterval));
    const isShareTarget = summary.id === shareTarget?.id;
    setIsShareTarget(isShareTarget);
    setTranslations(summary.translations && summary.translations.length > 0 ? Object.fromEntries((summary.translations).map((t) => [t.attribute, t.value])) : undefined);
    setShowTranslations(initiallyTranslated && Boolean(summary.translations));
    setIsRead(Boolean(readSummaries?.[summary.id]) && !initialFormat && !disableInteractions && !isShareTarget);
    setSourceIsRead(Boolean(readSources?.[summary.id]) && !initialFormat && !disableInteractions && !isShareTarget);
    setIsSiblingRead(Object.fromEntries(summary.siblings?.map((s) => [s.id, Boolean(readSummaries?.[s.id])]) ?? []));
    return () => clearInterval(interval);
  }, [disableInteractions, initialFormat, initiallyTranslated, readSources, readSummaries, shareTarget, summary.id, summary.siblings, summary.translations, tickInterval]));

  const handleFormatChange = React.useCallback((newFormat?: ReadingFormat) => {
    if (!initialFormat) {
      onFormatChange?.(newFormat);
      setIsRead(true);
      return;
    }
    setFormat(newFormat);
  }, [initialFormat, onFormatChange]);

  const handleLocalizeSummary = React.useCallback(async () => {
    setIsLocalizing(true);
    const { data: localizedSummaries, error } = await localizeSummary(summary, getLocale());
    if (!localizedSummaries || error) {
      console.log(error);
      setIsLocalizing(false);
      return;
    }
    setTranslations(Object.fromEntries(localizedSummaries.rows.map((row) => [row.attribute, row.value])));
    onLocalize?.(localizedSummaries.rows);
    setIsLocalizing(false);
    setShowTranslations(true);
  }, [localizeSummary, onLocalize, summary]);
  
  React.useEffect(() => {
    onToggleTranslate?.(showTranslations);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showTranslations]);
  
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
          const newBookmarks = { ...prev };
          if (isRead || newBookmarks[summary.id]) {
            delete newBookmarks[summary.id];
          } else {
            newBookmarks[summary.id] = new Bookmark(true);
          }
          return (prev = newBookmarks);
        });
        setPreference('readSources', (prev) => {
          const newBookmarks = { ...prev };
          if (isRead || newBookmarks[summary.id]) {
            delete newBookmarks[summary.id];
          } else {
            newBookmarks[summary.id] = new Bookmark(true);
          }
          return (prev = newBookmarks);
        });
      },
      startIcon: isRead ? 'email-mark-as-unread' : 'email-open',
      text: isRead ? strings.summary.markAsUnRead : strings.summary.markAsRead,
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
      text: strings.summary.hide,
    }, {
      onPress: () => { 
        onInteract?.(InteractionType.Feedback, undefined, undefined, () => {
          SheetManager.show('feedback', { payload: { summary } });
        });
      },
      startIcon: 'bug',
      text: strings.summary.reportAtBug,
    }];
    return (
      <RenderActions actions={ actions } />
    );
  }, [isRead, setPreference, onInteract, summary]);
  
  const translateToggle = React.useMemo(() => {
    if (/^en/i.test(getLocale())) {
      return; 
    }
    return (
      <View>
        {!translations && (
          !isLocalizing ? (
            <Text
              caption 
              bold
              underline
              onPress={ handleLocalizeSummary }>
              {strings.summary.translate}
            </Text>
          )
            : (
              <View row>
                <ActivityIndicator animating />
              </View>
            )
        )}
        {translations && (
          <Text
            caption 
            bold
            underline
            onPress={ () => setShowTranslations((prev) => !prev) }>
            {showTranslations ? strings.summary.showOriginalText : strings.summary.showTranslatedText}
          </Text>
        )}
      </View>
    );
  }, [translations, isLocalizing, handleLocalizeSummary, showTranslations]);
  
  return (
    <GestureHandlerRootView>
      <Swipeable 
        enabled={ swipeable && !initialFormat && !disableInteractions }
        renderRightActions={ renderRightActions }>
        <ViewShot ref={ viewshot }>
          <View 
            elevated
            style={ theme.components.card }
            mt={ isShareTarget ? 12 : undefined }
            borderRadius={ initialFormat ? 0 : 12 }
            mb={ 12 }
            ml={ initialFormat ? undefined : 12 }
            mr={ initialFormat ? undefined : 12 }
            inactive={ isRead } 
            onPress={ !initialFormat ? () => handleFormatChange(preferredReadingFormat ?? ReadingFormat.Summary) : undefined }>
            <View col>
              <View row>
                {!initialFormat && !isShareTarget && selected && (
                  <View
                    left={ 0 }
                    top={ 0 }
                    width={ 12 }
                    bg={ theme.colors.primary } />
                )}
                <View
                  col
                  gap={ 6 }
                  overflow='hidden'
                  borderRadiusTL={ initialFormat ? 0 : 12 }
                  borderRadiusTR={ initialFormat ? 0 : 12 }>
                  <View 
                    pv={ initialFormat ? 12 : 6 }
                    ph={ 6 }
                    flexGrow={ 1 }
                    elevated
                    borderRadiusTL={ initialFormat ? 0 : 12 }
                    borderRadiusTR={ initialFormat ? 0 : 12 }
                    zIndex={ 2 }
                    inactive={ isRead }>
                    <View
                      row
                      alignCenter
                      gap={ 6 }>
                      {!initialFormat ? (
                        <React.Fragment>
                          <Button 
                            h5
                            color='text'
                            startIcon={ summary.category.icon && <Icon name={ summary.category.icon } color="text" /> }
                            touchable
                            onPress={ () => openCategory(summary.category) } />
                          <Text
                            italic
                            onPress={ () => openOutlet(summary.outlet) }>
                            {summary.outlet.displayName}
                          </Text>
                        </React.Fragment>
                      ) : (
                        <View gap={ 3 }>
                          <View>
                            <Button 
                              h5
                              gap={ 3 }
                              row
                              outlined
                              alignCenter
                              borderRadius={ 4 }
                              p={ 3 }
                              color='text'
                              startIcon={ summary.category.icon && <Icon name={ summary.category.icon } color="text" /> }
                              touchable
                              onPress={ () => openCategory(summary.category) }>
                              {summary.category.displayName}
                            </Button>
                          </View>
                          <Button
                            italic
                            underline
                            alignCenter
                            outlined
                            p={ 3 }
                            borderColor="black"
                            borderRadius={ 4 }
                            touchable
                            onPress={ () => openOutlet(summary.outlet) }>
                            {summary.outlet.displayName}
                          </Button>
                        </View>
                      )}
                      <View row gap={ 6 }>
                        <Text 
                          bold 
                          caption
                          color={ isRead ? theme.colors.textDisabled : theme.colors.text }>
                          {formatTime(summary.originalDate)}
                        </Text>
                      </View>
                      <Text caption>{ fixedSentiment(summary.sentiment) }</Text>
                      <MeterDial 
                        value={ summary.sentiment }
                        width={ 40 } />
                    </View>
                  </View>
                  <View>
                    <View row>
                      {(!(compact || compactMode) || initialFormat) && summary.imageUrl && (
                        <View
                          justifyCenter
                          flexGrow={ 1 }
                          relative
                          maxWidth={ initialFormat ? 200 : 128 }
                          width={ initialFormat ? '40%' : '30%' }>
                          <Menu
                            width={ 300 }
                            autoAnchor={ (
                              <View
                                mt={ -18 }
                                mb={ 30 }
                                minHeight={ 80 }
                                height="100%"
                                overflow='hidden'
                                borderRadiusTL={ initialFormat ? 0 : 12 }
                                borderRadiusBL={ initialFormat ? 0 : 12 }>
                                <Image
                                  col
                                  fill
                                  source={ { uri: summary.imageUrl } } />
                              </View>
                            ) }>
                            <View
                              gap={ 6 }>
                              <Text caption>{strings.summary.thisIsNotARealImage}</Text>
                              <View
                                mh={ -12 }
                                mb={ -12 }>
                                <Image
                                  source={ { uri: summary.imageUrl } }  
                                  aspectRatio={ 1 } />
                              </View>
                            </View>
                          </Menu>
                        </View>
                      )}
                      <View
                        col
                        gap={ 6 }
                        pb={ (compact || compactMode) ? 12 : 0 }>
                        <View col mh={ 12 }>
                          <View row alignCenter>
                            <Highlighter
                              bold
                              subtitle1
                              justifyCenter
                              color={ !initialFormat && !isShareTarget && isRead ? theme.colors.textDisabled : theme.colors.text }
                              highlightStyle={ { backgroundColor: 'yellow', color: theme.colors.textDark } }
                              searchWords={ isShareTarget ? [] : keywords }
                              textToHighlight={ ((compact || compactMode) && showShortSummary && !initialFormat) ? localizedStrings.shortSummary : localizedStrings.title } />
                          </View>
                          {translateToggle}
                          {((!(compact || compactMode) && showShortSummary === true) || initialFormat) && (
                            <View row>
                              <Divider />
                              <Highlighter 
                                highlightStyle={ { backgroundColor: 'yellow', color: theme.colors.textDark } }
                                searchWords={ isShareTarget ? [] : keywords }
                                textToHighlight={ localizedStrings.shortSummary ?? '' } />
                            </View>
                          )}
                        </View>
                        {summary.siblings && summary.siblings.length > 0 && (
                          <View mh={ 12 } gap={ 6 }>
                            <Text>
                              {`${strings.summary.relatedNews} (${summary.siblings.length})`}
                            </Text>
                            <ScrollView height={ summary.siblings.length === 1 ? 50 : 70 }>
                              <View gap={ 5 }>
                                {[...summary.siblings].sort((a, b) => DateSorter(b.originalDate, a.originalDate)).map((sibling) => (
                                  <View 
                                    key={ sibling.id } 
                                    height={ 50 }>
                                    <View
                                      gap={ 1 }
                                      p={ 3 }
                                      outlined
                                      borderColor={ !isShareTarget && isSiblingRead[sibling.id] ? theme.colors.textDisabled : theme.colors.text }
                                      height={ 50 }
                                      touchable
                                      onPress={ () => openSummary({ summary: sibling.id }) }>
                                      <View 
                                        row 
                                        gap={ 2 }
                                        alignCenter>
                                        <Text 
                                          italic
                                          color={ !isShareTarget && isSiblingRead[sibling.id] ? theme.colors.textDisabled : theme.colors.text }>
                                          {sibling.outlet.displayName}
                                        </Text>
                                        <Text 
                                          bold 
                                          caption 
                                          color={ !isShareTarget && isSiblingRead[sibling.id] ? theme.colors.textDisabled : theme.colors.text }>
                                          {formatTime(sibling.originalDate)}
                                        </Text>
                                      </View>
                                      <Highlighter 
                                        bold 
                                        numberOfLines={ 1 }
                                        color={ !isShareTarget && isSiblingRead[sibling.id] ? theme.colors.textDisabled : theme.colors.text }
                                        highlightStyle={ { backgroundColor: 'yellow', color: theme.colors.textDark } }
                                        searchWords={ isShareTarget ? [] : keywords }
                                        textToHighlight={ sibling.title } />
                                    </View>
                                  </View>
                                ))}
                              </View>
                            </ScrollView>
                          </View>
                        )}
                        {(!(compact || compactMode) || initialFormat) && (
                          <View
                            overflow="hidden"
                            p={ 6 }>
                            <View 
                              row
                              alignCenter
                              gap={ 6 }>
                              <View row>
                                <Text
                                  numberOfLines={ 1 }
                                  underline
                                  caption
                                  color={ !initialFormat && !isShareTarget && sourceIsRead ? theme.colors.textDisabled : theme.colors.text }
                                  onPress={ () => {
                                    onInteract?.(InteractionType.Read, 'original source', { url: summary.url }, () => openURL(summary.url));
                                    setSourceIsRead(true);
                                  } }
                                  onLongPress={ () => copyToClipboard(summary.url) }>
                                  {summary.url}
                                </Text>
                              </View>
                              <Button
                                h4
                                haptic
                                color='text'
                                startIcon={ bookmarked ? 'bookmark' : 'bookmark-outline' }
                                onPress={ () => onInteract?.(InteractionType.Bookmark) } />
                              <Button
                                h4
                                touchable
                                color='text'
                                startIcon='share-outline'
                                onPress={ () => {
                                  SheetManager.show('share', {
                                    payload: {
                                      format,
                                      onInteract, 
                                      summary,
                                      viewshot: viewshot.current,
                                    },
                                  });
                                } } />
                              <Button
                                h4
                                haptic
                                touchable
                                color="text"
                                startIcon={ playingAudio ? 'stop' : 'volume-source' }
                                onPress={ () => handlePlayAudio() } />
                            </View>
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                </View>
              </View>
              {initialFormat && (
                <CollapsedView 
                  initiallyCollapsed={ false }
                  title={ (
                    <ReadingFormatSelector
                      mv={ -12 }
                      elevated={ false }
                      format={ format } 
                      preferredFormat={ preferredReadingFormat }
                      onChange={ handleFormatChange } />
                  ) }>
                  {content && (
                    <View gap={ 6 } pb={ 12 }>
                      {translateToggle}
                      <View gap={ -20 }>
                        {content.split('\n').map((content, i) => (                         
                          <List.Item
                            key={ `${content}-${i}` }
                            left={ (props) => format === 'bullets' ? <List.Icon { ...props } icon="circle" /> : undefined }
                            style={ { padding:0 } }
                            titleStyle={ { margin: 0, padding: 0 } }
                            titleNumberOfLines={ 100 }
                            title={ (
                              <Highlighter 
                                highlightStyle={ { backgroundColor: 'yellow', color: theme.colors.textDark } }
                                numberOfLines={ 100 }
                                searchWords={ isShareTarget ? [] : keywords }
                                textToHighlight={ content } />
                            ) } />
                        ))}
                      </View>
                    </View>
                  )}
                </CollapsedView>
              )}
              {initialFormat && summary.sentiment && (
                <AnalyticsView
                  mb={ 12 }
                  initiallyCollapsed={ !showAnalytics }
                  sentiment={ summary.sentiment }
                  sentiments={ Object.values(summary.sentiments ?? []) } />
              )}
            </View>
          </View>
        </ViewShot>
      </Swipeable>
    </GestureHandlerRootView>
  );
}
