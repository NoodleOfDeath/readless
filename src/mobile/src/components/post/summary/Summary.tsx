import React from 'react';

import { useFocusEffect } from '@react-navigation/native';
import ms from 'ms';
import { SheetManager } from 'react-native-actions-sheet';
import { HoldItem } from 'react-native-hold-menu';
import { MenuItemProps } from 'react-native-hold-menu/lib/typescript/components/menu/types';

import { ChannelIcon } from '../ChannelIcon';

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
  Popover,
  ReadingFormatPicker,
  ScrollViewProps,
  SummaryFooter,
  SummaryHeader,
  Text,
  View,
} from '~/components';
import { SessionContext } from '~/contexts';
import {
  useInAppBrowser,
  useServiceClient,
  useStyles,
  useTheme,
} from '~/hooks';
import { getLocale, strings } from '~/locales';

export type SummaryProps = ChildlessViewProps & ScrollViewProps & {
  sample?: boolean;
  big?: boolean;
  fullImage?: boolean;
  summary?: PublicSummaryGroup
  tickInterval?: string;
  selected?: boolean;
  initialFormat?: ReadingFormat;
  initiallyTranslated?: boolean;
  keywords?: string[];
  notCompact?: boolean;
  disableInteractions?: boolean;
  disableNavigation?: boolean;
  dateFormat?: string;
  showFullDate?: boolean;
  showcase?: boolean;
  forceUnread?: boolean;
  forceSentiment?: boolean;
  forceShortSummary?: boolean;
  footerOnly?: boolean;
  hideHeader?: boolean;
  hideCard?: boolean;
  hideAnalytics?: boolean;
  hideArticleCount?: boolean;
  hideFooter?: boolean;
  onFormatChange?: (format?: ReadingFormat) => void;
  onInteract?: (interaction: InteractionType, content?: string, metadata?: Record<string, unknown>, alternateAction?: () => void) => Promise<unknown>;
  onLocalize?: (translations: PublicSummaryTranslationAttributes[]) => void;
  onToggleTranslate?: (onOrOff: boolean) => void;
};

export type ComputedSummaryProps = SummaryProps & Partial<PublicSummaryGroup> & {
  isBookmarked?: boolean;
  isRead?: boolean;
  siblingCount?: number;
  menuItems?: MenuItemProps[];
  lastTick?: Date;
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
    media: { imageAi1: 'https://readless.nyc3.digitaloceanspaces.com/img/s/02df6070-0963-11ee-81c0-85b89936402b.jpg' },
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

const EMPTY_SUMMARY: PublicSummaryGroup = {
  bullets: [
  ],
  category: {
    displayName: '',
    icon: '',
    name: '',
  },
  categoryId: 0,
  id: 0,
  imageUrl: '',
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
  sentiments: [],
  shortSummary: '',
  siblings: [],
  summary: '',
  title: '',
  translations: [],
  url: 'https://readless.ai',
};

export function Summary({
  sample,
  showcase,
  summary: summary0,
  tickInterval = '5m',
  selected,
  initialFormat,
  big,
  fullImage = Boolean(initialFormat),
  initiallyTranslated = true,
  keywords = [],
  notCompact = showcase,
  disableInteractions = showcase,
  disableNavigation = showcase,
  showFullDate = showcase,
  dateFormat = showFullDate ? 'E PP' : undefined,
  forceUnread = sample || showcase,
  forceShortSummary: forceShortSummary0 = showcase,
  footerOnly,
  hideHeader,
  hideCard,
  hideAnalytics,
  hideArticleCount,
  hideFooter,
  onFormatChange,
  onInteract,
  onLocalize,
  onToggleTranslate,
  ...props
}: SummaryProps) {

  const { localizeSummary } = useServiceClient();
  const { openURL } = useInAppBrowser();

  const theme = useTheme();
  const style = useStyles(props);

  const {
    compactSummaries,
    showShortSummary,
    preferredReadingFormat, 
    triggerWords,
    readSummaries,
    bookmarkedSummaries,
    bookmarkSummary,
    readSummary,
    setPreference,
    followedPublishers,
    excludedPublishers,
    followedCategories,
    excludedCategories,
    followPublisher,
    excludePublisher,
    followCategory,
    excludeCategory,
  } = React.useContext(SessionContext);

  const summary = React.useMemo((() => summary0 ?? (sample ? DEFAULT_PROPS.summary : EMPTY_SUMMARY)), [summary0, sample]);

  const [lastTick, setLastTick] = React.useState(new Date());
  
  const [isRead, setIsRead] = React.useState(!forceUnread &&summary.id in { ...readSummaries } && !disableInteractions);
  const [isBookmarked, setIsBookmarked] = React.useState(summary.id in { ...bookmarkedSummaries });
  const [isFollowingPublisher, setIsFollowingPublisher] = React.useState(summary.publisher.name in { ...followedPublishers });
  const [isExcludingPublisher, setIsExcludingPublisher] = React.useState(summary.publisher.name in { ...excludedPublishers });
  const [isFollowingCategory, setIsFollowingCategory] = React.useState(summary.category.name in { ...followedCategories });
  const [isExcludingCategory, setIsExcludingCategory] = React.useState(summary.category.name in { ...excludedCategories });

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
    setTranslations(summary.translations && summary.translations.length > 0 ? Object.fromEntries((summary.translations).map((t) => [t.attribute, t.value])) : undefined);
    setShowTranslations(initiallyTranslated || Boolean(summary.translations));
    setIsRead(!forceUnread && (summary.id in { ...readSummaries }));
    setIsBookmarked(summary.id in { ...bookmarkedSummaries });
    setIsFollowingPublisher(summary.publisher.name in { ...followedPublishers });
    setIsExcludingPublisher(summary.publisher.name in { ...excludedPublishers });
    setIsFollowingCategory(summary.category.name in { ...followedCategories });
    if (!hideCard && format === ReadingFormat.FullArticle) {
      openURL(summary.url);
      return;
    }
    return () => clearInterval(interval);
  }, [tickInterval, summary.translations, summary.id, summary.publisher.name, summary.category.name, summary.url, initiallyTranslated, readSummaries, bookmarkedSummaries, followedPublishers, excludedPublishers, followedCategories, hideCard, format, openURL, forceUnread]));

  const handleFormatChange = React.useCallback(async (newFormat?: ReadingFormat) => {
    if (disableNavigation) {
      return;
    }
    onFormatChange?.(newFormat);
    readSummary(summary);
    if (!forceUnread && !initialFormat && !hideCard) {
      setIsRead(true);
      return;
    }
    if (!hideCard && newFormat === ReadingFormat.FullArticle) {
      openURL(summary.url);
      return;
    }
    setFormat(newFormat);
  }, [disableNavigation, forceUnread, onFormatChange, initialFormat, hideCard, openURL, summary, readSummary]);

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
  
  const menuItems = React.useMemo(() => {
    const actions: MenuItemProps[] = [];
    actions.push(
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
        icon: () => <Icon name={ isRead || initialFormat ? 'email-mark-as-unread' : 'email-open' } />,
        key: `mark-as-${isRead || initialFormat ? 'unread' : 'read'}-${summary.id}`,
        onPress: () => {
          setIsRead((prev) => !prev);
          readSummary(summary, true);
        },
        text: isRead || initialFormat ? strings.summary_markAsUnRead : strings.summary_markAsRead,
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
        icon: () => <ChannelIcon publisher={ summary.publisher } excluded />,
        isDestructive: true,
        key: `${isExcludingPublisher ? 'unexclude-pub' : 'exclude-pub'}-${summary.id}`,
        onPress: async () => {
          setIsExcludingPublisher((prev) => !prev);
          excludePublisher(summary.publisher);
        },
        text: `${isExcludingPublisher ? strings.action_unexclude : strings.action_exclude} ${summary.publisher.displayName}`,
      },
      {
        icon: () => <ChannelIcon category={ summary.category } excluded />,
        isDestructive: true,
        key: `${isExcludingCategory ? 'unexclude-cat' : 'exclude-cat'}-${summary.id}`,
        onPress: async () => {
          setIsExcludingCategory((prev) => !prev);
          excludeCategory(summary.category);
        },
        text: `${isExcludingCategory ? strings.action_unexclude : strings.action_exclude} ${summary.category.displayName}`,
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
      }
    );
    return actions;
  }, [summary, isBookmarked, isRead, initialFormat, isFollowingPublisher, isFollowingCategory, isExcludingPublisher, isExcludingCategory, openURL, onInteract, bookmarkSummary, readSummary, followPublisher, followCategory, excludePublisher, excludeCategory, setPreference]);

  const title = React.useMemo(() => (
    <Highlighter
      bold
      subtitle2={ Boolean(!(!notCompact && compactSummaries) && !initialFormat) }
      body1={ (!notCompact && compactSummaries) && !initialFormat }
      color={ !initialFormat && isRead ? theme.colors.textDisabled : theme.colors.text }
      highlightStyle={ { backgroundColor: theme.colors.textHighlightBackground, color: theme.colors.textDark } }
      searchWords={ keywords }>
      {cleanString(((!notCompact && compactSummaries) && (showShortSummary || forceShortSummary) && !initialFormat) ? localizedStrings.shortSummary : localizedStrings.title) }
    </Highlighter>
  ), [initialFormat, notCompact, compactSummaries, isRead, theme.colors.textDisabled, theme.colors.text, theme.colors.textHighlightBackground, theme.colors.textDark, keywords, cleanString, showShortSummary, forceShortSummary, localizedStrings.shortSummary, localizedStrings.title]);

  const header = React.useMemo(() => {
    if ((!notCompact && compactSummaries) && !initialFormat) {
      return null;
    }
    if (hideHeader) {
      return null;
    }
    return (
      <SummaryHeader 
        disableInteractions={ disableInteractions }
        disableNavigation={ disableNavigation }
        publisher={ summary.publisher }
        originalDate={ summary.originalDate }
        lastTick={ lastTick }
        dateFormat={ dateFormat }
        sentiment={ summary.sentiment }
        forceSentiment />
    );
  }, [notCompact, compactSummaries, initialFormat, hideHeader, disableInteractions, disableNavigation, summary.publisher, summary.originalDate, summary.sentiment, lastTick, dateFormat]);
  
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
      <SummaryFooter
        disableInteractions={ disableInteractions }
        disableNavigation={ disableNavigation }
        notCompact={ notCompact || !compactSummaries }
        hideArticleCount={ hideArticleCount }
        publisher={ summary.publisher }
        category={ summary.category }
        menuItems={ menuItems }
        isBookmarked={ isBookmarked }
        isRead={ isRead }
        showShare={ footerOnly }
        siblingCount={ summary.siblings?.length ?? 0 }
        onShare={ async () => {
          await SheetManager.show('share', {
            payload: {
              onInteract,
              summary,
            },
          });
        } } />
    );
  }, [disableInteractions, disableNavigation, notCompact, compactSummaries, hideArticleCount, summary, menuItems, isBookmarked, isRead, footerOnly, onInteract]);
  
  const image = React.useMemo(() => {
    if (!notCompact && compactSummaries) {
      return null;
    }
    return (
      <View
        justifyCenter
        flexGrow={ 1 }
        maxWidth={ big || fullImage ? undefined : 64 }
        mx={ big || fullImage ? undefined : 12 }>
        <View
          brTopLeft={ big || fullImage && !initialFormat ? 6 : 0 }
          brTopRight={ big || fullImage && !initialFormat ? 6 : 0 }
          borderRadius={ big || fullImage ? undefined : 6 }
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
              fallbackComponent={
                <Image source={ { uri: summary.media?.imageAi1 || summary.imageUrl } } />
              }
              flex={ 1 }
              flexGrow={ 1 }
              source={ { uri: summary.media?.imageArticle || summary.media?.imageAi1 || summary.imageUrl } } />
          )}
          {(big || fullImage) && (
            <Popover
              disabled={ disableInteractions }
              anchor={ (
                <View 
                  absolute
                  bottom={ 5 }
                  left={ 5 }
                  p={ 2 }
                  beveled
                  bg={ theme.colors.backgroundTranslucent }>
                  <Icon 
                    color={ theme.colors.textDark }
                    name={ 'information' }
                    size={ 24 } />
                </View>
              ) }>
              <Text 
                p={ 12 }
                caption
                color={ theme.colors.textDark }>
                {!summary.media?.imageArticle ? strings.summary_thisIsNotARealImage : strings.summary_thisImageWasTakenFromTheArticle}
              </Text>
            </Popover>
          )}
        </View>
      </View>
    );
  }, [notCompact, compactSummaries, big, fullImage, initialFormat, containsTrigger, summary.media?.imageAi1, summary.media?.imageArticle, summary.imageUrl, disableInteractions, theme.colors.backgroundTranslucent, theme.colors.textDark]);

  const coverContent = React.useMemo(() => (
    <View flex={ 1 } mb={ 12 }>
      <View row gap={ 6 }>
        <View
          flex={ 1 }
          flexGrow={ 1 }
          gap={ 6 }
          px={ 12 }>
          {!initialFormat && title}
          {translateToggle}
          {((!(!notCompact && compactSummaries) && (showShortSummary || forceShortSummary) === true) || initialFormat) && (
            <Highlighter 
              body2
              pt={ initialFormat ? 12 : undefined }
              highlightStyle={ { backgroundColor: theme.colors.textHighlightBackground, color: theme.colors.textDark } }
              searchWords={ keywords }>
              { cleanString(localizedStrings.shortSummary ?? '') }
            </Highlighter>
          )}
          {!hideFooter && footer}
        </View>
        {!(big || fullImage) && image}
      </View>
    </View>
  ), [initialFormat, title, translateToggle, notCompact, compactSummaries, showShortSummary, forceShortSummary, theme.colors.textHighlightBackground, theme.colors.textDark, keywords, cleanString, localizedStrings.shortSummary, hideFooter, footer, big, fullImage, image]);
  
  const cardBody = React.useMemo(() => (
    <View flexGrow={ 1 }>
      <CollapsedView 
        disabled={ hideCard }
        initiallyCollapsed={ false }
        title={ (
          <ReadingFormatPicker
            format={ format } 
            pressOnly={ !hideCard }
            onChange={ handleFormatChange } />
        ) }>
        {content && (
          <View gap={ 12 } p={ 12 }>
            {translateToggle}
            {content.split('\n').map((content, i) => (
              <Chip
                key={ `${content}-${i}` }
                gap={ 12 }
                leftIcon={ format === 'bullets' ? 'circle' : undefined }>
                <Highlighter 
                  flex={ 1 }
                  flexGrow={ 1 }
                  body2={ !notCompact && compactSummaries }
                  highlightStyle={ { backgroundColor: theme.colors.textHighlightBackground, color: theme.colors.textDark } }
                  searchWords={ keywords }>
                  { cleanString(content) }
                </Highlighter>
              </Chip>
            ))}
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
  ), [hideCard, format, handleFormatChange, content, translateToggle, hideAnalytics, summary.sentiment, summary.sentiments, notCompact, compactSummaries, theme.colors.textHighlightBackground, theme.colors.textDark, keywords, cleanString]);

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
      <View>
        {!hideCard && image}
        {!hideCard && !hideHeader && !(!notCompact && compactSummaries) && (
          <View>
            {header}
          </View>
        )}
        {!hideCard && coverContent}
        {cardBody}
      </View>
    </View>
  ), [theme.components.card, style, hideCard, image, hideHeader, notCompact, compactSummaries, header, coverContent, cardBody]);
  
  if (footerOnly) {
    return footer;
  }

  return !initialFormat ? (
    disableInteractions ? card : (
      <HoldItem 
        items={ menuItems } 
        closeOnTap>
        {card}
      </HoldItem>
    )
  )
    : (
      fullCard
    );
}
