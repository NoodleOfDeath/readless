import React from 'react';
import {  Platform, useWindowDimensions } from 'react-native';

import { useFocusEffect } from '@react-navigation/native';
import { format as formatDate } from 'date-fns';
import ms from 'ms';
import pluralize from 'pluralize';
import { SheetManager } from 'react-native-actions-sheet';
import { 
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLabel,
  VictoryTheme,
} from 'victory-native';

import { PublicSummaryGroup, ReadingFormat } from '~/api';
import {
  Button,
  ChannelIcon,
  ChildlessViewProps,
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
import {
  LayoutContext,
  StorageContext,
  ToastContext,
} from '~/contexts';
import {
  useInAppBrowser,
  useNavigation,
  useStyles,
  useTheme,
} from '~/hooks';
import {
  getFnsLocale,
  getLocale,
  strings,
} from '~/locales';
import {
  fixedSentiment,
  timeAgo,
  usePlatformTools,
} from '~/utils';

type SummaryProps = ChildlessViewProps & ScrollViewProps & {
  sample?: boolean;
  showcase?: boolean;
  big?: boolean;
  halfBig?: boolean;
  summary?: PublicSummaryGroup
  tickInterval?: string;
  selected?: boolean;
  initialFormat?: ReadingFormat;
  keywords?: string[];
  forceExpanded?: boolean;
  showImage?: boolean;
  bulletsAsShortSummary?: boolean;
  summaryAsShortSummary?: boolean;
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
};

const DEFAULT_PROPS: { summary: PublicSummaryGroup } = {
  summary: {
    bullets: [
      strings.bullet1,
      strings.bullet2,
      strings.bullet3,
      strings.bullet4,
      strings.bullet5,
    ],
    category: {
      displayName: 'Entertainment',
      icon: 'popcorn',
      name: 'entertainment',
    },
    categoryId: 0,
    id: 0,
    imageUrl: 'https://readless.nyc3.digitaloceanspaces.com/img/s/02df6070-0963-11ee-81c0-85b89936402b.jpg',
    media: { imageAi1: 'https://readless.nyc3.digitaloceanspaces.com/img/s/1b131290-775e-11ee-93b5-2b37be086969.jpeg' },
    originalDate: new Date(Date.now() - ms('5m')).toISOString(),
    publisher: {
      displayName: strings.publisher,
      name: 'forbes',
    },
    publisherId: 0,
    sentiment: 0.3,
    sentiments: [{
      method: 'openai',
      score: 0.3,
    }],
    shortSummary: strings.shortSummary,
    siblings: [],
    summary: [strings.exampleSummaryTitle, strings.exampleSummaryTitle, strings.exampleSummaryTitle].join('\n'),
    title: strings.exampleSummaryTitle,
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
    displayName: strings.publisher,
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
  selected,
  initialFormat,
  halfBig,
  big = halfBig || Boolean(initialFormat),
  keywords = [],
  bulletsAsShortSummary,
  summaryAsShortSummary,
  forceExpanded,
  disableInteractions,
  disableNavigation,
  showFullDate,
  showImage = true,
  dateFormat = showFullDate ? 'E PP' : undefined,
  forceUnread = showcase,
  forceShortSummary: forceShortSummary0 = bulletsAsShortSummary || summaryAsShortSummary,
  footerOnly,
  hideHeader,
  hideCard,
  hideArticleCount,
  hideFooter,
  onFormatChange,
  ...props
}: SummaryProps) {

  const {
    openPublisher, 
    openCategory, 
  } = useNavigation();
  const { openURL } = useInAppBrowser();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();
  
  const { emitStorageEvent } = usePlatformTools();
  const theme = useTheme();
  const style = useStyles(props);
  
  const { showToast } = React.useContext(ToastContext);
  const { isTablet, supportsMasterDetail } = React.useContext(LayoutContext);
  const {
    // prefs
    compactSummaries,
    showShortSummary,
    preferredShortPressFormat,
    preferredReadingFormat,
    // summaries
    readSummaries,
    bookmarkedSummaries,
    summaryTranslations,
    bookmarkSummary,
    readSummary,
    removeSummary,
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
    api: { interactWithSummary, localize },
  } = React.useContext(StorageContext);

  const summary = React.useMemo(() => summary0 ?? (sample ? DEFAULT_PROPS.summary : EMPTY_SUMMARY), [summary0, sample]);
  
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

  // formats a timestamp
  const formatTime = React.useCallback((timestamp?: string) => {
    if (!timestamp) {
      return null;
    }
    const date = new Date(timestamp);
    if (dateFormat) {
      return formatDate(date, dateFormat, { locale: getFnsLocale() });
    }
    return timeAgo(date, { defaultValue: strings.justNow, from: Date.now() });
  }, [dateFormat]);
  
  // localized content string
  const content = React.useMemo(() => {
    if (!format && !bulletsAsShortSummary && !summaryAsShortSummary) {
      return;
    }
    let content = localizedStrings.shortSummary;
    if (format === ReadingFormat.Bullets || bulletsAsShortSummary) {
      content = localizedStrings.bullets?.replace(/•\s*/g, '');
    } else if (format === ReadingFormat.FullArticle) {
      if (hideCard) {
        content = strings.fullArticleInfo;
      }
    }
    return content;
  }, [format, bulletsAsShortSummary, summaryAsShortSummary, localizedStrings.shortSummary, localizedStrings.bullets, hideCard]);

  // renders the content based on format
  const renderContent = React.useCallback((format?: ReadingFormat) => content && (
    <View
      gap={ 6 }
      flex={ 1 }>
      {content.split('\n').map((content, i) => (
        <Button 
          key={ `${content}-${i}` }
          gap={ 12 }
          body2={ bulletsAsShortSummary || summaryAsShortSummary }
          iconSize={ 12 }
          leftIcon={ format === 'bullets' ? 'circle' : undefined }>
          <Highlighter 
            flex={ 1 }
            selectable={ Boolean(initialFormat) }
            body2={ bulletsAsShortSummary || summaryAsShortSummary }
            sentenceCase
            highlightStyle={ { backgroundColor: theme.colors.textHighlightBackground, color: theme.colors.textDark } }
            searchWords={ keywords }>
            { content }
          </Highlighter>
        </Button>
      ))}
    </View>
  ), [content, bulletsAsShortSummary, initialFormat, summaryAsShortSummary, theme.colors.textHighlightBackground, theme.colors.textDark, keywords]);
  
  // handle when reading format is changed
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

  // update when brought into view
  useFocusEffect(React.useCallback(() => {
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
  }, [summaryTranslations, summary.id, summary.publisher.name, summary.category.name, summary.url, forceUnread, readSummaries, bookmarkedSummaries, compactSummaries, showShortSummary, forceShortSummary0, forceExpanded, followedPublishers, excludedPublishers, followedCategories, hideCard, format, openURL]));
  
  // the publisher chip
  const publisherChip = React.useMemo(() => (
    <Button
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
        color={ halfBig ? theme.colors.contrastText : theme.colors.textSecondary }>
        {summary.publisher?.displayName}
      </Text>
    </Button>
  ), [disableInteractions, halfBig, openPublisher, summary.publisher, theme.colors.contrastText, theme.colors.textSecondary]);
  
  // timestamp
  const timestamp = React.useMemo(() => {
    return formatTime(summary.originalDate);
  }, [formatTime, summary.originalDate]);
  
  // sentiment meter object
  const sentimentMeter = React.useMemo(() => {
    if (!summary.sentiments || Object.keys(summary.sentiments).length === 0) {
      return null;
    }
    const data = Object.values(summary.sentiments).sort((a, b) => a.method.localeCompare(b.method))
      .map((s) => ({ x: s.method, y: s.score })) ?? [];
    return (
      <Popover
        disabled={ disableInteractions }
        event={ { name: 'view-sentiment-summary' } }
        anchor={ summary.sentiment != null && !isNaN(summary.sentiment) && (
          <View flexRow itemsCenter gap={ 6 }>
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
        <View p={ 12 } itemsCenter>
          <VictoryChart 
            animate={ { duration: 300 } }
            theme={ VictoryTheme.material }>
            <VictoryAxis
              crossAxis
              domain={ [0, Object.values(summary.sentiments).length + 1] }
              tickFormat={ () => '' }
              standalone={ false } />
            <VictoryAxis
              dependentAxis
              crossAxis 
              domainPadding={ 16 }
              standalone={ false } />
            <VictoryBar
              labelComponent={ 
                <VictoryLabel style={ { fill: theme.colors.text } } /> 
              }
              labels={ ({ datum }) => `${datum.x}\n${fixedSentiment(datum.y)}` }
              style={ { data: { fill: ({ datum }) => datum.y < 0 ? theme.colors.error : theme.colors.success } } }
              data={ data } />
          </VictoryChart>
          <Text>
            {strings.sentimentScore}
          </Text>
        </View>
      </Popover>
    );
  }, [disableInteractions, summary, theme.colors.error, theme.colors.success, theme.colors.text]);
  
  // menu actions
  const menuActions = React.useMemo(() => {
    if (showcase) {
      return [];
    }
    const actions: ContextMenuAction[] = [
      {
        onPress: async () => {
          emitStorageEvent('open-article-summary', summary);
          openURL(summary.url);
        },
        systemIcon: 'book',
        title: strings.readArticle,
      },
      {
        onPress: async () => {
          emitStorageEvent('intent-to-share-summary', summary);
          await SheetManager.show('share', {
            payload: {
              format: preferredShortPressFormat,
              summary,
            },
          });
        },
        systemIcon: 'square.and.arrow.up',
        title: strings.share,
      },
      {
        onPress: async () => {
          setIsBookmarked((prev) => !prev);
          bookmarkSummary(summary);
        },
        systemIcon: isBookmarked ? 'bookmark.fill' : 'bookmark',
        title: isBookmarked ? strings.unbookmark : strings.bookmark,
      },
      {
        onPress: () => {
          setIsRead((prev) => !prev);
          readSummary(summary, true);
        },
        systemIcon: isRead ? 'envelope' : 'envelope.open',
        title: isRead || initialFormat || footerOnly ? strings.markAsUnRead : strings.markAsRead,
      },
      {
        onPress: async () => {
          setIsFollowingPublisher((prev) => !prev);
          followPublisher(summary.publisher);
        },
        systemIcon: isFollowingPublisher ? 'magazine.fill' : 'magazine',
        title: `${isFollowingPublisher ? strings.unfollow : strings.follow} ${summary.publisher.displayName}`,
      },
      {
        onPress: async () => {
          setIsFollowingCategory((prev) => !prev);
          followCategory(summary.category);
        },
        systemIcon: isFollowingCategory ? 'minus.square.fill' : 'plus.square',
        title: `${isFollowingCategory ? strings.unfollow : strings.follow} ${summary.category.displayName}`,
      },
      {
        onPress: () => { 
          emitStorageEvent('report-summary', summary);
          SheetManager.show('feedback', { payload: { summary } });
        },
        systemIcon: 'flag',
        title: strings.report,
      },
      {
        destructive: true,
        onPress: async () => {
          setIsExcludingPublisher((prev) => !prev);
          excludePublisher(summary.publisher);
        },
        systemIcon: 'eye.slash',
        title: `${isExcludingPublisher ? strings.unexclude : strings.exclude} ${summary.publisher.displayName}`,
      },
      {
        destructive: true,
        onPress: async () => {
          setIsExcludingCategory((prev) => !prev);
          excludeCategory(summary.category);
        },
        systemIcon: 'eye.slash',
        title: `${isExcludingCategory ? strings.unexclude : strings.exclude} ${summary.category.displayName}`,
      },
      {
        destructive: true,
        onPress: () => {
          removeSummary(summary);
        },
        systemIcon: 'eye.slash',
        title: strings.hideThisArticle,
      },
    ];
    return actions;
  }, [showcase, footerOnly, initialFormat, isBookmarked, isRead, isFollowingPublisher, summary, isFollowingCategory, isExcludingPublisher, isExcludingCategory, emitStorageEvent, openURL, preferredShortPressFormat, bookmarkSummary, readSummary, followPublisher, followCategory, excludePublisher, excludeCategory, removeSummary]);

  // more button
  const moreButton = React.useMemo(() => {
    return (
      <ContextMenu
        dropdownMenuMode
        event={ { name: 'expand-summary' } }
        actions={ menuActions as ContextMenuAction[] }>
        <Button
          gap={ 6 }
          color={ theme.colors.textSecondary }
          accessibilityLabel={ strings.more }
          leftIcon="dots-horizontal" />
      </ContextMenu>
    );
  }, [menuActions, theme.colors.textSecondary]);

  // header component
  const header = React.useMemo(() => {
    if ((!forceExpanded && isCompact) && !initialFormat) {
      return null;
    }
    if (hideHeader) {
      return null;
    }
    return (
      <View
        px={ 12 } 
        py={ 3 }
        flex={ 1 }
        bg={ big ? theme.colors.headerBackground : undefined }>
        <View flexRow itemsCenter gap={ 6 }>
          <View
            absolute={ halfBig }
            top={ halfBig ? -32 : undefined }>
            {publisherChip}
          </View>
          <View flexRow itemsCenter gap={ 6 }>
            {!halfBig && (
              <Text
                caption
                color={ theme.colors.textSecondary }>
                •
              </Text>
            )}
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
          {!initialFormat && !showcase && moreButton}
        </View>
      </View>
    );
  }, [forceExpanded, isCompact, initialFormat, hideHeader, big, showcase, theme.colors.headerBackground, theme.colors.textSecondary, halfBig, publisherChip, timestamp, sentimentMeter, moreButton]);

  // title of this summary
  const title = React.useMemo(() => (
    <Highlighter
      bold
      selectable={ Boolean(initialFormat) }
      h6={ Boolean(initialFormat) }
      color={ !initialFormat && isRead ? theme.colors.textDisabled : theme.colors.text }
      highlightStyle={ { backgroundColor: theme.colors.textHighlightBackground, color: theme.colors.textDark } }
      searchWords={ !showcase ? keywords : [] }>
      {(((!forceExpanded && isCompact) && (showShortSummary || forceShortSummary) && !initialFormat) ? localizedStrings.shortSummary : localizedStrings.title) || '' }
    </Highlighter>
  ), [forceExpanded, showcase, isCompact, initialFormat, isRead, theme.colors.textDisabled, theme.colors.text, theme.colors.textHighlightBackground, theme.colors.textDark, keywords, showShortSummary, forceShortSummary, localizedStrings.shortSummary, localizedStrings.title]);

  // footer component
  const footer = React.useMemo(() => {
    return (
      <View
        flexRow
        flexWrap={ halfBig ? 'wrap' : undefined }
        py={ 3 }
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
          <Button
            caption
            color={ theme.colors.textSecondary }
            itemsCenter
            haptic
            leftIcon={ summary.category?.icon }
            gap={ 6 }
            onPress={ () => !disableInteractions && openCategory(summary.category) }>
            {summary.category?.displayName}
          </Button>
        )}
        {!footerOnly && !hideArticleCount && (
          <React.Fragment>
            <Text
              caption
              color={ theme.colors.textSecondary }>
              •
            </Text>
            <Button
              caption
              color={ theme.colors.textSecondary }>
              {`${(summary.siblings?.length ?? 0) + 1} ${pluralize(strings.article, (summary.siblings?.length ?? 0) + 1)}`}
            </Button>
          </React.Fragment>
        )}
        <View row />
        {!showcase && (
          <React.Fragment>
            <Button
              color={ theme.colors.textSecondary }
              leftIcon="book-open-variant"
              haptic
              gap={ 6 }
              onPress={ async () => {
                if (disableInteractions) {
                  return;
                }
                emitStorageEvent('open-article-summary-2', summary);
                openURL(summary.url);
              } } />
            <Button
              haptic
              color={ theme.colors.textSecondary }
              leftIcon={ 'share' }
              accessibilityLabel={ strings.share }
              onPress={ async () => {
                if (disableInteractions) {
                  return;
                }
                emitStorageEvent('intent-to-share-summary-2', summary);
                await SheetManager.show('share', {
                  payload: {
                    format: initialFormat,
                    interactWithSummary,
                    summary,
                  },
                });
              } } />
            <Button
              haptic
              color={ theme.colors.textSecondary }
              leftIcon={ isBookmarked ? 'bookmark' : 'bookmark-outline' }
              accessibilityLabel={ strings.bookmark }
              onPress={ () => {
                if (disableInteractions) {
                  return;
                }
                bookmarkSummary(summary); 
                showToast(isBookmarked ? strings.unbookmarked : strings.bookmarked);
              } } />
          </React.Fragment>
        )}
        {!showcase && footerOnly && moreButton}
      </View>
    );
  }, [halfBig, footerOnly, forceExpanded, isCompact, publisherChip, theme.colors.textSecondary, summary, hideArticleCount, showcase, isBookmarked, moreButton, disableInteractions, openCategory, emitStorageEvent, openURL, initialFormat, interactWithSummary, bookmarkSummary, showToast]);
  
  // article image
  const articleImage = React.useMemo(() => {
    if (summary.media?.imageArticle) {
      return summary.media.imageArticle;
    }
  }, [summary.media?.imageArticle]);
  
  // image url
  const imageUrl = React.useMemo(() => articleImage || summary.media?.imageAi1 || summary.imageUrl, [articleImage, summary.media?.imageAi1, summary.imageUrl]);
  
  // image component
  const image = React.useMemo(() => {
    if ((!forceExpanded && isCompact) || !showImage || !imageUrl || footerOnly) {
      return null;
    }
    return (
      <View
        onPress={ () => handleFormatChange(preferredReadingFormat ?? ReadingFormat.Bullets) }
        flexGrow={ 1 }
        overflow='hidden'
        maxWidth={ big ? Math.min(screenWidth, 480) : 64 }
        maxHeight={ big ? Math.min(screenHeight / 3, 300) : 64 }
        p={ big && !initialFormat ? undefined : 6 }>
        <View
          aspectRatio={ big ? 3/1.75 : 1 }
          brTopLeft={ showcase ? 12 : undefined }
          brTopRight={ showcase ? 12 : undefined }
          overflow="hidden"
          zIndex={ 20 }>
          <Image
            flex={ 1 }
            flexGrow={ 1 }
            source={ { uri: imageUrl } } />
          {!showcase && (big) && (
            <Popover
              anchor={ (
                <View 
                  absolute
                  bottom={ 3 }
                  right={ 3 }
                  rounded
                  zIndex={ 30 }
                  bg={ theme.colors.backgroundTranslucent }>
                  <View
                    itemsCenter
                    flexRow
                    flex={ 1 }
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
                {articleImage == null ? strings.thisIsNotARealImage : strings.thisImageWasTakenFromTheArticle}
              </Text>
            </Popover>
          )}
        </View>
      </View>
    );
  }, [forceExpanded, isCompact, showImage, imageUrl, footerOnly, big, screenWidth, screenHeight, initialFormat, showcase, theme.colors.backgroundTranslucent, theme.colors.textDark, articleImage, handleFormatChange, preferredReadingFormat]);

  // translate toggle
  const translateToggle = React.useMemo(() => {
    if (showcase) {
      return null;
    }
    return (
      <TranslateToggle 
        ref={ translateToggleRef }
        type="summary"
        target={ summary }
        translations={ translations }
        localize={ localize }
        onLocalize={ (translations) => {
          if (translations) {
            storeTranslations(summary, translations, 'summaryTranslations');
          }
          setTranslations(translations);
        } } />
    );
  }, [showcase, summary, translations, localize, storeTranslations]);

  // 
  const coverContent = React.useMemo(() => footerOnly ? null : (
    <View 
      px={ 12 } 
      py={ 3 }
      gap={ 6 }
      flexGrow={ 1 }
      onPress={ () => handleFormatChange(preferredReadingFormat ?? ReadingFormat.Bullets) }>
      <View row>
        <View
          flex={ 1 }
          flexGrow={ 1 }
          gap={ 6 }>
          <View>
            <View>
              {title}
            </View>
            {!showcase && translateToggle}
            {big && !hideFooter && footer}
            {showcase && <Divider my={ 3 } />}
            {showcase && renderContent(preferredReadingFormat ?? ReadingFormat.Bullets)}
          </View>
        </View>
        {!(big) && image}
      </View>
      {!big && !hideFooter && footer}
    </View>
  ), [footerOnly, title, showcase, translateToggle, renderContent, preferredReadingFormat, big, image, hideFooter, footer, handleFormatChange]);

  // small card form
  const card = React.useMemo(() => footerOnly ? null : (
    <View
      flexGrow={ 1 }
      py={ showcase ? 3 : undefined }
      style={ { ...theme.components.card, ...style } }
      brTopLeft={ showcase ? 12 : undefined }
      brTopRight={ showcase ? 12 : undefined }
      overflow='hidden'
      opacity={ isRead ? 0.75 : 1 }>
      <View flexRow flexGrow={ 1 }>
        {selected && (
          <View
            left={ 0 }
            top={ 0 }
            width={ 12 } />
        )}
        <View flex={ 1 }>
          {big && image}
          {header}
          {coverContent}
        </View>
      </View>
    </View>
  ), [footerOnly, theme.components.card, style, showcase, isRead, selected, big, image, header, coverContent]);

  // large card form
  const fullCard = React.useMemo(() => footerOnly ? null : (
    <View 
      gap={ 6 }
      style={ { ...theme.components.card, ...style } }>
      <View gap={ 6 }>
        <View flex={ 1 } flexRow={ supportsMasterDetail }>
          {!hideCard && image}
          <View 
            flex={ supportsMasterDetail ? 1 : undefined } 
            mt={ supportsMasterDetail ? 12 : undefined }
            mr={ supportsMasterDetail ? 12 : undefined }>
            {!hideCard && !hideHeader && (
              <View>
                {header}
              </View>
            )}
            {!hideCard && coverContent}
          </View>
        </View>
      </View>
      <View px={ 12 } gap={ 6 }>
        <ReadingFormatPicker
          format={ format }
          onChange={ handleFormatChange } />
        {renderContent(format ?? preferredReadingFormat)}
      </View>
    </View>
  ), [footerOnly, theme.components.card, style, supportsMasterDetail, hideCard, image, hideHeader, header, coverContent, format, handleFormatChange, renderContent, preferredReadingFormat]);
  
  // context menu preview
  const contextMenuPreview = React.useMemo(() => isTablet ? undefined : (
    <Summary 
      width={ Math.min(screenWidth, 480) - 24 }
      big
      showcase
      forceExpanded
      disableInteractions
      disableNavigation
      keywords={ keywords }
      bulletsAsShortSummary={ preferredShortPressFormat === ReadingFormat.Bullets }
      summary={ summary } />
  ), [isTablet, screenWidth, keywords, preferredShortPressFormat, summary]);

  // if just footer show only the footer
  if (footerOnly) {
    return footer;
  }

  return (
    <View flexGrow={ 1 }>
      {!initialFormat ? 
        ((disableInteractions || showcase || Platform.OS !== 'ios')) ? card : (
          <ContextMenu 
            actions={ menuActions }
            event={ { name: 'preview-summary' } }
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
