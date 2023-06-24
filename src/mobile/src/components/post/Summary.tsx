import React from 'react';

import { useFocusEffect } from '@react-navigation/native';
import { formatDistance } from 'date-fns';
import ms from 'ms';
import { SheetManager } from 'react-native-actions-sheet';
import { GestureHandlerRootView, Swipeable } from 'react-native-gesture-handler';
import { State } from 'react-native-track-player';
import ViewShot from 'react-native-view-shot';

import { 
  InteractionType,
  PublicSummaryGroup,
  PublicSummaryTranslationAttributes,
  ReadingFormat,
} from '~/api';
import {
  ActivityIndicator,
  AnalyticsView,
  Button,
  ChildlessViewProps,
  CollapsedView,
  Divider,
  Highlighter,
  Icon,
  Image,
  MeterDial,
  Popover,
  ReadingFormatPicker,
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
  useStyles,
  useTheme,
} from '~/hooks';
import {
  getFnsLocale,
  getLocale,
  strings,
} from '~/locales';
import { DateSorter, fixedSentiment } from '~/utils';

type Props = ChildlessViewProps & {
  summary?: PublicSummaryGroup;
  tickInterval?: string;
  selected?: boolean;
  initialFormat?: ReadingFormat;
  initiallyTranslated?: boolean;
  keywords?: string[];
  compact?: boolean;
  swipeable?: boolean;
  disableInteractions?: boolean;
  forceSentiment?: boolean;
  hideCard?: boolean;
  hideAnalytics?: boolean;
  onFormatChange?: (format?: ReadingFormat) => void;
  onInteract?: (interaction: InteractionType, content?: string, metadata?: Record<string, unknown>, alternateAction?: () => void) => Promise<unknown>;
  onLocalize?: (translations: PublicSummaryTranslationAttributes[]) => void;
  onToggleTranslate?: (onOrOff: boolean) => void;
};

type RenderAction = {
  text: string;
  leftIcon?: string;
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
        flex={ 1 }
        flexGrow={ 1 }
        justifyEvenly
        p={ 6 }
        mr={ 18 }
        my={ 12 }
        gap={ 6 }>
        {actions.map((action) => (
          <View
            key={ action.text }
            flexGrow={ 1 }
            flex={ 1 }>
            <Button 
              gap={ 6 }
              contained
              caption
              leftIcon={ action.leftIcon }
              onPress={ action.onPress }>
              {action.text}
            </Button>
          </View>
        ))}
      </View>
    </View>
  );
}

const DEFAULT_PROPS: { summary: PublicSummaryGroup } = {
  summary: {
    bullets: [
      strings.summary_example_bullet1,
      strings.summary_example_bullet2,
      strings.summary_example_bullet3,
      strings.summary_example_bullet4,
      strings.summary_example_bullet5,
    ],
    category: {
      displayName: 'Entertainment',
      icon: 'popcorn',
      name: 'entertainment',
    },
    categoryId: 0,
    id: 0,
    imageUrl: 'https://readless.nyc3.digitaloceanspaces.com/img/s/02df6070-0963-11ee-81c0-85b89936402b.jpg',
    media: [],
    originalDate: new Date(Date.now() - ms('5m')).toISOString(),
    originalTitle: '',
    outlet: {
      displayName: strings.misc_newsSource,
      name: '',
    },
    outletId: 0,
    sentiment: 0.3,
    sentiments: [{
      method: 'openai',
      score: 0.3,
    }],
    shortSummary: strings.summary_example_shortSummary,
    siblings: [],
    summary: [strings.summary_example_summary, strings.summary_example_summary, strings.summary_example_summary].join('\n'),
    title: strings.summary_example_title,
    translations: [],
    url: 'https://readless.ai',
  },
};

export function Summary({
  summary: summary0,
  tickInterval = '2m',
  selected,
  initialFormat,
  initiallyTranslated = true,
  keywords = [],
  compact = false,
  swipeable = Boolean(summary0),
  disableInteractions = !summary0,
  forceSentiment,
  hideCard,
  hideAnalytics,
  onFormatChange,
  onInteract,
  onLocalize,
  onToggleTranslate,
  ...props
}: Props) {

  const { openURL } = useInAppBrowser();
  const {
    openOutlet, openCategory, openSummary, 
  } = useNavigation();
  const { copyToClipboard } = useShare({ onInteract });
  const { localizeSummary } = useServiceClient();

  const theme = useTheme();
  const style = useStyles(props);

  const {
    compactMode,
    showShortSummary,
    preferredReadingFormat, 
    sourceLinks,
    sentimentEnabled,
    triggerWords,
    bookmarkedSummaries,
    readSummaries,
    readSources,
    setPreference,
  } = React.useContext(SessionContext);

  const { shareTarget } = React.useContext(DialogContext);
  const {
    trackState, queueSummary, currentTrack, stopAndClearTracks,
  } = React.useContext(MediaContext);
  
  const summary = React.useMemo((() => summary0 ?? DEFAULT_PROPS.summary), [summary0]);
  const viewshot = React.useRef<ViewShot | null>(null);

  const [lastTick, setLastTick] = React.useState(new Date());
  const [isShareTarget, setIsShareTarget] = React.useState(summary.id === shareTarget?.id);
  const [isBookmarked, setIsBookmarked] = React.useState(Boolean(bookmarkedSummaries?.[summary.id]));
  const [isRead, setIsRead] = React.useState(Boolean(readSummaries?.[summary.id]) && !initialFormat && !disableInteractions && !isShareTarget);
  const [isSourceRead, setIsSourceRead] = React.useState(Boolean(readSources?.[summary.id]) && !initialFormat && !disableInteractions && !isShareTarget);
  const [isSiblingRead, setIsSiblingRead] = React.useState(Object.fromEntries(summary.siblings?.map((s) => [s.id, Boolean(readSummaries?.[s.id])]) ?? []));
  const [isPlayingAudio, setIsPlayingAudio] = React.useState(trackState === State.Playing && currentTrack?.id === ['summary', summary.id].join('-'));

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
  
  const containsTrigger = React.useMemo(() => {
    return Object.keys({ ...triggerWords }).some((word) => {
      const expr = new RegExp(word, 'i');
      return Object.values(localizedStrings).some((s) => expr.test(s));
    });
  }, [localizedStrings, triggerWords]);
  
  const cleanString = React.useCallback((str: string) => {
    for (const [word, repl] of Object.entries({ ...triggerWords })) {
      str = str.replace(new RegExp(word, 'ig'), repl);
    }
    return str;
  }, [triggerWords]);

  // update time ago every `tickIntervalMs` milliseconds
  useFocusEffect(React.useCallback(() => {
    const interval = setInterval(() => {
      setLastTick(new Date());
    }, ms(tickInterval));
    const isShareTarget = summary.id === shareTarget?.id;
    setIsShareTarget(isShareTarget);
    setTranslations(summary.translations && summary.translations.length > 0 ? Object.fromEntries((summary.translations).map((t) => [t.attribute, t.value])) : undefined);
    setShowTranslations(initiallyTranslated && Boolean(summary.translations));
    setIsBookmarked(Boolean(bookmarkedSummaries?.[summary.id]));
    setIsRead(Boolean(readSummaries?.[summary.id]) && !initialFormat && !disableInteractions && !isShareTarget);
    setIsSourceRead(Boolean(readSources?.[summary.id]) && !initialFormat && !disableInteractions && !isShareTarget);
    setIsSiblingRead(Object.fromEntries(summary.siblings?.map((s) => [s.id, Boolean(readSummaries?.[s.id])]) ?? []));
    setIsPlayingAudio(trackState === State.Playing && currentTrack?.id === ['summary', summary.id].join('-'));
    return () => clearInterval(interval);
  }, [bookmarkedSummaries, currentTrack?.id, disableInteractions, initialFormat, initiallyTranslated, readSources, readSummaries, shareTarget?.id, summary.id, summary.siblings, summary.translations, tickInterval, trackState]));

  const handleFormatChange = React.useCallback((newFormat?: ReadingFormat) => {
    if (!initialFormat && !disableInteractions && !isShareTarget) {
      onFormatChange?.(newFormat);
      setIsRead(true);
      return;
    }
    onFormatChange?.(newFormat);
    setFormat(newFormat);
  }, [disableInteractions, initialFormat, isShareTarget, onFormatChange]);

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
  
  const sourceLink = React.useMemo(() => {
    return (
      <Text
        flex={ 1 }
        flexRow
        numberOfLines={ 1 }
        underline
        caption
        color={ !initialFormat && !isShareTarget && isSourceRead ? theme.colors.textDisabled : theme.colors.text }
        onPress={ () => {
          if (disableInteractions) {
            return;
          }
          onInteract?.(InteractionType.Read, 'original source', { url: summary.url }, () => openURL(summary.url));
          setIsSourceRead(true);
        } }
        onLongPress={ () => copyToClipboard(summary.url) }>
        {summary.url}
      </Text>
    );
  }, [initialFormat, isShareTarget, isSourceRead, theme.colors.textDisabled, theme.colors.text, disableInteractions, onInteract, summary.url, openURL, copyToClipboard]);
  
  const menuActions = React.useMemo(() => {
    return (
      <View
        overflow="hidden"
        flexRow={ !initialFormat }
        flexGrow={ !initialFormat ? 1 : undefined }
        gap={ 6 }
        mx={ !(compact || compactMode) ? 12 : 0 }>
        {(!(compact || compactMode) && (!summary.siblings || summary.siblings.length === 0)) && (initialFormat || sourceLinks) && sourceLink}
        <View 
          flexRow
          flexGrow={ !sourceLinks ? 1 : undefined }
          itemsCenter
          justifyEnd
          gap={ 6 }>
          <Button
            h4
            haptic
            color='text'
            leftIcon={ isBookmarked ? 'bookmark' : 'bookmark-outline' }
            onPress={ () => !disableInteractions && onInteract?.(InteractionType.Bookmark) } />
          <Button
            h4
            touchable
            color='text'
            leftIcon='share-outline'
            onPress={ async () => {
              if (disableInteractions) {
                return;
              }
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
            leftIcon={ isPlayingAudio ? 'stop' : 'volume-source' }
            onPress={ () => !disableInteractions && handlePlayAudio() } />
        </View>
      </View>
    );
  }, [initialFormat, compact, compactMode, summary, sourceLinks, sourceLink, isBookmarked, isPlayingAudio, disableInteractions, onInteract, format, handlePlayAudio]);
  
  const timestamp = React.useMemo(() => {
    return (
      <View flex={ 1 } flexGrow={ 1 }>
        <Text 
          bold 
          adjustsFontSizeToFit
          caption>
          {formatTime(summary.originalDate)}
        </Text>
      </View>
    );
  }, [formatTime, summary.originalDate]);
  
  const sentimentMeter = React.useMemo(() => {
    return (
      <View flexRow gap={ 3 }>
        <Text
          caption
          adjustsFontSizeToFit>
          { fixedSentiment(summary.sentiment) }
        </Text>
        <MeterDial 
          value={ summary.sentiment }
          width={ 40 } />
      </View>
    );
  }, [summary.sentiment]);
  
  const header = React.useMemo(() => (
    <View 
      p={ initialFormat ? 12 : 6 }
      flexGrow={ 1 }
      elevated
      brTopLeft={ initialFormat ? 0 : 6 }
      brTopRight={ initialFormat ? 0 : 6 }
      zIndex={ 2 }
      inactive={ isRead }>
      <View
        flexRow
        flexGrow={ 1 }
        itemsCenter
        gap={ 6 }>
        {!initialFormat ? (
          <React.Fragment>
            <Button 
              h5
              leftIcon={ summary.category.icon && summary.category.icon }
              onPress={ () => !disableInteractions && openCategory(summary.category) } />
            <Text
              italic
              adjustsFontSizeToFit
              onPress={ () => !disableInteractions && openOutlet(summary.outlet) }>
              {summary.outlet.displayName}
            </Text>
            {timestamp}
            {(forceSentiment || sentimentEnabled) && sentimentMeter}
          </React.Fragment>
        ) : (
          <React.Fragment>
            <View 
              flexGrow={ 1 }
              justifyCenter
              itemsCenter
              gap={ 3 }>
              {sentimentMeter}
              {timestamp}
            </View>
            <View row />
            <View gap={ 3 }>
              <Button 
                gap={ 3 }
                contained
                justifyBetween
                adjustsFontSizeToFit
                px={ 12 }
                leftIcon={ summary.category.icon && summary.category.icon }
                rightIcon="chevron-right"
                onPress={ () => !disableInteractions && openCategory(summary.category) }>
                {summary.category.displayName}
              </Button>
              <Button
                contained
                justifyBetween
                gap={ 3 }
                rightIcon="chevron-right"
                px={ 12 }
                adjustsFontSizeToFit
                onPress={ () => !disableInteractions && openOutlet(summary.outlet) }>
                {summary.outlet.displayName}
              </Button>
            </View>
          </React.Fragment>
        )}
        {((compact || compactMode) && !initialFormat && (
          <Popover
            menu
            anchor={ <Icon name="dots-horizontal" color={ theme.colors.contrastText } size={ 24 } /> }>
            {menuActions}
          </Popover>
        ))}
      </View>
    </View>
  ), [isRead, theme.colors.contrastText, initialFormat, summary.category, summary.outlet, timestamp, forceSentiment, sentimentEnabled, sentimentMeter, compact, compactMode, menuActions, disableInteractions, openCategory, openOutlet]);

  const renderRightActions = React.useCallback(() => {
    const actions = [{
      leftIcon: isRead ? 'email-mark-as-unread' : 'email-open',
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
      text: isRead ? strings.summary_markAsUnRead : strings.summary_markAsRead,
    }, {
      leftIcon: 'eye-off',
      onPress: () => {
        onInteract?.(InteractionType.Hide, undefined, undefined, () => {
          setPreference('removedSummaries', (prev) => ({
            ...prev,
            [summary.id]: true,
          }));
        });
      },
      text: strings.summary_hide,
    }, {
      leftIcon: 'bug',
      onPress: () => { 
        onInteract?.(InteractionType.Feedback, undefined, undefined, () => {
          SheetManager.show('feedback', { payload: { summary } });
        });
      },
      text: strings.summary_reportAtBug,
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
              {strings.summary_translate}
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
            {showTranslations ? strings.summary_showOriginalText : strings.summary_showTranslatedText}
          </Text>
        )}
      </View>
    );
  }, [translations, isLocalizing, handleLocalizeSummary, showTranslations]);

  const siblingCards = React.useMemo(() => {
    return (
      <View gap={ 6 }>
        {[...(summary.siblings ?? [])].sort((a, b) => DateSorter(b.originalDate, a.originalDate)).map((sibling) => (
          <View key={ sibling.id }>
            <View
              gap={ 1 }
              p={ 3 }
              outlined
              rounded
              borderColor={ !isShareTarget && isSiblingRead[sibling.id] ? theme.colors.textDisabled : theme.colors.text }
              touchable
              onPress={ () => !disableInteractions && openSummary({ summary: sibling.id }) }>
              <View 
                flexRow
                gap={ 6 }
                itemsCenter>
                <Text 
                  italic
                  adjustsFontSizeToFit
                  color={ !isShareTarget && isSiblingRead[sibling.id] ? theme.colors.textDisabled : theme.colors.text }>
                  {sibling.outlet.displayName}
                </Text>
                <Text 
                  bold 
                  adjustsFontSizeToFit
                  caption 
                  color={ !isShareTarget && isSiblingRead[sibling.id] ? theme.colors.textDisabled : theme.colors.text }
                  numberOfLines={ 1 }>
                  {formatTime(sibling.originalDate)}
                </Text>
              </View>
              <Highlighter 
                bold 
                numberOfLines={ 1 }
                color={ !isShareTarget && isSiblingRead[sibling.id] ? theme.colors.textDisabled : theme.colors.text }
                highlightStyle={ { backgroundColor: 'yellow', color: theme.colors.textDark } }
                searchWords={ isShareTarget ? [] : keywords }>
                { cleanString(sibling.title) }
              </Highlighter>
            </View>
          </View>
        ))}
      </View>
    );
  }, [summary.siblings, isShareTarget, isSiblingRead, theme.colors.textDisabled, theme.colors.text, theme.colors.textDark, disableInteractions, formatTime, keywords, cleanString, openSummary]);

  const coverContent = React.useMemo(() => (
    <View>
      <View row>
        {(!(compact || compactMode) || initialFormat) && summary.imageUrl && (
          <View
            justifyCenter
            flexGrow={ 1 }
            relative
            maxWidth={ initialFormat ? 200 : 128 }
            width={ initialFormat ? '40%' : '30%' }>
            <Popover
              onPress={ () => !disableInteractions && !initialFormat && handleFormatChange() }
              longPress
              anchor={ (
                <View
                  top={ -6 }
                  mb={ 12 }
                  minHeight={ 80 }
                  height="100%"
                  overflow='hidden'
                  brTopLeft={ initialFormat ? 0 : 6 }
                  brBottomLeft={ initialFormat ? 0 : 6 }>
                  {containsTrigger ? (
                    <Icon
                      name="cancel"
                      absolute
                      zIndex={ 20 } 
                      size={ 120 } />
                  ) : (
                    <Image
                      flex={ 1 }
                      flexGrow={ 1 }
                      source={ { uri: summary.imageUrl } } />
                  )}
                </View>
              ) }>
              <View width={ 300 } p={ 12 } gap={ 6 }>
                <Text caption>{strings.summary_thisIsNotARealImage}</Text>
                <View
                  mx={ -12 }
                  mb={ -12 }>
                  <Image
                    source={ { uri: summary.imageUrl } }  
                    aspectRatio={ 1 }
                    width={ 300 } />
                </View>
              </View>
            </Popover>
          </View>
        )}
        <View
          flex={ 1 }
          flexGrow={ 1 }
          gap={ 6 }
          pb={ 12 }>
          <View flex={ 1 } flexGrow={ 1 } mx={ 12 }>
            <View flexRow flexGrow={ 1 }>
              <Highlighter
                bold
                subtitle1={ Boolean(!(compact || compactMode) || initialFormat) }
                body1={ (compact || compactMode) && !initialFormat }
                justifyCenter
                color={ !initialFormat && !isShareTarget && isRead ? theme.colors.textDisabled : theme.colors.text }
                highlightStyle={ { backgroundColor: 'yellow', color: theme.colors.textDark } }
                searchWords={ isShareTarget ? [] : keywords }>
                {cleanString(((compact || compactMode) && showShortSummary && !initialFormat) ? localizedStrings.shortSummary : localizedStrings.title) }
              </Highlighter>
            </View>
            {translateToggle}
            {((!(compact || compactMode) && showShortSummary === true) || initialFormat) && (
              <View pb={ 12 }>
                <Divider />
                <Highlighter 
                  highlightStyle={ { backgroundColor: 'yellow', color: theme.colors.textDark } }
                  searchWords={ isShareTarget ? [] : keywords }>
                  { cleanString(localizedStrings.shortSummary ?? '') }
                </Highlighter>
              </View>
            )}
          </View>
          {(((!(compact || compactMode) || initialFormat) && (!summary.siblings || summary.siblings.length === 0)) ? menuActions : (sourceLinks || initialFormat) && (<View mx={ 12 }>{sourceLink}</View>))}
          {summary.siblings && summary.siblings.length > 0 && (
            <View mx={ 12 } gap={ 6 }>
              <View flexRow>
                <Text justifyCenter>
                  {`${strings.summary_relatedNews} (${summary.siblings.length})`}
                </Text>
                <View row />
                {menuActions}
              </View>
              {summary.siblings.length === 1 ? 
                siblingCards : (
                  <ScrollView height={ summary.siblings.length === 1 ? 45 : 70 }>
                    {siblingCards}
                  </ScrollView>
                )}
            </View>
          )}
        </View>
      </View>
    </View>
  ), [compact, compactMode, initialFormat, summary.imageUrl, summary.siblings, containsTrigger, isShareTarget, isRead, theme.colors.textDisabled, theme.colors.text, theme.colors.textDark, keywords, cleanString, showShortSummary, localizedStrings.shortSummary, localizedStrings.title, translateToggle, menuActions, sourceLinks, sourceLink, siblingCards, disableInteractions, handleFormatChange]);
  
  return (
    <GestureHandlerRootView>
      <Swipeable
        enabled={ swipeable && !disableInteractions && !initialFormat && !isShareTarget }
        renderRightActions={ renderRightActions }>
        <ViewShot ref={ viewshot }>
          <View 
            flexGrow={ 1 }
            elevated
            style={ { ...theme.components.card, ...style } }
            borderRadius={ initialFormat ? 0 : 6 }
            my={ 6 }
            ml={ initialFormat ? undefined : 12 }
            mr={ initialFormat ? undefined : 12 }
            bg={ containsTrigger ? '#eecccc' : undefined }
            onPress={ !initialFormat ? () => handleFormatChange(preferredReadingFormat ?? ReadingFormat.Summary) : undefined }>
            <View flexGrow={ 1 }>
              {!hideCard && (
                <View flexRow flexGrow={ 1 }>
                  {!initialFormat && !isShareTarget && selected && (
                    <View
                      left={ 0 }
                      top={ 0 }
                      width={ 12 }
                      bg={ theme.colors.primary } />
                  )}
                  <View
                    flex={ 1 }
                    flexGrow={ 1 }
                    gap={ 6 }
                    overflow='hidden'
                    brTopLeft={ initialFormat ? 0 : 6 }
                    brTopRight={ initialFormat ? 0 : 6 }>
                    {header}
                    {coverContent}
                  </View>
                </View>
              )}
              {initialFormat && (
                <CollapsedView 
                  disabled={ hideCard }
                  initiallyCollapsed={ false }
                  title={ (
                    <ReadingFormatPicker
                      my={ -12 }
                      elevated={ false }
                      format={ format } 
                      preferredFormat={ preferredReadingFormat }
                      onChange={ handleFormatChange } />
                  ) }>
                  {content && (
                    <View gap={ 6 } pb={ 12 }>
                      {translateToggle}
                      <View gap={ 12 } p={ 12 }>
                        {content.split('\n').map((content, i) => (                         
                          <View
                            key={ `${content}-${i}` }
                            itemsCenter
                            gap={ 12 }
                            flexRow>
                            {format === 'bullets' && (
                              <Icon
                                name="circle"
                                size={ 24 }
                                flexRow
                                flex={ 1 } />
                            )}
                            <Highlighter 
                              flex={ format === 'bullets' ? 9 : 1 }
                              flexRow
                              highlightStyle={ { backgroundColor: 'yellow', color: theme.colors.textDark } }
                              searchWords={ isShareTarget ? [] : keywords }>
                              { cleanString(content) }
                            </Highlighter>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}
                </CollapsedView>
              )}
              {!hideAnalytics && initialFormat && summary.sentiment && (
                <AnalyticsView
                  initiallyCollapsed
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
