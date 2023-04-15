import React from 'react';
import { Platform } from 'react-native';

import { BASE_DOMAIN } from '@env';
import Clipboard from '@react-native-clipboard/clipboard';
import { formatDistance } from 'date-fns';
import RNFS from 'react-native-fs';
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
  AppStateContext,
  MediaContext,
  SessionContext,
  ToastContext,
} from '~/contexts';
import { useInAppBrowser, useTheme } from '~/hooks';
import { SummaryUtils } from '~/utils';

type Props = {
  summary: PublicSummaryAttributes;
  tickIntervalMs?: number;
  format?: ReadingFormat;
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
  format,
  realtimeInteractions,
  collapsible = true,
  bookmarked,
  favorited,
  forceCollapse,
  onFormatChange,
  onReferSearch,
  onCollapse,
  onInteract,
}: Props) {
  const { openURL } = useInAppBrowser();
  const theme = useTheme();
  const { preferences: { preferredReadingFormat, textScale } } = React.useContext(SessionContext);
  const { setShowFeedbackDialog, setFeedbackSubject } = React.useContext(AppStateContext);
  const {
    firstResponder, readText, cancelTts, 
  } = React.useContext(MediaContext);
  const toast = React.useContext(ToastContext);
  
  const viewshot = React.useRef<ViewShot | null>(null);

  const [lastTick, setLastTick] = React.useState(new Date());

  const [collapsed, setCollapsed] = React.useState(forceCollapse);
  const [openSocials, setOpenSocials] = React.useState(false);
  const interactions = React.useMemo(() => realtimeInteractions ?? summary.interactions, [realtimeInteractions, summary.interactions]);
  
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
  
  return (
    <ViewShot ref={ viewshot }>
      <View rounded style={ theme.components.card }>
        <View row alignCenter>
          <View row rounded style={ theme.components.category }>
            {collapsed ? (
              <View onPress={ () => onFormatChange?.(preferredReadingFormat ?? ReadingFormat.Concise) }>
                <Text fontSize={ 16 } color="contrastText">{summary.title.trim()}</Text>
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
                <Text underline fontSize={ 18 }>
                  {summary.outletAttributes?.displayName.trim()}
                </Text>
              </Button>
              <Button 
                onPress={ () => onInteract?.(InteractionType.Read, 'original source', { url: summary.url }, () => openURL(summary.url)) }>
                <Text right fontSize={ 18 } underline>View original source</Text>
              </Button>
            </View>
            <View onPress={ () => onFormatChange?.(preferredReadingFormat ?? ReadingFormat.Concise) }>
              <Text fontSize={ 20 }>{summary.title.trim()}</Text>
            </View>
            <Divider horizontal />
            <View row={ (textScale ?? 1) <= 1 } col={ (textScale ?? 1) > 1 } justifySpaced alignCenter>
              <View col alignCenter={ (textScale ?? 1) > 1 } justifyCenter>
                <Text fontSize={ 16 }>{timeAgo}</Text>
                <Button
                  row
                  alignCenter
                  startIcon="emoticon-sad"
                  fontSize={ 16 }
                  spacing={ 4 }
                  color='primary'
                  onPress={ () => onInteract?.(InteractionType.Feedback, undefined, undefined, () => {
                    setShowFeedbackDialog(true);
                    setFeedbackSubject(summary);
                  }) }>
                  This doesn&apos;t seem right
                </Button>
              </View>
              <View row alignCenter justifyEnd={ (textScale ?? 1) <= 1 }>
                <View>
                  <Text fontSize={ 16 }>{String(interactions.view)}</Text>
                </View>
                <Icon
                  name="eye"
                  color={ 'primary' }
                  mh={ 4 } />
                <Button
                  startIcon={ favorited ? 'heart' : 'heart-outline' }
                  fontSize={ 24 }
                  mh={ 4 }
                  color='primary'
                  onPress={ () => onInteract?.(InteractionType.Favorite) } />
                <View>
                  <Button
                    fontSize={ 24 }
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
                        fontSize={ 24 }
                        mv={ 4 }
                        color='primary'
                        onPress={ () => handleCopyToClipboard(content ?? SummaryUtils.shareableLink(summary, BASE_DOMAIN, format), `Copied "${SummaryUtils.shareableLink(summary, BASE_DOMAIN, format)}" to clipboard`) } />
                      <Button
                        startIcon='content-copy'
                        fontSize={ 24 }
                        mv={ 4 }
                        color='primary'
                        onPress={ () => handleCopyToClipboard(content ?? summary.title, `Summary ${format ?? 'title'} copied to clipboard`) } />
                      <Button
                        startIcon='export-variant'
                        fontSize={ 24 }
                        mv={ 4 }
                        color='primary'
                        onPress={ () => handleStandardShare() } />
                      <Button
                        startIcon='instagram'
                        fontSize={ 24 }
                        mv={ 4 }
                        color='primary'
                        onPress={ () => handleSocialShare(Social.InstagramStories) } />
                      <Button
                        startIcon='twitter'
                        fontSize={ 24 }
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
                onChange={ onFormatChange } />
              <Divider horizontal />
              {content && (
                <View row alignCenter justifyStart>
                  <Button
                    startIcon={ playingAudio ? 'stop' : 'volume-source' }
                    onPress={ () => handlePlayAudio(content) }
                    mr={ 8 } />
                </View>
              )}
              <View mt={ 4 }>
                {content && <Text fontSize={ 20 } mt={ 4 }>{content}</Text>}
              </View>
            </View>
          </React.Fragment>
        )}
      </View>
    </ViewShot>
  );
}
