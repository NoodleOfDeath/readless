import React from 'react';
import { useWindowDimensions } from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { format as formatDate, formatDistance } from 'date-fns';
import ms from 'ms';
import pluralize from 'pluralize';
import { SheetManager } from 'react-native-actions-sheet';

import { 
  InteractionType,
  PublicSummaryGroup,
  ReadingFormat,
} from '~/api';
import {
  ChannelIcon,
  ChildlessViewProps,
  Chip,
  CollapsedView,
  ContextMenu,
  ContextMenuAction,
  Divider,
  Highlighter,
  Icon,
  Image,
  MeterDial,
  Popover,
  ReadingFormatPicker,
  ScrollViewProps,
  Text,
  TranslateToggle,
  TranslateToggleRef,
  View,
} from '~/components';
import { LayoutContext, SessionContext } from '~/contexts';
import {
  useInAppBrowser,
  useNavigation,
  useServiceClient,
  useStyles,
  useTheme,
} from '~/hooks';
import { getFnsLocale, strings } from '~/locales';
import { fixedSentiment } from '~/utils';

type SummaryProps = ChildlessViewProps & ScrollViewProps & {
  sample?: boolean;
  showcase?: boolean;
  big?: boolean;
  summary?: PublicSummaryGroup
  tickInterval?: string;
  selected?: boolean;
  initialFormat?: ReadingFormat;
  keywords?: string[];
  forceExpanded?: boolean;
  disableInteractions?: boolean;
  disableNavigation?: boolean;
  dateFormat?: string;
  showFullDate?: boolean;
  forceUnread?: boolean;
  forceShortSummary?: boolean;
  footerOnly?: boolean;
  hideHeader?: boolean;
  hideCard?: boolean;
  hideArticleCount?: boolean;
  hideFooter?: boolean;
  onFormatChange?: (format?: ReadingFormat) => void;
  onInteract?: (interaction: InteractionType, content?: string, metadata?: Record<string, unknown>, alternateAction?: () => void) => Promise<unknown>;
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
    translations: {},
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
  translations: {},
  url: 'https://readless.ai',
};

export function Summary({
  sample,
  showcase = sample,
  summary: summary0,
  tickInterval = '5m',
  selected,
  initialFormat,
  big = Boolean(initialFormat),
  keywords = [],
  forceExpanded,
  disableInteractions,
  disableNavigation,
  showFullDate,
  dateFormat = showFullDate ? 'E PP' : undefined,
  forceUnread = showcase,
  forceShortSummary: forceShortSummary0,
  footerOnly,
  hideHeader,
  hideCard,
  hideArticleCount,
  hideFooter,
  onFormatChange,
  onInteract,
  ...props
}: SummaryProps) {

  const {
    navigate,
    openPublisher, 
    openCategory, 
  } = useNavigation();
  const { localizeSummary } = useServiceClient();
  const { openURL } = useInAppBrowser();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  
  const theme = useTheme();
  const style = useStyles(props);
  
  const { isTablet, supportsMasterDetail } = React.useContext(LayoutContext);
  const {
    // prefs
    compactSummaries,
    showShortSummary,
    preferredReadingFormat, 
    triggerWords,
    // summaries
    readSummaries,
    bookmarkedSummaries,
    summaryTranslations,
    bookmarkSummary,
    readSummary,
    storeTranslations,
    // publishers
    followedPublishers,
    excludedPublishers,
    followPublisher,
    excludePublisher,
    // categories
    followedCategories,
    excludedCategories,
    followCategory,
    excludeCategory,
    // base pref setter
    setPreference,
  } = React.useContext(SessionContext);

  const [summary] = React.useState(summary0 ?? (sample ? DEFAULT_PROPS.summary : EMPTY_SUMMARY));

  const [lastTick, setLastTick] = React.useState(new Date());
  
  const [isRead, setIsRead] = React.useState(!forceUnread &&summary.id in { ...readSummaries } && !disableInteractions);
  const [isBookmarked, setIsBookmarked] = React.useState(summary.id in { ...bookmarkedSummaries });
  const [isFollowingPublisher, setIsFollowingPublisher] = React.useState(summary.publisher.name in { ...followedPublishers });
  const [isExcludingPublisher, setIsExcludingPublisher] = React.useState(summary.publisher.name in { ...excludedPublishers });
  const [isFollowingCategory, setIsFollowingCategory] = React.useState(summary.category.name in { ...followedCategories });
  const [isExcludingCategory, setIsExcludingCategory] = React.useState(summary.category.name in { ...excludedCategories });

  const [format, setFormat] = React.useState<ReadingFormat | undefined>(initialFormat);
  const [translations, setTranslations] = React.useState<{ [key in keyof PublicSummaryGroup]?: string } | undefined>(summary.translations ?? summaryTranslations?.[summary.id]);

  const [isCompact, setIsCompact] = React.useState(compactSummaries);
  const [forceShortSummary, setForceShortSummary] = React.useState(showShortSummary || forceShortSummary0 || forceExpanded);
  
  const localizedStrings = React.useMemo(() => {
    return translations ? translations : {
      bullets: (summary.bullets ?? []).join('\n'),
      shortSummary: summary.shortSummary ?? '',
      summary: summary.summary ?? '',
      title: summary.title,
    };
  }, [summary.bullets, summary.shortSummary, summary.summary, summary.title, translations]);
  
  const translateToggleRef = React.useRef<TranslateToggleRef<PublicSummaryGroup>>(null);

  const formatTime = React.useCallback((timestamp?: string) => {
    if (!timestamp) {
      return null;
    }
    const date = new Date(timestamp);
    if (dateFormat) {
      return formatDate(date, dateFormat, { locale: getFnsLocale() });
    }
    return formatDistance(date, lastTick, { addSuffix: true, locale: getFnsLocale() });
  }, [lastTick, dateFormat]);
  
  const content = React.useMemo(() => {
    if (!format) {
      return;
    }
    let content = localizedStrings.summary;
    if (format === ReadingFormat.Bullets) {
      content = localizedStrings.bullets?.replace(/•\s*/g, '');
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
    if (summaryTranslations?.[summary.id]) {
      setTranslations(summaryTranslations[summary.id]);
      translateToggleRef.current?.setTranslations(summaryTranslations[summary.id]);
    }
    setIsRead(!forceUnread && (summary.id in { ...readSummaries }));
    setIsBookmarked(summary.id in { ...bookmarkedSummaries });
    setIsCompact(compactSummaries);
    setForceShortSummary(showShortSummary || forceShortSummary0 || forceExpanded);
    setIsFollowingPublisher(summary.publisher.name in { ...followedPublishers });
    setIsExcludingPublisher(summary.publisher.name in { ...excludedPublishers });
    setIsFollowingCategory(summary.category.name in { ...followedCategories });
    if (!hideCard && format === ReadingFormat.FullArticle) {
      openURL(summary.url);
    }
    return () => clearInterval(interval);
  }, [tickInterval, summaryTranslations, summary.id, summary.publisher.name, summary.category.name, summary.url, forceUnread, readSummaries, bookmarkedSummaries, compactSummaries, showShortSummary, forceShortSummary0, forceExpanded, followedPublishers, excludedPublishers, followedCategories, hideCard, format, openURL]));

  const handleFormatChange = React.useCallback((newFormat?: ReadingFormat) => {
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
  
  const menuActions = React.useMemo(() => {
    if (showcase) {
      return [];
    }
    const actions: ContextMenuAction[] = [];
    if (!footerOnly && !initialFormat) {
      actions.push(
        {
          onPress: async () => {
            openURL(summary.url);
          },
          systemIcon: 'book',
          title: strings.action_readArticle,
        },
        {
          onPress: async () => {
            await SheetManager.show('share', {
              payload: {
                onInteract,
                summary,
              },
            });
          },
          systemIcon: 'square.and.arrow.up',
          title: strings.action_share,
        }
      );
    }
    actions.push(
      {
        onPress: async () => {
          setIsBookmarked((prev) => !prev);
          bookmarkSummary(summary);
        },
        systemIcon: isBookmarked ? 'bookmark.fill' : 'bookmark',
        title: isBookmarked ? strings.summary_unbookmark : strings.summary_bookmark,
      },
      {
        onPress: () => {
          setIsRead((prev) => !prev);
          readSummary(summary, true);
        },
        systemIcon: isRead ? 'envelope' : 'envelope.open',
        title: isRead || initialFormat || footerOnly ? strings.summary_markAsUnRead : strings.summary_markAsRead,
      },
      {
        onPress: async () => {
          setIsFollowingPublisher((prev) => !prev);
          followPublisher(summary.publisher);
        },
        systemIcon: isFollowingPublisher ? 'magazine.fill' : 'magazine',
        title: `${isFollowingPublisher ? strings.action_unfollow : strings.action_follow} ${summary.publisher.displayName}`,
      },
      {
        onPress: async () => {
          setIsFollowingCategory((prev) => !prev);
          followCategory(summary.category);
        },
        systemIcon: isFollowingCategory ? 'minus.square.fill' : 'plus.square',
        title: `${isFollowingCategory ? strings.action_unfollow : strings.action_follow} ${summary.category.displayName}`,
      },
      {
        onPress: () => { 
          onInteract?.(InteractionType.Feedback, undefined, undefined, () => {
            SheetManager.show('feedback', { payload: { summary } });
          });
        },
        systemIcon: 'flag',
        title: strings.action_report,
      },
      {
        destructive: true,
        onPress: async () => {
          setIsExcludingPublisher((prev) => !prev);
          excludePublisher(summary.publisher);
        },
        systemIcon: 'xmark.circle.fill',
        title: `${isExcludingPublisher ? strings.action_unexclude : strings.action_exclude} ${summary.publisher.displayName}`,
      },
      {
        destructive: true,
        onPress: async () => {
          setIsExcludingCategory((prev) => !prev);
          excludeCategory(summary.category);
        },
        systemIcon: 'xmark.circle.fill',
        title: `${isExcludingCategory ? strings.action_unexclude : strings.action_exclude} ${summary.category.displayName}`,
      },
      {
        destructive: true,
        onPress: () => {
          onInteract?.(InteractionType.Hide, undefined, undefined, () => {
            setPreference('removedSummaries', (prev) => ({
              ...prev,
              [summary.id]: true,
            }));
          });
        },
        systemIcon: 'xmark.circle.fill',
        title: strings.summary_hide,
      }
    );
    return actions;
  }, [showcase, footerOnly, initialFormat, isBookmarked, isRead, isFollowingPublisher, summary, isFollowingCategory, isExcludingPublisher, isExcludingCategory, openURL, onInteract, bookmarkSummary, readSummary, followPublisher, followCategory, excludePublisher, excludeCategory, setPreference]);
  
  const timestamp = React.useMemo(() => {
    return formatTime(summary.originalDate);
  }, [formatTime, summary.originalDate]);
  
  const sentimentMeter = React.useMemo(() => {
    return (
      <Popover
        disabled={ disableInteractions }
        anchor={ (
          <View flexRow itemsCenter gap={ 3 }>
            <Text
              subscript
              adjustsFontSizeToFit>
              { fixedSentiment(summary.sentiment) }
            </Text>
            <MeterDial 
              value={ summary.sentiment }
              width={ 40 } />
          </View>
        ) }>
        <Text p={ 12 }>{strings.summary_sentimentScore}</Text>
      </Popover>
    );
  }, [disableInteractions, summary.sentiment]);

  const title = React.useMemo(() => (
    <Highlighter
      bold
      subtitle2={ Boolean(!(!forceExpanded && isCompact) && !initialFormat) }
      body1={ (!forceExpanded && isCompact) && !initialFormat }
      color={ !initialFormat && isRead ? theme.colors.textDisabled : theme.colors.text }
      highlightStyle={ { backgroundColor: theme.colors.textHighlightBackground, color: theme.colors.textDark } }
      searchWords={ keywords }>
      {cleanString((((!forceExpanded && isCompact) && (showShortSummary || forceShortSummary) && !initialFormat) ? localizedStrings.shortSummary : localizedStrings.title) || '') }
    </Highlighter>
  ), [forceExpanded, isCompact, initialFormat, isRead, theme.colors.textDisabled, theme.colors.text, theme.colors.textHighlightBackground, theme.colors.textDark, keywords, cleanString, showShortSummary, forceShortSummary, localizedStrings.shortSummary, localizedStrings.title]);
  
  const publisherChip = React.useMemo(() => (
    <Chip
      flexRow
      itemsCenter
      gap={ 6 }
      haptic
      onPress={ () => !disableInteractions && openPublisher(summary.publisher) }>
      <ChannelIcon publisher={ summary.publisher } />
      <Text 
        bold
        caption
        adjustsFontSizeToFit
        color={ theme.colors.textSecondary }>
        {summary.publisher?.displayName}
      </Text>
    </Chip>
  ), [disableInteractions, openPublisher, summary.publisher, theme.colors.textSecondary]);

  const shareActions = React.useMemo(() => (
    <React.Fragment>
      <View row />
      <View flexRow itemsCenter gap={ 12 }>
        <Chip
          color={ theme.colors.textSecondary }
          leftIcon="book-open-variant"
          haptic
          gap={ 3 }
          onPress={ async () => {
            if (disableInteractions) {
              return;
            }
            openURL(summary.url);
          } }>
          {strings.summary_fullArticle}
        </Chip>
        <Chip
          color={ theme.colors.textSecondary }
          leftIcon="export-variant"
          haptic
          gap={ 3 }
          onPress={ async () => {
            if (disableInteractions) {
              return;
            }
            await SheetManager.show('share', {
              payload: {
                onInteract,
                summary,
              },
            });
          } }>
          {strings.action_share}
        </Chip>
        <ContextMenu
          dropdownMenuMode
          actions={ menuActions as ContextMenuAction[] }>
          <Chip
            gap={ 3 }
            color={ theme.colors.textSecondary }
            leftIcon="menu-down">
            {strings.misc_more}
          </Chip>
        </ContextMenu>
      </View>
    </React.Fragment>
  ), [theme.colors.textSecondary, disableInteractions, openURL, onInteract, summary, menuActions]);
  
  const header = React.useMemo(() => {
    if ((!forceExpanded && isCompact) && !initialFormat) {
      return null;
    }
    if (hideHeader) {
      return null;
    }
    return (
      <View
        p={ 6 }
        flexGrow={ 1 }
        zIndex={ 2 }
        bg={ theme.colors.headerBackground }>
        <View flexRow itemsCenter gap={ 6 }>
          {publisherChip}
          <View flex={ 1 } flexRow itemsCenter gap={ 6 }>
            <Text
              caption
              color={ theme.colors.textSecondary }>
              •
            </Text>
            <Text  
              adjustsFontSizeToFit
              color={ theme.colors.textSecondary }
              textCenter
              caption>
              {timestamp}
            </Text>
          </View>
          <View row />
          {sentimentMeter}
        </View>
      </View>
    );
  }, [forceExpanded, isCompact, initialFormat, hideHeader, theme.colors.headerBackground, theme.colors.textSecondary, publisherChip, timestamp, sentimentMeter]);

  const footer = React.useMemo(() => {
    return (
      <View
        flexRow
        gap={ 6 }
        itemsCenter>
        {!footerOnly && !forceExpanded && isCompact && (
          <React.Fragment>
            {publisherChip}
            <Text
              caption
              color={ theme.colors.textSecondary }>
              •
            </Text>
          </React.Fragment>
        )}
        {!footerOnly && (
          <Chip
            caption
            color={ theme.colors.textSecondary }
            itemsCenter
            haptic
            leftIcon={ summary.category?.icon }
            gap={ 3 }
            onPress={ () => !disableInteractions && openCategory(summary.category) }>
            {summary.category?.displayName}
          </Chip>
        )}
        {!footerOnly && !hideArticleCount && (
          <React.Fragment>
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
          </React.Fragment>
        )}
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
        {footerOnly && shareActions}
      </View>
    );
  }, [footerOnly, forceExpanded, isCompact, publisherChip, theme.colors.textSecondary, summary.category, summary.siblings?.length, hideArticleCount, isBookmarked, shareActions, disableInteractions, openCategory, navigate]);
  
  const articleImage = React.useMemo(() => {
    if (summary.media?.imageArticle && /\.(?:jpe?g|png)/.test(summary.media.imageArticle)) {
      return summary.media.imageArticle;
    }
  }, [summary.media]);
  
  const imageUrl = React.useMemo(() => articleImage || summary.media?.imageAi1 || summary.imageUrl, [articleImage, summary.media?.imageAi1, summary.imageUrl]);
  
  const image = React.useMemo(() => {
    if ((!forceExpanded && isCompact) || !imageUrl || footerOnly) {
      return null;
    }
    return (
      <View
        flexGrow={ 1 }
        alignCenter
        maxWidth={ big ? Math.min(screenWidth, 480) : 64 }
        maxHeight={ big ? Math.min(screenHeight / 3, 300) : 64 }
        m={ big && !initialFormat ? undefined : 12 }>
        <View
          brTopLeft={ big && !initialFormat ? 6 : undefined }
          brTopRight={ big && !initialFormat ? 6 : undefined }
          borderRadius={ big && !initialFormat ? undefined : 6 }
          aspectRatio={ big ? 3/1.75 : 1 }
          overflow="hidden"
          zIndex={ 20 }>
          {!showcase && containsTrigger ? (
            <Icon
              name="cancel"
              absolute
              zIndex={ 20 } 
              size={ 120 } />
          ) : (
            <Image
              flex={ 1 }
              flexGrow={ 1 }
              source={ { uri: imageUrl } } />
          )}
          {!showcase && (big) && (
            <Popover
              anchor={ (
                <View 
                  absolute
                  bottom={ 3 }
                  left={ 3 }
                  rounded
                  zIndex={ 30 }
                  bg={ theme.colors.backgroundTranslucent }>
                  <View
                    itemsCenter
                    flexRow
                    flex={ 1 }
                    m={ 6 }
                    gap={ 6 }>
                    <Icon 
                      color={ theme.colors.textDark }
                      name={ 'information' }
                      size={ 24 } />
                  </View>
                </View>
              ) }>
              <Text 
                caption
                p={ 12 }>
                {!articleImage ? strings.summary_thisIsNotARealImage : strings.summary_thisImageWasTakenFromTheArticle}
              </Text>
            </Popover>
          )}
        </View>
      </View>
    );
  }, [forceExpanded, isCompact, imageUrl, footerOnly, big, screenWidth, screenHeight, initialFormat, showcase, containsTrigger, theme.colors.backgroundTranslucent, theme.colors.textDark, articleImage]);

  const translateToggle = React.useMemo(() => {
    if (showcase) {
      return null;
    }
    return (
      <TranslateToggle 
        ref={ translateToggleRef }
        target={ summary }
        translations={ translations }
        localize={ localizeSummary }
        onLocalize={ (translations) => {
          if (translations) {
            storeTranslations(summary, translations, 'summaryTranslations');
          }
          setTranslations(translations);
        } } />
    );
  }, [showcase, summary, translations, localizeSummary, storeTranslations]);

  const coverContent = React.useMemo(() => footerOnly ? null : (
    <View flex={ !initialFormat ? 1 : undefined } mb={ 6 }>
      <View row>
        <View
          flex={ 1 }
          flexGrow={ 1 }
          gap={ 6 }
          pb={ 6 }
          pt={ initialFormat ? 12 : undefined }>
          <View flex={ 1 } flexGrow={ 1 } gap={ 6 } mx={ 12 }>
            <View flex={ 1 }>
              {title}
            </View>
            {translateToggle}
            {((!(!forceExpanded && isCompact) && (showShortSummary || forceShortSummary)) || initialFormat) && (
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
      {Boolean(initialFormat && isTablet) && (
        <View col m={ 12 } gap={ 6 }>
          <Divider />
          {shareActions}
        </View>
      )}
    </View>
  ), [footerOnly, initialFormat, title, translateToggle, forceExpanded, isCompact, showShortSummary, forceShortSummary, theme.colors.textHighlightBackground, theme.colors.textDark, keywords, cleanString, localizedStrings.shortSummary, hideFooter, footer, big, image, isTablet, shareActions]);
  
  const bodyText = React.useMemo(() => content && (
    <React.Fragment>
      {content.split('\n').map((content, i) => (
        <Chip
          key={ `${content}-${i}` }
          itemsCenter
          gap={ 12 }
          leftIcon={ format === 'bullets' ? 'circle' : undefined }>
          <Highlighter 
            flex={ 1 }
            highlightStyle={ { backgroundColor: theme.colors.textHighlightBackground, color: theme.colors.textDark } }
            searchWords={ keywords }>
            { cleanString(content) }
          </Highlighter>
        </Chip>
      ))}
    </React.Fragment>
  ), [content, format, keywords, cleanString, theme.colors.textHighlightBackground, theme.colors.textDark]);
  
  const cardBody = React.useMemo(() => footerOnly ? null : (
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
            onChange={ handleFormatChange } />
        ) }>
        {content && (
          <View gap={ 6 } pb={ 12 }>
            <View gap={ 6 } p={ 12 }>
              {translateToggle}
              {bodyText}
            </View>
          </View>
        )}
      </CollapsedView>
    </View>
  ), [footerOnly, hideCard, format, handleFormatChange, content, translateToggle, bodyText]);

  const card = React.useMemo(() => footerOnly ? null : (
    <View
      flexGrow={ 1 }
      style={ { ...(big ? theme.components.cardBig : theme.components.card), ...style } }
      borderRadius={ 6 }
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
  ), [footerOnly, big, theme.components.cardBig, theme.components.card, theme.colors.primary, style, containsTrigger, isRead, selected, image, header, coverContent, handleFormatChange, preferredReadingFormat]);

  const fullCard = React.useMemo(() => footerOnly ? null : (
    <View mt={ 12 } style={ { ...theme.components.card, ...style } }>   
      <View>
        {!hideCard && !hideHeader && (
          <View>
            {header}
          </View>
        )}
        <View flexRow={ supportsMasterDetail }>
          {!hideCard && image}
          <View flex={ 1 } mr={ supportsMasterDetail ? 12 : undefined }>
            {!hideCard && coverContent}
          </View>
        </View>
        {cardBody}
      </View>
    </View>
  ), [footerOnly, theme.components.card, style, hideCard, hideHeader, header, supportsMasterDetail, image, coverContent, cardBody]);
  
  const contextMenuPreview = React.useMemo(() => (
    <Summary 
      width={ Math.min(screenWidth, 480) - 24 }
      big
      showcase
      forceExpanded
      disableInteractions
      disableNavigation
      summary={ summary } />
  ), [screenWidth, summary]);

  if (footerOnly) {
    return footer;
  }

  return (
    <View flexGrow={ 1 }>
      {!initialFormat ? 
        (disableInteractions || showcase) ? card : (
          <ContextMenu 
            actions={ menuActions }
            preview={ contextMenuPreview }>
            {card}
          </ContextMenu>
        )
        : (
          fullCard
        )}
    </View>
  );
}
