import React from 'react';

import { useFocusEffect } from '@react-navigation/native';
import { formatDistance } from 'date-fns';
import ms from 'ms';
import pluralize from 'pluralize';
import { SheetManager } from 'react-native-actions-sheet';
import { HoldItem } from 'react-native-hold-menu';
import { MenuItemProps } from 'react-native-hold-menu/lib/typescript/components/menu/types';

import { ChannelIcon } from './ChannelIcon';

import { 
  InteractionType,
  PublicSummaryGroup,
  PublicSummaryTranslationAttributes,
  ReadingFormat,
} from '~/api';
import {
  ActivityIndicator,
  AnalyticsView,
  ChildlessViewProps,
  Chip,
  CollapsedView,
  Highlighter,
  Icon,
  Image,
  MeterDial,
  ReadingFormatPicker,
  ScrollViewProps,
  Text,
  View,
} from '~/components';
import { SessionContext } from '~/contexts';
import {
  useInAppBrowser,
  useNavigation,
  useServiceClient,
  useStyles,
  useTheme,
} from '~/hooks';
import {
  getFnsLocale,
  getLocale,
  strings,
} from '~/locales';
import { fixedSentiment } from '~/utils';

type SummaryProps<Compact extends boolean = false> = ChildlessViewProps & ScrollViewProps & {
  big?: boolean;
  summary?: Compact extends true ? PublicSummaryGroup : PublicSummaryGroup;
  tickInterval?: string;
  selected?: boolean;
  initialFormat?: ReadingFormat;
  initiallyTranslated?: boolean;
  keywords?: string[];
  compact?: Compact;
  disableInteractions?: boolean;
  disableNavigation?: boolean;
  forceSentiment?: boolean;
  forceShortSummary?: boolean;
  hideCard?: boolean;
  hideAnalytics?: boolean;
  hideFooter?: boolean;
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
    publisher: {
      displayName: strings.misc_publisher,
      name: '',
    },
    publisherId: 0,
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

export function Summary<Compact extends boolean = false>({
  summary: summary0,
  tickInterval = '5m',
  selected,
  initialFormat,
  big = Boolean(initialFormat),
  initiallyTranslated = true,
  keywords = [],
  compact,
  disableInteractions,
  disableNavigation,
  forceSentiment,
  forceShortSummary: forceShortSummary0,
  hideCard,
  hideAnalytics,
  hideFooter,
  onFormatChange,
  onInteract,
  onLocalize,
  onToggleTranslate,
  ...props
}: SummaryProps<Compact>) {

  const {
    navigate,
    openPublisher, 
    openCategory, 
  } = useNavigation();
  const { localizeSummary } = useServiceClient();
  const { openURL } = useInAppBrowser();

  const theme = useTheme();
  const style = useStyles(props);

  const {
    compactSummaries,
    showShortSummary,
    preferredReadingFormat, 
    sentimentEnabled,
    triggerWords,
    readSummaries,
    bookmarkedSummaries,
    bookmarkSummary,
    readSummary,
    setPreference,
    followedPublishers,
    followedCategories,
    followPublisher,
    followCategory,
  } = React.useContext(SessionContext);

  const summary = React.useMemo((() => summary0 ?? DEFAULT_PROPS.summary), [summary0]);

  const [lastTick, setLastTick] = React.useState(new Date());
  
  const [isSentimentEnabled, setIsSentimentEnabled] = React.useState(sentimentEnabled);
  const [isRead, setIsRead] = React.useState(summary.id in { ...readSummaries } && !initialFormat && !disableInteractions);
  const [isBookmarked, setIsBookmarked] = React.useState(summary.id in { ...bookmarkedSummaries });
  const [isFollowingPublisher, setIsFollowingPublisher] = React.useState(summary.publisher.name in { ...followedPublishers });
  const [isFollowingCategory, setIsFollowingCategory] = React.useState(summary.category.name in { ...followedCategories });

  const [format, setFormat] = React.useState<ReadingFormat | undefined>(initialFormat);
  const [translations, setTranslations] = React.useState<Record<string, string> | undefined>(summary.translations && summary.translations.length > 0 ? Object.fromEntries((summary.translations).map((t) => [t.attribute, t.value])) : undefined);
  const [showTranslations, setShowTranslations] = React.useState(initiallyTranslated && Boolean(translations));
  const [isLocalizing, setIsLocalizing] = React.useState(false);

  const [forceShortSummary] = React.useState(showShortSummary || forceShortSummary0);
  
  const localizedStrings = React.useMemo(() => {
    return showTranslations && translations ? translations : {
      bullets: (summary.bullets ?? []).join('\n'),
      shortSummary: summary.shortSummary ?? '',
      summary: summary.summary ?? '',
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
    if (format === ReadingFormat.Bullets) {
      content = localizedStrings.bullets.replace(/•\s*/g, '');
    } else if (format === ReadingFormat.FullArticle) {
      if (hideCard) {
        content = strings.summary_fullArticleInfo;
      }
    }
    return content;
  }, [format, localizedStrings.bullets, hideCard, localizedStrings.summary]);
  
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
    setIsSentimentEnabled(sentimentEnabled);
    setTranslations(summary.translations && summary.translations.length > 0 ? Object.fromEntries((summary.translations).map((t) => [t.attribute, t.value])) : undefined);
    setShowTranslations(initiallyTranslated && Boolean(summary.translations));
    setIsRead(summary.id in { ...readSummaries } && !initialFormat && !disableInteractions);
    setIsBookmarked(summary.id in { ...bookmarkedSummaries });
    setIsFollowingPublisher(summary.publisher.name in { ...followedPublishers });
    setIsFollowingCategory(summary.category.name in { ...followedCategories });
    if (!hideCard && format === ReadingFormat.FullArticle) {
      openURL(summary.url);
      return;
    }
    return () => clearInterval(interval);
  }, [tickInterval, sentimentEnabled, summary.translations, summary.id, summary.publisher.name, summary.category.name, summary.url, initiallyTranslated, readSummaries, initialFormat, disableInteractions, bookmarkedSummaries, followedPublishers, followedCategories, hideCard, format, openURL]));

  const handleFormatChange = React.useCallback((newFormat?: ReadingFormat) => {
    if (disableNavigation) {
      return;
    }
    onFormatChange?.(newFormat);
    if (!initialFormat && !hideCard) {
      setIsRead(true);
      return;
    }
    if (!hideCard && newFormat === ReadingFormat.FullArticle) {
      openURL(summary.url);
      return;
    }
    setFormat(newFormat);
  }, [disableNavigation, onFormatChange, initialFormat, hideCard, openURL, summary.url]);

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
      subtitle2={ Boolean(!(compact || compactSummaries) && !initialFormat) }
      body1={ (compact || compactSummaries) && !initialFormat }
      color={ !initialFormat && isRead ? theme.colors.textDisabled : theme.colors.text }
      highlightStyle={ { backgroundColor: theme.colors.textHighlightBackground, color: theme.colors.textDark } }
      searchWords={ keywords }>
      {cleanString(((compact || compactSummaries) && (showShortSummary || forceShortSummary) && !initialFormat) ? localizedStrings.shortSummary : localizedStrings.title) }
    </Highlighter>
  ), [initialFormat, compact, compactSummaries, isRead, theme.colors.textDisabled, theme.colors.text, theme.colors.textHighlightBackground, theme.colors.textDark, keywords, cleanString, showShortSummary, forceShortSummary, localizedStrings.shortSummary, localizedStrings.title]);
  
  const header = React.useMemo(() => {
    if ((compact || compactSummaries) && !initialFormat) {
      return null;
    }
    return (
      <View 
        p={ initialFormat ? 12 : 6 }
        flexGrow={ 1 }
        elevated={ Boolean(initialFormat) }
        zIndex={ 2 }
        bg={ theme.colors.headerBackground }>
        <View>
          {!initialFormat ? (
            <View flexRow itemsCenter gap={ 6 }>
              <Chip
                flexRow
                itemsCenter
                gap={ 6 }
                onPress={ () => !disableInteractions && openPublisher(summary.publisher) }>
                <ChannelIcon publisher={ summary.publisher } />
                <Text 
                  bold
                  caption
                  color={ theme.colors.textSecondary }>
                  {summary.publisher?.displayName}
                </Text>
              </Chip>
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
            </View>
          )}
        </View>
      </View>
    );
  }, [initialFormat, compact, compactSummaries, theme.colors.headerBackground, theme.colors.textSecondary, summary.publisher, timestamp, forceSentiment, isSentimentEnabled, sentimentMeter, title, disableInteractions, openPublisher]);
  
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

  const footer = React.useMemo(() => {
    return (
      <View
        flexRow
        gap={ 6 }
        itemsCenter>
        <Chip
          caption
          color={ theme.colors.textSecondary }
          itemsCenter
          leftIcon={ summary.category?.icon }
          gap={ 3 }
          onPress={ () => !disableInteractions && openCategory(summary.category) }>
          {summary.category?.displayName}
        </Chip>
        <Text
          caption
          color={ theme.colors.textSecondary }>
          •
        </Text>
        <Chip
          caption
          color={ theme.colors.textSecondary }>
          {`${(summary.siblings?.length ?? 0) + 1} ${pluralize(strings.misc_article, (summary.siblings?.length ?? 0) + 1)}`}
        </Chip>
        {isBookmarked && (
          <React.Fragment>
            <Text
              caption
              color={ theme.colors.textSecondary }>
              •
            </Text>
            <Chip
              caption
              color={ theme.colors.textSecondary }
              leftIcon="bookmark"
              onPress={ () => !disableInteractions && navigate('bookmarks') }>
              {strings.summary_bookmarked}
            </Chip>
          </React.Fragment>
        )}
      </View>
    );
  }, [theme.colors.textSecondary, summary.category, summary.siblings, isBookmarked, disableInteractions, openCategory, navigate]);
  
  const image = React.useMemo(() => {
    if (compact || compactSummaries || !summary.imageUrl) {
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
  }, [compact, compactSummaries, summary.imageUrl, big, initialFormat, containsTrigger, theme.colors.textDark, theme.colors.backgroundTranslucent]);

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
            {((!(compact || compactSummaries) && (showShortSummary || forceShortSummary) === true) || initialFormat) && (
              <View>
                <Highlighter 
                  highlightStyle={ { backgroundColor: theme.colors.textHighlightBackground, color: theme.colors.textDark } }
                  searchWords={ keywords }>
                  { cleanString(localizedStrings.shortSummary ?? '') }
                </Highlighter>
              </View>
            )}
            {!hideFooter && footer}
          </View>
        </View>
        {!(big) && image}
      </View>
    </View>
  ), [initialFormat, title, translateToggle, compact, compactSummaries, showShortSummary, forceShortSummary, theme.colors.textHighlightBackground, theme.colors.textDark, keywords, cleanString, localizedStrings.shortSummary, hideFooter, footer, big, image]);
  
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
            pressOnly={ !hideCard }
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
        icon: () => <Icon name="eye" />,
        key: `read-${summary.id}`,
        onPress: async () => {
          openURL(summary.url);
        },
        text: strings.action_readArticle,
      },
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
          setIsBookmarked((prev) => !prev);
          bookmarkSummary(summary);
        },
        text: isBookmarked ? strings.summary_unbookmark : strings.summary_bookmark,
      },
      {
        icon: () => <Icon name={ isRead ? 'email-mark-as-unread' : 'email-open' } />,
        key: `mark-as-${isRead ? 'unread' : 'read'}-${summary.id}`,
        onPress: () => {
          setIsRead((prev) => !prev);
          readSummary(summary);
        },
        text: isRead ? strings.summary_markAsUnRead : strings.summary_markAsRead,
        withSeparator: true,
      },
      {
        icon: () => <ChannelIcon publisher={ summary.publisher } />,
        key: `${isFollowingPublisher ? 'unfollow-pub' : 'follow-pub'}-${summary.id}`,
        onPress: async () => {
          setIsFollowingPublisher((prev) => !prev);
          followPublisher(summary.publisher);
        },
        text: `${isFollowingPublisher ? strings.action_unfollow : strings.action_follow} ${summary.publisher.displayName}`,
      },
      {
        icon: () => <ChannelIcon category={ summary.category } />,
        key: `${isFollowingCategory ? 'unfollow-cat' : 'follow-cat'}-${summary.id}`,
        onPress: async () => {
          setIsFollowingCategory((prev) => !prev);
          followCategory(summary.category);
        },
        text: `${isFollowingCategory ? strings.action_unfollow : strings.action_follow} ${summary.category.displayName}`,
        withSeparator: true,
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
        icon: () => <Icon name='eye-off' color='destructive' />,
        isDestructive: true,
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
  }, [summary, isBookmarked, isRead, isFollowingPublisher, isFollowingCategory, openURL, onInteract, bookmarkSummary, readSummary, followPublisher, followCategory, setPreference]);

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
      style={ { ...theme.components.card, ...style } }>
      {!hideCard && (
        <View>
          {header}
        </View>
      )}
      <View>
        {!hideCard && image}
        {!hideCard && coverContent}
        {cardBody}
      </View>
    </View>
  ), [theme.components.card, style, hideCard, header, image, coverContent, cardBody]);
  
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
