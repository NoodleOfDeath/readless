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
  Highlighter,
  Icon,
  Image,
  MeterDial,
  Popover,
  ReadingFormatPicker,
  ScrollViewProps,
  Text,
  TranslateToggle,
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

type SummaryProps = ChildlessViewProps & ScrollViewProps & {
  sample?: boolean;
  big?: boolean;
  showcase?: boolean;
  fullImage?: boolean;
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
  showcase = sample,
  summary: summary0,
  tickInterval = '5m',
  selected,
  initialFormat,
  big,
  fullImage = Boolean(initialFormat),
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
  const { width: screenWidth } = useWindowDimensions();

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
  const [translations, setTranslations] = React.useState<{ [key in keyof PublicSummaryGroup]?: string }>(summary.translations && summary.translations.length > 0 ? Object.fromEntries((summary.translations).map((t) => [t.attribute, t.value])) : {
    bullets: summary.bullets?.join('\n'),
    shortSummary: summary.shortSummary,
    summary: summary.summary,
    title: summary.title,
  });

  const [isCompact, setIsCompact] = React.useState(compactSummaries);
  const [forceShortSummary, setForceShortSummary] = React.useState(showShortSummary || forceShortSummary0 || forceExpanded);

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
    let content = translations.summary;
    if (format === ReadingFormat.Bullets) {
      content = translations.bullets?.replace(/•\s*/g, '');
    } else if (format === ReadingFormat.FullArticle) {
      if (hideCard) {
        content = strings.summary_fullArticleInfo;
      }
    }
    return content;
  }, [format, translations.bullets, hideCard, translations.summary]);
  
  const containsTrigger = React.useMemo(() => {
    return Object.keys({ ...triggerWords }).some((word) => {
      const expr = new RegExp(word, 'i');
      return Object.values(translations).some((s) => expr.test(s));
    });
  }, [translations, triggerWords]);
  
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
    if (!translations && summary.translations) {
      setTranslations(Object.fromEntries(summary.translations.map((t) => [t.attribute, t.value])) as { [key in keyof PublicSummaryGroup]?: string });
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
  }, [tickInterval, translations, summary.translations, summary.id, summary.publisher.name, summary.category.name, summary.url, forceUnread, readSummaries, bookmarkedSummaries, compactSummaries, showShortSummary, forceShortSummary0, forceExpanded, followedPublishers, excludedPublishers, followedCategories, hideCard, format, openURL]));

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
    if (!footerOnly) {
      actions.push(
        {
          onPress: async () => {
            openURL(summary.url);
          },
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
        title: isBookmarked ? strings.summary_unbookmark : strings.summary_bookmark,
      },
      {
        onPress: () => {
          setIsRead((prev) => !prev);
          readSummary(summary, true);
        },
        title: isRead || initialFormat || footerOnly ? strings.summary_markAsUnRead : strings.summary_markAsRead,
      },
      {
        onPress: async () => {
          setIsFollowingPublisher((prev) => !prev);
          followPublisher(summary.publisher);
        },
        title: `${isFollowingPublisher ? strings.action_unfollow : strings.action_follow} ${summary.publisher.displayName}`,
      },
      {
        onPress: async () => {
          setIsFollowingCategory((prev) => !prev);
          followCategory(summary.category);
        },
        title: `${isFollowingCategory ? strings.action_unfollow : strings.action_follow} ${summary.category.displayName}`,
      },
      {
        onPress: () => { 
          onInteract?.(InteractionType.Feedback, undefined, undefined, () => {
            SheetManager.show('feedback', { payload: { summary } });
          });
        },
        title: strings.summary_reportAtBug,
      },
      {
        destructive: true,
        onPress: async () => {
          setIsExcludingPublisher((prev) => !prev);
          excludePublisher(summary.publisher);
        },
        title: `${isExcludingPublisher ? strings.action_unexclude : strings.action_exclude} ${summary.publisher.displayName}`,
      },
      {
        destructive: true,
        onPress: async () => {
          setIsExcludingCategory((prev) => !prev);
          excludeCategory(summary.category);
        },
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
        title: strings.summary_hide,
      }
    );
    return actions;
  }, [showcase, isBookmarked, isRead, initialFormat, footerOnly, isFollowingPublisher, summary, isFollowingCategory, isExcludingPublisher, isExcludingCategory, openURL, onInteract, bookmarkSummary, readSummary, followPublisher, followCategory, excludePublisher, excludeCategory, setPreference]);
  
  const timestamp = React.useMemo(() => {
    return formatTime(summary.originalDate);
  }, [formatTime, summary.originalDate]);
  
  const sentimentMeter = React.useMemo(() => {
    return (
      <Popover
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
  }, [summary.sentiment]);

  const title = React.useMemo(() => (
    <Highlighter
      bold
      subtitle2={ Boolean(!(!forceExpanded && isCompact) && !initialFormat) }
      body1={ (!forceExpanded && isCompact) && !initialFormat }
      color={ !initialFormat && isRead ? theme.colors.textDisabled : theme.colors.text }
      highlightStyle={ { backgroundColor: theme.colors.textHighlightBackground, color: theme.colors.textDark } }
      searchWords={ keywords }>
      {cleanString(((!forceExpanded && isCompact) && (showShortSummary || forceShortSummary) && !initialFormat) ? translations.shortSummary || '' : translations.title || '') }
    </Highlighter>
  ), [forceExpanded, isCompact, initialFormat, isRead, theme.colors.textDisabled, theme.colors.text, theme.colors.textHighlightBackground, theme.colors.textDark, keywords, cleanString, showShortSummary, forceShortSummary, translations.shortSummary, translations.title]);
  
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
        color={ theme.colors.textSecondary }>
        {summary.publisher?.displayName}
      </Text>
    </Chip>
  ), [disableInteractions, openPublisher, summary.publisher, theme.colors.textSecondary]);
  
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
          <View row />
          {sentimentMeter}
        </View>
      </View>
    );
  }, [forceExpanded, isCompact, initialFormat, hideHeader, theme.colors.headerBackground, theme.colors.textSecondary, publisherChip, timestamp, sentimentMeter]);
  
  const translateToggle = React.useMemo(() => {
    return (
      <TranslateToggle 
        target={ summary }
        translations={ summary.translations && summary.translations.length > 0 ? translations : undefined }
        localize={ localizeSummary }
        onLocalize={ (translations) => {
          if (!translations) {
            setTranslations({
              bullets: (summary.bullets ?? []).join('\n'),
              shortSummary: summary.shortSummary ?? '',
              summary: summary.summary ?? '',
              title: summary.title,
            });
          } else {
            setTranslations(translations);
            summary.translations = translations ? Object.entries(translations).map(([attribute, value]) => ({
              attribute, locale: getLocale(), value, 
            })) : [];
          }
        } } />
    );
  }, [summary, translations, localizeSummary]);

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
        {footerOnly && (
          <React.Fragment>
            <View row />
            <View flexRow itemsCenter gap={ 12 }>
              <Chip
                color={ theme.colors.textSecondary }
                leftIcon="book-open"
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
                leftIcon="share"
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
        )}
      </View>
    );
  }, [forceExpanded, isCompact, publisherChip, theme.colors.textSecondary, footerOnly, summary, hideArticleCount, isBookmarked, menuActions, disableInteractions, openCategory, navigate, openURL, onInteract]);
  
  const image = React.useMemo(() => {
    if ((!forceExpanded && isCompact) || !summary.imageUrl || footerOnly) {
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
              flex={ 1 }
              flexGrow={ 1 }
              source={ { uri: summary.media?.imageArticle || summary.media?.imageAi1 || summary.imageUrl } } />
          )}
          {(big || fullImage) && (
            <Popover
              anchor={ (
                <View 
                  absolute
                  bottom={ 3 }
                  left={ 3 }
                  rounded
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
                {!summary.media?.imageArticle ? strings.summary_thisIsNotARealImage : strings.summary_thisImageWasTakenFromTheArticle}
              </Text>
            </Popover>
          )}
        </View>
      </View>
    );
  }, [forceExpanded, isCompact, summary.imageUrl, summary.media?.imageArticle, summary.media?.imageAi1, footerOnly, big, fullImage, initialFormat, containsTrigger, theme.colors.backgroundTranslucent, theme.colors.textDark]);

  const coverContent = React.useMemo(() => footerOnly ? null : (
    <View flex={ 1 } mb={ 6 }>
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
                  { cleanString(translations.shortSummary ?? '') }
                </Highlighter>
              </View>
            )}
            {!hideFooter && footer}
          </View>
        </View>
        {!(big || fullImage) && image}
      </View>
    </View>
  ), [footerOnly, initialFormat, title, translateToggle, forceExpanded, isCompact, showShortSummary, forceShortSummary, theme.colors.textHighlightBackground, theme.colors.textDark, keywords, cleanString, translations.shortSummary, hideFooter, footer, big, fullImage, image]);
  
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
            <View gap={ 12 } p={ 12 }>
              {translateToggle}
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
            </View>
          </View>
        )}
      </CollapsedView>
    </View>
  ), [footerOnly, hideCard, format, handleFormatChange, content, translateToggle, theme.colors.textHighlightBackground, theme.colors.textDark, keywords, cleanString]);

  const card = React.useMemo(() => footerOnly ? null : (
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
  ), [footerOnly, theme.components.card, theme.colors.primary, style, containsTrigger, isRead, selected, big, image, header, coverContent, handleFormatChange, preferredReadingFormat]);

  const fullCard = React.useMemo(() => footerOnly ? null : (
    <View
      style={ { ...theme.components.card, ...style } }>   
      <View>
        {!hideCard && image}
        {!hideCard && !hideHeader && (
          <View>
            {header}
          </View>
        )}
        {!hideCard && coverContent}
        {cardBody}
      </View>
    </View>
  ), [footerOnly, theme.components.card, style, hideCard, image, hideHeader, header, coverContent, cardBody]);
  
  if (footerOnly) {
    return footer;
  }

  return (
    <View flexGrow={ 1 }>
      {!initialFormat ? 
        (disableInteractions || showcase) ? card : (
          <ContextMenu 
            actions={ menuActions }
            preview={ (
              <Summary 
                width={ Math.min(screenWidth, 480) - 24 }
                showcase
                forceExpanded
                disableInteractions
                disableNavigation
                summary={ summary } />
            ) }>
            {card}
          </ContextMenu>
        )
        : (
          fullCard
        )}
    </View>
  );
}
