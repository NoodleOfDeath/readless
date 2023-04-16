import React from 'react';
import { Platform } from 'react-native';

import { BASE_DOMAIN } from '@env';
import Clipboard from '@react-native-clipboard/clipboard';
import { formatDistance } from 'date-fns';
import RNFS from 'react-native-fs';
import { Swipeable } from 'react-native-gesture-handler';
import Share, { Social } from 'react-native-share';
import ViewShot from 'react-native-view-shot';

import { 
  InteractionResponse,
  InteractionType,
  PublicSummaryAttributes,
  ReadingFormat,
} from '~/api';
import {
  Button,
  Divider,
  Icon,
  ReadingFormatSelector,
  Text,
  View,
} from '~/components';
import {
  Bookmark,
  DialogContext,
  MediaContext,
  SessionContext,
  ToastContext,
} from '~/contexts';
import { useInAppBrowser, useTheme } from '~/hooks';
import { SummaryUtils } from '~/utils';

type Props = {
  summary: PublicSummaryAttributes;
  tickIntervalMs?: number;
  initialFormat?: ReadingFormat;
  realtimeInteractions?: InteractionResponse;
  bookmarked?: boolean;
  favorited?: boolean;
  collapsible?: boolean;
  forceCollapse?: boolean;
  onFormatChange?: (format?: ReadingFormat) => void;
  onReferSearch?: (prefilter: string) => void;
  onCollapse?: (collapsed: boolean) => void;
  onInteract?: (interaction: InteractionType, content?: string, metadata?: Record<string, unknown>, alternateAction?: () => void) => void;
};

const SocialAppIds: Record<Social, string> = {
  [Social.Facebook]: 'com.facebook.Facebook',
  [Social.FacebookStories]: 'com.facebook.katana',
  [Social.Instagram]: `com.instagram.${Platform.OS}`,
  [Social.InstagramStories]: `com.instagram.${Platform.OS}`,
  [Social.Linkedin]: `com.linkedin.${Platform.OS}`,
  [Social.Messenger]: 'com.facebook.orca',
  [Social.Pinterest]: 'com.pinterest',
  [Social.Pagesmanager]: 'com.facebook.pages.app',
  [Social.Twitter]: 'com.twitter.android',
  [Social.Whatsapp]: 'com.whatsapp',
  [Social.Whatsappbusiness]: 'com.whatsapp.w4b',
  [Social.Googleplus]: 'com.google.android.apps.plus',
  [Social.Email]: 'mailto',
  [Social.Sms]: 'com.google.android.apps.messaging',
  [Social.Telegram]: 'org.telegram.messenger',
  [Social.Snapchat]: 'com.snapchat.Snapchat',
  [Social.Viber]: 'com.viber.voip',
};

export function Summary({
  summary,
  tickIntervalMs = 60_000,
  initialFormat,
  realtimeInteractions,
  collapsible = true,
  forceCollapse,
  onFormatChange,
  onReferSearch,
  onCollapse,
  onInteract,
}: Props) {
  const { openURL } = useInAppBrowser();
  const theme = useTheme();
  const {
    preferences: {
      preferredReadingFormat, bookmarkedSummaries, favoritedSummaries, readSummaries, textScale, 
    }, setPreference, 
  } = React.useContext(SessionContext);
  const { setShowFeedbackDialog, setFeedbackSubject } = React.useContext(DialogContext);
  const {
    firstResponder, readText, cancelTts, 
  } = React.useContext(MediaContext);
  const toast = React.useContext(ToastContext);
  
  const viewshot = React.useRef<ViewShot | null>(null);

  const [lastTick, setLastTick] = React.useState(new Date());

  const [format, setFormat] = React.useState<ReadingFormat | undefined>(initialFormat);
  const interactions = React.useMemo(() => realtimeInteractions ?? summary.interactions, [realtimeInteractions, summary.interactions]);
  const [collapsed, setCollapsed] = React.useState(forceCollapse);
  const [openSocials, setOpenSocials] = React.useState(false);

  const isRead = React.useMemo(() => Boolean(readSummaries?.[summary.id]) && !openSocials && !initialFormat, [initialFormat, openSocials, readSummaries, summary.id]);
  const bookmarked = React.useMemo(() => Boolean(bookmarkedSummaries?.[summary.id]), [bookmarkedSummaries, summary]);
  const favorited = React.useMemo(() => Boolean(favoritedSummaries?.[summary.id]), [favoritedSummaries, summary]);
  
  const playingAudio = React.useMemo(() => firstResponder === ['summary', summary.id].join('-'), [firstResponder, summary]);

  const timeAgo = React.useMemo(() => {
    if (!summary.createdAt) {
      return;
    }
    return formatDistance(new Date(summary.createdAt), lastTick, { addSuffix: true });
  }, [summary.createdAt, lastTick]);

  const content = React.useMemo(() => {
    if (!format || !summary) {
      return;
    }
    switch (format) {
    case 'bullets':
      return summary.bullets.join('\n');
    case 'concise':
      return summary.shortSummary;
    case 'casual':
      return summary.summary;
    case 'detailed':
      return summary.longSummary;
    default:
      return summary.text;
    }
  }, [format, summary]);

  // update time ago every `tickIntervalMs` milliseconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setLastTick(new Date());
    }, tickIntervalMs);
    return () => clearInterval(interval);
  }, [tickIntervalMs]);

  React.useEffect(() => {
    setCollapsed(forceCollapse);
  }, [forceCollapse]);

  const toggleCollapse = React.useCallback(() => {
    setCollapsed((prev) => {
      onCollapse?.(!prev);
      return !prev;
    });
  }, [onCollapse]);

  const handleFormatChange = React.useCallback((newFormat?: ReadingFormat) => {
    onFormatChange?.(newFormat);
    setTimeout(() => {
      setPreference('readSummaries', (prev) => ({
        ...prev,
        [summary.id]: new Bookmark(summary),
      }));
    }, 1000);
    if (!initialFormat) {
      return;
    }
    setFormat(newFormat);
  }, [initialFormat, onFormatChange, setPreference, summary]);

  const handlePlayAudio = React.useCallback(async (text: string) => {
    if (firstResponder) {
      cancelTts();
      if (firstResponder === ['summary', summary.id].join('-')) {
        return;
      }
    }
    onInteract?.(InteractionType.Listen, text);
    try {
      await readText(text, ['summary', summary.id].join('-'));
    } catch (e) {
      console.error(e);
    }
  }, [cancelTts, onInteract, firstResponder, readText, summary]);

  const handleCopyToClipboard = React.useCallback(async (content: string, message: string) => {
    setOpenSocials(false);
    try {
      Clipboard.setString(content);
      onInteract?.(InteractionType.Copy, content);
      toast.alert(<Text>{message}</Text>);
    } catch (e) {
      console.error(e);
    }
  }, [onInteract, toast]);
  
  const handleStandardShare = React.useCallback(async () => {
    setOpenSocials(false);
    try {
      const url = SummaryUtils.shareableLink(summary, BASE_DOMAIN);
      const urls = [url];
      const imageUrl = await viewshot.current?.capture?.();
      const base64ImageUrl = imageUrl ? `data:image/png;base64,${await RNFS.readFile(imageUrl, 'base64')}` : undefined;
      if (base64ImageUrl) {
        urls.push(base64ImageUrl);
      }
      const message = summary.title;
      onInteract?.(InteractionType.Share, 'standard', { message, url }, async () => {
        await Share.open({ 
          message,
          url,
          urls,
        });
      });
    } catch (e) {
      console.error(e);
    }
  }, [onInteract, summary]);
  
  const handleSocialShare = React.useCallback(async (social: Social) => {
    setOpenSocials(false);
    try {
      const url = await viewshot.current?.capture?.();
      const message = [
        summary.title, 
        url,
      ].join('\n\n');
      onInteract?.(InteractionType.Share, 'social', { message, social }, async () => {
        if (!url) {
          return;
        }
        const base64ImageUrl = `data:image/png;base64,${await RNFS.readFile(url, 'base64')}`;
        await Share.shareSingle({ 
          appId: SocialAppIds[social],
          backgroundBottomColor: '#fefefe',
          backgroundTopColor: '#906df4',
          message: `${summary.title} ${SummaryUtils.shareableLink(summary, BASE_DOMAIN)}`,
          social,
          stickerImage: base64ImageUrl,
          url,
        });
      });
    } catch (e) {
      console.error(e);
    }
  }, [onInteract, summary]);
  
  const socialContainer = { position: 'relative' } as const;
  
  const socialContent = React.useMemo(() => ({
    backgroundColor: theme.components.dialog.backgroundColor,
    borderColor: theme.components.dialog.borderColor,
    borderRadius: 8,
    borderWidth: 2,
    bottom: 24,
    left: -36,
    padding: 8,
    position: 'absolute',
  } as const), [theme]);

  const renderLeftActions = React.useCallback(() => {
    const onPress = () => setPreference('readSummaries', (prev) => {
      const newBookmarks = { ...prev };
      if (isRead) {
        delete newBookmarks[summary.id];
      } else {
        newBookmarks[summary.id] = new Bookmark(summary);
      }
      return (prev = newBookmarks);
    });
    return (
      <View 
        rounded
        justifyCenter>
        <View col p={ 8 } mb={ 8 }>
          <Button
            col
            alignCenter
            justifyCenter
            rounded
            bg={ theme.colors.primary }
            color="white"
            mv={ 4 }
            p={ 16 }
            startIcon={ isRead ? 'email-mark-as-unread' : 'read' }
            onPress={ onPress }>
            {isRead ? 'Mark as Unread' : 'Mark as Read'}
          </Button>
        </View>
      </View>
    );
  }, [isRead, setPreference, summary, theme.colors.primary]);
  
  const renderRightActions = React.useCallback(() => {
    const hide = () => {
      onInteract?.(InteractionType.Feedback, 'hide', undefined, () => {
        setPreference('removedSummaries', (prev) => ({
          ...prev,
          [summary.id]: new Bookmark(summary),
        }));
      });
    };
    const report = () => { 
      onInteract?.(InteractionType.Feedback, undefined, undefined, () => {
        setShowFeedbackDialog(true);
        setFeedbackSubject(summary);
      });
    };
    return (
      <View 
        rounded
        justifyCenter>
        <View col p={ 8 } mb={ 8 }>
          <Button
            col
            alignCenter
            justifyCenter
            rounded
            bg={ theme.colors.primary }
            mv={ 4 }
            p={ 16 }
            color="white"
            startIcon={ 'eye-off' }
            onPress={ hide }>
            Hide
          </Button>
          <Button
            col
            alignCenter
            justifyCenter
            rounded
            bg={ theme.colors.primary }
            color="white"
            mv={ 4 }
            p={ 16 }
            startIcon={ 'bug' }
            onPress={ report }>
            Report a Bug
          </Button>
        </View>
      </View>
    );
  }, [theme.colors.primary, onInteract, setShowFeedbackDialog, setFeedbackSubject, summary, setPreference]);
  
  return (
    <ViewShot ref={ viewshot }>
      <Swipeable 
        renderLeftActions={ renderLeftActions }
        renderRightActions={ renderRightActions }>
        <View rounded style={ theme.components.card }>
          <View row alignCenter>
            <View row rounded style={ theme.components.category }>
              {collapsed ? (
                <View onPress={ () => onFormatChange?.(preferredReadingFormat ?? ReadingFormat.Concise) }>
                  <Text inactive={ isRead } body1 color="contrastText">{summary.title.trim()}</Text>
                </View>
              ) : (
                <React.Fragment>
                  <View 
                    row
                    alignCenter
                    onPress={ () => onReferSearch?.(`cat:${summary.category}`) }>
                    {summary.categoryAttributes?.icon && <Icon name={ summary.categoryAttributes?.icon } color="contrastText" mr={ 8 } />}
                    <Text color='contrastText'>{summary.categoryAttributes?.displayName}</Text>
                  </View>
                  <View row alignCenter justifyEnd>
                    <Button
                      startIcon={ playingAudio ? 'stop' : 'volume-source' }
                      onPress={ () => handlePlayAudio(summary.title) }
                      color={ 'contrastText' }
                      mr={ 8 } />
                  </View>
                  <View alignEnd>
                    <Button 
                      row
                      alignCenter
                      small
                      startIcon={ bookmarked ? 'bookmark' : 'bookmark-outline' }
                      color="contrastText"
                      onPress={ () => onInteract?.(InteractionType.Bookmark) }>
                      Read Later
                    </Button>
                  </View>
                </React.Fragment>
              )}
            </View>
            {collapsible && (
              <View alignCenter>
                <Button 
                  big
                  startIcon={ collapsed ? 'chevron-left' : 'chevron-down' }
                  onPress={ () => toggleCollapse() }
                  color={ theme.colors.text }
                  ml={ 8 } />
              </View>
            )}
          </View>
          {!collapsed && (
            <React.Fragment>
              <View row justifySpaced alignCenter>
                <Button 
                  onPress={ () => onReferSearch?.(`src:${summary.outletAttributes?.name}`) }>
                  <Text underline subtitle2>
                    {summary.outletAttributes?.displayName.trim()}
                  </Text>
                </Button>
                <Button 
                  onPress={ () => onInteract?.(InteractionType.Read, 'original source', { url: summary.url }, () => openURL(summary.url)) }>
                  <Text right subtitle2 underline>View original source</Text>
                </Button>
              </View>
              <View onPress={ () => handleFormatChange(preferredReadingFormat ?? ReadingFormat.Concise) }>
                <Text inactive={ isRead } subtitle1>{summary.title.trim()}</Text>
              </View>
              <Divider />
              <View row={ (textScale ?? 1) <= 1 } col={ (textScale ?? 1) > 1 } justifySpaced alignCenter>
                <View col alignCenter={ (textScale ?? 1) > 1 } justifyCenter>
                  <Text body1>{timeAgo}</Text>
                </View>
                <View row alignCenter justifyEnd={ (textScale ?? 1) <= 1 }>
                  <View>
                    <Text body1>{String(interactions.view)}</Text>
                  </View>
                  <Icon
                    name="eye"
                    color={ 'primary' }
                    mh={ 4 } />
                  <Button
                    startIcon={ favorited ? 'heart' : 'heart-outline' }
                    h5
                    mh={ 4 }
                    color='primary'
                    onPress={ () => onInteract?.(InteractionType.Favorite) } />
                  <View>
                    <Button
                      h5
                      mh={ 4 }
                      color='primary'
                      onPress={ () => setOpenSocials(!openSocials) }
                      startIcon='share' />
                  </View>
                  {openSocials && (
                    <View
                      style={ socialContainer }
                      onPress={ () => setOpenSocials(false) }>
                      <View style={ socialContent }>
                        <Button
                          startIcon='link-variant'
                          h5
                          mv={ 4 }
                          color='primary'
                          onPress={ () => handleCopyToClipboard(content ?? SummaryUtils.shareableLink(summary, BASE_DOMAIN, format), `Copied "${SummaryUtils.shareableLink(summary, BASE_DOMAIN, format)}" to clipboard`) } />
                        <Button
                          startIcon='content-copy'
                          h5
                          mv={ 4 }
                          color='primary'
                          onPress={ () => handleCopyToClipboard(content ?? summary.title, `Summary ${format ?? 'title'} copied to clipboard`) } />
                        <Button
                          startIcon='export-variant'
                          h5
                          mv={ 4 }
                          color='primary'
                          onPress={ () => handleStandardShare() } />
                        <Button
                          startIcon='instagram'
                          h5
                          mv={ 4 }
                          color='primary'
                          onPress={ () => handleSocialShare(Social.InstagramStories) } />
                        <Button
                          startIcon='twitter'
                          h5
                          mv={ 4 }
                          color='primary'
                          onPress={ () => handleSocialShare(Social.Twitter) } />
                      </View>
                    </View>
                  )}
                </View>
              </View>
              <View mt={ 2 }>
                <ReadingFormatSelector 
                  format={ format } 
                  preferredFormat={ preferredReadingFormat }
                  onChange={ handleFormatChange } />
                <Divider />
                {content && (
                  <View row alignCenter justifyStart>
                    <Button
                      startIcon={ playingAudio ? 'stop' : 'volume-source' }
                      onPress={ () => handlePlayAudio(content) }
                      mr={ 8 } />
                  </View>
                )}
                <View mt={ 4 }>
                  {content && <Text subtitle1 mt={ 4 }>{content}</Text>}
                </View>
              </View>
            </React.Fragment>
          )}
        </View>
      </Swipeable>
    </ViewShot>
  );
}
