import React from 'react';

import { useFocusEffect } from '@react-navigation/native';
import { formatDistance } from 'date-fns';
import ms from 'ms';
import pluralize from 'pluralize';
import { SheetManager } from 'react-native-actions-sheet';
import { HoldItem } from 'react-native-hold-menu';
import { MenuItemProps } from 'react-native-hold-menu/lib/typescript/components/menu/types';

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
  Chip,
  CollapsedView,
  Highlighter,
  Icon,
  Image,
  MeterDial,
  ReadingFormatPicker,
  ScrollView,
  ScrollViewProps,
  Text,
  View,
} from '~/components';
import { Bookmark, SessionContext } from '~/contexts';
import { useInAppBrowser } from '~/hooks';
import {
  useNavigation,
  useServiceClient,
  useStyles,
  useSummaryClient,
  useTheme,
} from '~/hooks';
import {
  getFnsLocale,
  getLocale,
  strings,
} from '~/locales';
import { fixedSentiment } from '~/utils';

type Props = ChildlessViewProps & ScrollViewProps & {
  big?: boolean;
  summary?: PublicSummaryGroup;
  tickInterval?: string;
  selected?: boolean;
  initialFormat?: ReadingFormat;
  initiallyTranslated?: boolean;
  keywords?: string[];
  compact?: boolean;
  disableInteractions?: boolean;
  forceSentiment?: boolean;
  forceShortSummary?: boolean;
  hideCard?: boolean;
  hideAnalytics?: boolean;
  onFormatChange?: (format?: ReadingFormat) => void;
  onInteract?: (interaction: InteractionType, content?: string, metadata?: Record<string, unknown>, alternateAction?: () => void) => Promise<unknown>;
  onLocalize?: (translations: PublicSummaryTranslationAttributes[]) => void;
  onToggleTranslate?: (onOrOff: boolean) => void;
};

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
    outlet: {
      displayName: strings.misc_publisher,
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
  big = Boolean(initialFormat),
  initiallyTranslated = true,
  keywords = [],
  compact = false,
  disableInteractions = !summary0,
  forceSentiment,
  forceShortSummary: forceShortSummary0,
  hideCard,
  hideAnalytics,
  onFormatChange,
  onInteract,
  onLocalize,
  onToggleTranslate,
  ...props
}: Props) {

  const { openOutlet, openCategory } = useNavigation();
  const { localizeSummary } = useServiceClient();
  const { getSummary } = useSummaryClient();
  const { openURL } = useInAppBrowser();

  const theme = useTheme();
  const style = useStyles(props);

  const {
    compactMode,
    showShortSummary,
    preferredReadingFormat, 
    sentimentEnabled,
    triggerWords,
    readSummaries,
    bookmarkedSummaries,
    bookmarkSummary,
    setPreference,
  } = React.useContext(SessionContext);

  const summary = React.useMemo((() => summary0 ?? DEFAULT_PROPS.summary), [summary0]);

  const [lastTick, setLastTick] = React.useState(new Date());
  const [isRead, setIsRead] = React.useState(summary.id in { ...readSummaries } && !initialFormat && !disableInteractions);
  const [isBookmarked, setIsBookmarked] = React.useState(summary.id in { ...bookmarkedSummaries });
  const [isSentimentEnabled, setIsSentimentEnabled] = React.useState(sentimentEnabled);

  const [format, setFormat] = React.useState<ReadingFormat | undefined>(initialFormat);
  const [translations, setTranslations] = React.useState<Record<string, string> | undefined>(summary.translations && summary.translations.length > 0 ? Object.fromEntries((summary.translations).map((t) => [t.attribute, t.value])) : undefined);
  const [showTranslations, setShowTranslations] = React.useState(initiallyTranslated && Boolean(translations));
  const [isLocalizing, setIsLocalizing] = React.useState(false);

  const [forceShortSummary] = React.useState(showShortSummary || forceShortSummary0);
  
  const localizedStrings = React.useMemo(() => {
    return showTranslations && translations ? translations : {
      bullets: (summary.bullets ?? []).join('\n'),
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
    setTranslations(summary.translations && summary.translations.length > 0 ? Object.fromEntries((summary.translations).map((t) => [t.attribute, t.value])) : undefined);
    setShowTranslations(initiallyTranslated && Boolean(summary.translations));
    setIsRead(Boolean(readSummaries?.[summary.id]) && !initialFormat && !disableInteractions);
    setIsSentimentEnabled(sentimentEnabled);
    return () => clearInterval(interval);
  }, [tickInterval, summary.translations, summary.id, initiallyTranslated, readSummaries, initialFormat, disableInteractions, sentimentEnabled]));

  const handleFormatChange = React.useCallback((newFormat?: ReadingFormat) => {
    if (!initialFormat && !disableInteractions) {
      onFormatChange?.(newFormat);
      setIsRead(true);
      return;
    }
    onFormatChange?.(newFormat);
    setFormat(newFormat);
  }, [disableInteractions, initialFormat, onFormatChange]);

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
  
  const timestamp = React.useMemo(() => {
    return (
      <Text  
        adjustsFontSizeToFit
        color={ theme.colors.textSecondary }
        textCenter
        caption>
        {formatTime(summary.originalDate)}
      </Text>
    );
  }, [formatTime, summary.originalDate, theme.colors.textSecondary]);
  
  const sentimentMeter = React.useMemo(() => {
    return (
      <View flexRow itemsCenter gap={ 3 }>
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

  const title = React.useMemo(() => (
    <Highlighter
      bold
      subtitle2={ Boolean(!(compact || compactMode) && !initialFormat) }
      body1={ (compact || compactMode) && !initialFormat }
      color={ !initialFormat && isRead ? theme.colors.textDisabled : theme.colors.text }
      highlightStyle={ { backgroundColor: theme.colors.textHighlightBackground, color: theme.colors.textDark } }
      searchWords={ keywords }>
      {cleanString(((compact || compactMode) && (showShortSummary || forceShortSummary) && !initialFormat) ? localizedStrings.shortSummary : localizedStrings.title) }
    </Highlighter>
  ), [initialFormat, compact, compactMode, isRead, theme.colors.textDisabled, theme.colors.text, theme.colors.textHighlightBackground, theme.colors.textDark, keywords, cleanString, showShortSummary, forceShortSummary, localizedStrings.shortSummary, localizedStrings.title]);
  
  const header = React.useMemo(() => (
    <View 
      p={ initialFormat ? 12 : 6 }
      flexGrow={ 1 }
      elevated={ Boolean(initialFormat) }
      zIndex={ 2 }
      bg={ theme.colors.headerBackground }>
      <View>
        {!initialFormat ? (
          <View flexRow itemsCenter gap={ 6 }>
            <View
              flexRow
              itemsCenter
              gap={ 6 }
              onPress={ () => !disableInteractions && openOutlet(summary.outlet) }>
              <View
                borderRadius={ 3 }
                overflow="hidden">
                <Image 
                  fallbackComponent={ (
                    <Chip
                      bg={ theme.colors.primaryLight }
                      color={ theme.colors.contrastText }
                      itemsCenter
                      justifyCenter
                      adjustsFontSizeToFit
                      textCenter
                      width={ 20 }
                      height={ 20 }>
                      {summary.outlet.displayName[0]}
                    </Chip>
                  ) }
                  source={ { uri: `https://readless.nyc3.cdn.digitaloceanspaces.com/img/pub/${summary.outlet.name}.png` } }
                  width={ 20 }
                  height={ 20 } />
              </View>
              <Text 
                bold
                caption
                color={ theme.colors.textSecondary }>
                {summary.outlet.displayName}
              </Text>
            </View>
            {timestamp}
            <View row />
            {(forceSentiment || isSentimentEnabled) && sentimentMeter}
          </View>
        ) : (
          <View gap={ 6 }>
            <View flexRow>
              <View flex={ 1 } justifyCenter>
                {title}
              </View>
              <View width={ 120 } itemsCenter justifyCenter>
                {sentimentMeter}
                {timestamp}
              </View>
            </View>
            <View flexRow itemsCenter justifyCenter>
              <View row />
              <View flexRow gap={ 6 }>
                <Button 
                  gap={ 3 }
                  system
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
                  system
                  contained
                  justifyBetween
                  gap={ 3 }
                  rightIcon="chevron-right"
                  px={ 12 }
                  adjustsFontSizeToFit
                  onPress={ () => !disableInteractions && openURL(summary.url) }>
                  {summary.outlet.displayName}
                </Button>
              </View>
            </View>
          </View>
        )}
      </View>
    </View>
  ), [initialFormat, theme.colors.headerBackground, theme.colors.primaryLight, theme.colors.contrastText, theme.colors.textSecondary, summary.outlet, summary.category, summary.url, timestamp, forceSentiment, isSentimentEnabled, sentimentMeter, title, disableInteractions, openOutlet, openCategory, openURL]);
  
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
      <View
        flexRow
        gap={ 6 }
        itemsCenter>
        <Chip
          caption
          color={ theme.colors.textSecondary }
          itemsCenter
          leftIcon={ summary.category.icon }
          gap={ 3 }
          onPress={ () => openCategory(summary.category) }>
          {summary.category.displayName}
        </Chip>
        {summary.siblings && summary.siblings.length > 0 && (
          <React.Fragment>
            <Text
              caption
              color={ theme.colors.textSecondary }>
              •
            </Text>
            <Text
              caption
              color={ theme.colors.textSecondary }>
              {`${summary.siblings.length + 1} ${pluralize(strings.misc_article, summary.siblings.length)}`}
            </Text>
          </React.Fragment>
        )}
      </View>
    );
  }, [openCategory, summary.category, summary.siblings, theme.colors.textSecondary]);
  
  const image = React.useMemo(() => {
    if (compact || compactMode || !summary.imageUrl) {
      return null;
    }
    return (
      <View
        justifyCenter
        flexGrow={ 1 }
        maxWidth={ big ? undefined : 64 }
        mx={ big ? undefined : 12 }>
        <View
          brTopLeft={ big && !initialFormat ? 6 : 0 }
          brTopRight={ big && !initialFormat ? 6 : 0 }
          borderRadius={ big ? undefined : 6 }
          aspectRatio={ big ? 3/1.75 : 1 }
          overflow="hidden"
          zIndex={ 20 }>
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
          {big && (
            <Text 
              subscript
              absolute
              bottom={ 0 }
              left={ 0 }
              right={ 0 }
              color={ theme.colors.textDark }
              bg={ theme.colors.backgroundTranslucent }
              p={ 6 }>
              {strings.summary_thisIsNotARealImage}
            </Text>
          )}
        </View>
      </View>
    );
  }, [compact, compactMode, summary.imageUrl, big, initialFormat, containsTrigger, theme.colors.textDark, theme.colors.backgroundTranslucent]);

  const coverContent = React.useMemo(() => (
    <View flex={ 1 } mb={ 6 }>
      <View row>
        <View
          flex={ 1 }
          flexGrow={ 1 }
          gap={ 6 }
          pb={ 6 }
          pt={ initialFormat ? 12 : undefined }>
          <View flex={ 1 } flexGrow={ 1 } gap={ 6 } mx={ 12 }>
            {!initialFormat && title}
            {translateToggle}
            {((!(compact || compactMode) && (showShortSummary || forceShortSummary) === true) || initialFormat) && (
              <View>
                <Highlighter 
                  highlightStyle={ { backgroundColor: theme.colors.textHighlightBackground, color: theme.colors.textDark } }
                  searchWords={ keywords }>
                  { cleanString(localizedStrings.shortSummary ?? '') }
                </Highlighter>
              </View>
            )}
            {siblingCards}
          </View>
        </View>
        {!(big) && image}
      </View>
    </View>
  ), [initialFormat, title, translateToggle, compact, compactMode, showShortSummary, forceShortSummary, theme.colors.textHighlightBackground, theme.colors.textDark, keywords, cleanString, localizedStrings.shortSummary, siblingCards, big, image]);
  
  const cardBody = React.useMemo(() => (
    <View flexGrow={ 1 }>
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
                    highlightStyle={ { backgroundColor: theme.colors.textHighlightBackground, color: theme.colors.textDark } }
                    searchWords={ keywords }>
                    { cleanString(content) }
                  </Highlighter>
                </View>
              ))}
            </View>
          </View>
        )}
      </CollapsedView>
      {!hideAnalytics && summary.sentiment && (
        <AnalyticsView
          initiallyCollapsed
          sentiment={ summary.sentiment }
          sentiments={ Object.values(summary.sentiments ?? []) } />
      )}
    </View>
  ), [hideCard, format, preferredReadingFormat, handleFormatChange, content, translateToggle, theme.colors.textHighlightBackground, theme.colors.textDark, keywords, cleanString, hideAnalytics, summary.sentiment, summary.sentiments]);
  
  const menuItems = React.useMemo(() => {
    const actions: MenuItemProps[] = [
      {
        icon: () => <Icon name="share" />,
        key: `share-${summary.id}`,
        onPress: async () => {
          await SheetManager.show('share', {
            payload: {
              onInteract,
              summary,
            },
          });
        },
        text: strings.action_share,
        withSeparator: true,
      },
      {
        icon: () => <Icon name={ isBookmarked ? 'bookmark' : 'bookmark-outline' } />,
        key: `${isBookmarked ? 'unbookmark' : 'bookmark'}-${summary.id}`,
        onPress: async () => {
          setIsBookmarked(!isBookmarked);
          const newBookmark = await getSummary(summary.id, getLocale());
          if (!newBookmark.data || newBookmark.error) {
            setIsBookmarked(!isBookmarked);
            return;
          }
          bookmarkSummary(newBookmark.data);
        },
        text: isBookmarked ? strings.summary_unbookmark : strings.summary_bookmark,
      },
      {
        icon: () => <Icon name={ isRead ? 'email-mark-as-unread' : 'email-open' } />,
        key: `mark-as-${isRead ? 'unread' : 'read'}-${summary.id}`,
        onPress: () => {
          setPreference('readSummaries', (prev) => {
            const newBookmarks = { ...prev };
            if (isRead || summary.id in newBookmarks) {
              delete newBookmarks[summary.id];
            } else {
              newBookmarks[summary.id] = new Bookmark(true);
            }
            return (prev = newBookmarks);
          });
        },
        text: isRead ? strings.summary_markAsUnRead : strings.summary_markAsRead,
      },
      {
        icon: () => <Icon name='bug' />,
        key: `bug-${summary.id}`,
        onPress: () => { 
          onInteract?.(InteractionType.Feedback, undefined, undefined, () => {
            SheetManager.show('feedback', { payload: { summary } });
          });
        },
        text: strings.summary_reportAtBug,
      },
      {
        icon: () => <Icon name='eye-off' />,
        key: `hide-${summary.id}`,
        onPress: () => {
          onInteract?.(InteractionType.Hide, undefined, undefined, () => {
            setPreference('removedSummaries', (prev) => ({
              ...prev,
              [summary.id]: true,
            }));
          });
        },
        text: strings.summary_hide,
      },
    ];
    return actions;
  }, [summary, isBookmarked, isRead, onInteract, getSummary, bookmarkSummary, setPreference]);

  const card = React.useMemo(() => (
    <View
      flexGrow={ 1 }
      style={ { ...theme.components.card, ...style } }
      borderRadius={ 6 }
      overflow="hidden"
      bg={ containsTrigger ? '#eecccc' : undefined }
      opacity={ isRead ? 0.75 : 1 }
      onPress={ () => handleFormatChange(preferredReadingFormat ?? ReadingFormat.Summary) }>
      <View flexRow flexGrow={ 1 }>
        {selected && (
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
          brTopLeft={ 6 }
          brTopRight={ 6 }>
          <View>
            {big && image}
            {header}
          </View>
          {coverContent}
        </View>
      </View>
    </View>
  ), [theme.components.card, theme.colors.primary, style, containsTrigger, isRead, selected, big, image, header, coverContent, handleFormatChange, preferredReadingFormat]);

  const fullCard = React.useMemo(() => (
    <View
      style={ { ...theme.components.card, ...style } }
      height='100%'>
      {!hideCard && (
        <View>
          {header}
        </View>
      )}
      <ScrollView flexGrow={ 1 } { ...props }>
        <View>
          {!hideCard && image}
          {!hideCard && coverContent}
          {cardBody}
        </View>
      </ScrollView>
    </View>
  ), [theme.components.card, style, hideCard, header, image, coverContent, cardBody, props]);
  
  return (
    <View flexGrow={ 1 }>
      {!initialFormat ? 
        disableInteractions ? card : (
          <HoldItem 
            items={ menuItems } 
            closeOnTap>
            {card}
          </HoldItem>
        )
        : (
          fullCard
        )}
    </View>
  );
}
