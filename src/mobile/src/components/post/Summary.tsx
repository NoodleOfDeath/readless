import React from 'react';
import { Platform, Pressable } from 'react-native';

import { BASE_DOMAIN } from '@env';
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
import { AppStateContext, SessionContext } from '~/contexts';
import { MediaContext } from '~/contexts/media';
import { useInAppBrowser, useTheme } from '~/hooks';

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
  const { readText } = React.useContext(MediaContext);
  
  const viewshot = React.useRef<ViewShot | null>(null);

  const [lastTick, setLastTick] = React.useState(new Date());

  const [collapsed, setCollapsed] = React.useState(forceCollapse);
  const [openSocials, setOpenSocials] = React.useState(false);
  const interactions = React.useMemo(() => realtimeInteractions ?? summary.interactions, [realtimeInteractions, summary.interactions]);
  const [_, setPlayingAudio] = React.useState(false);

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
    setPlayingAudio(true);
    onInteract?.(InteractionType.Listen, text);
    try {
      await readText(text);
    } catch (e) {
      console.error(e);
    } finally {
      setPlayingAudio(false);
    }
  }, [onInteract, readText]);
  
  const handleStandardShare = React.useCallback(async () => {
    setOpenSocials(false);
    try {
      const url = `${BASE_DOMAIN}/read/?s=${summary.id}`;
      const message = summary.title;
      onInteract?.(InteractionType.Share, undefined, { message, url }, async () => {
        await Share.open({ 
          message,
          url,
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
      onInteract?.(InteractionType.Share, undefined, { message, url }, async () => {
        if (!url) {
          return;
        }
        const base64ImageUrl = await RNFS.readFile(url, 'base64');
        await Share.shareSingle({ 
          appId: SocialAppIds[social],
          backgroundBottomColor: '#fefefe',
          backgroundTopColor: '#906df4',
          message: `${summary.title} ${BASE_DOMAIN}/read/?s=${summary.id}`,
          social,
          stickerImage: `data:image/png;base64,${base64ImageUrl}`,
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
          <View row justifySpaced rounded style={ theme.components.category }>
            {collapsed ? (
              <Pressable onPress={ () => onFormatChange?.(preferredReadingFormat ?? ReadingFormat.Concise) }>
                <Text fontSize={ 16 } color="contrastText">{summary.title.trim()}</Text>
              </Pressable>
            ) : (
              <React.Fragment>
                <View 
                  row
                  alignCenter
                  onPress={ () => onReferSearch?.(`cat:${summary.category}`) }>
                  {summary.categoryAttributes?.icon && <Icon name={ summary.categoryAttributes?.icon } color="contrastText" mr={ 8 } />}
                  <Text color='contrastText'>{summary.categoryAttributes?.displayName}</Text>
                </View>
                <View row /> 
                <View row alignCenter justifyEnd>
                  <Button
                    startIcon='volume-source'
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
            <Pressable onPress={ () => onFormatChange?.(preferredReadingFormat ?? ReadingFormat.Concise) }>
              <Text fontSize={ 20 }>{summary.title.trim()}</Text>
            </Pressable>
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
                    startIcon='volume-source'
                    onPress={ () => handlePlayAudio(content) }
                    color="contrastText"
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
