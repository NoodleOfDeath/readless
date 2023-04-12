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
import { useInAppBrowser, useTheme } from '~/hooks';

type Props = {
  summary: PublicSummaryAttributes;
  tickIntervalMs?: number;
  format?: ReadingFormat;
  realtimeInteractions?: InteractionResponse;
  bookmarked?: boolean;
  favorited?: boolean;
  collapsible?: boolean;
  compact?: boolean;
  forceCollapse?: boolean;
  onFormatChange?: (format?: ReadingFormat) => void;
  onReferSearch?: (prefilter: string) => void;
  onCollapse?: (collapsed: boolean) => void;
  onInteract?: (interaction: InteractionType, content?: string, metadata?: Record<string, unknown>, alternateAction?: () => void) => void;
};

const SocialAppIds: Record<Social, string> = {
  [Social.Facebook]: 'com.facebook.katana',
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
  [Social.Email]: 'com.google.android.gm',
  [Social.Sms]: 'com.google.android.apps.messaging',
  [Social.Telegram]: 'org.telegram.messenger',
  [Social.Snapchat]: `com.snapchat.${Platform.OS}`,
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
  compact,
  forceCollapse,
  onFormatChange,
  onReferSearch,
  onCollapse,
  onInteract,
}: Props) {
  const { openURL } = useInAppBrowser();
  const theme = useTheme();
  const { preferences: { preferredReadingFormat } } = React.useContext(SessionContext);
  const { setShowFeedbackDialog, setFeedbackSubject } = React.useContext(AppStateContext);
  
  const viewshot = React.useRef<ViewShot | null>(null);

  const [lastTick, setLastTick] = React.useState(new Date());

  const [collapsed, setCollapsed] = React.useState(forceCollapse);
  const interactions = React.useMemo(() => realtimeInteractions ?? summary.interactions, [realtimeInteractions, summary.interactions]);

  const timeAgo = React.useMemo(() => {
    if (!summary.createdAt) {
      return;
    }
    return formatDistance(new Date(summary.createdAt), lastTick, { addSuffix: true });
  }, [summary.createdAt, lastTick]);

  // update time ago every `tickIntervalMs` milliseconds
  React.useEffect(() => {
    const interval = setInterval(() => {
      setLastTick(new Date());
    }, tickIntervalMs);
    return () => clearInterval(interval);
  }, [tickIntervalMs]);

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

  React.useEffect(() => {
    setCollapsed(forceCollapse);
  }, [forceCollapse]);

  const toggleCollapse = React.useCallback(() => {
    setCollapsed((prev) => {
      onCollapse?.(!prev);
      return !prev;
    });
  }, [onCollapse]);
  
  const handleStandardShare = React.useCallback(async () => {
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
          attributionURL: url,
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
            <View row justifySpaced>
              <Button 
                onPress={ () => onReferSearch?.(`src:${summary.outletAttributes?.name}`) }>
                <Text variant='subtitle1' underline>
                  {summary.outletAttributes?.displayName.trim()}
                </Text>
              </Button>
              <Button onPress={ () => onInteract?.(InteractionType.Read, 'original source', { url: summary.url }, () => openURL(summary.url)) }>
                <Text variant='subtitle1' underline>View original source</Text>
              </Button>
            </View>
            <Pressable onPress={ () => onFormatChange?.(preferredReadingFormat ?? ReadingFormat.Concise) }>
              <Text variant={ compact ? 'subtitle2' : 'title2' }>{summary.title.trim()}</Text>
            </Pressable>
            <Divider horizontal />
            <View row justifySpaced>
              <View col>
                <Text variant='subtitle2'>{timeAgo}</Text>
                <Button
                  row
                  alignCenter
                  startIcon="emoticon-sad"
                  fontSize={ 14 }
                  color='primary'
                  onPress={ () => onInteract?.(InteractionType.Feedback, undefined, undefined, () => {
                    setShowFeedbackDialog(true);
                    setFeedbackSubject(summary);
                  }) }>
                  This doesn&apos;t seem right
                </Button>
              </View>
              <View row justifyEnd alignCenter>
                <View>
                  <Text variant='subtitle2'>{String(interactions.view)}</Text>
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
                <Button
                  startIcon='export-variant'
                  fontSize={ 24 }
                  mh={ 4 }
                  color='primary'
                  onPress={ () => handleStandardShare() } />
                <Button
                  startIcon='instagram'
                  fontSize={ 24 }
                  mh={ 4 }
                  color='primary'
                  onPress={ () => handleSocialShare(Social.InstagramStories) } />
                <Button
                  startIcon='twitter'
                  fontSize={ 24 }
                  mh={ 4 }
                  color='primary'
                  onPress={ () => handleSocialShare(Social.Twitter) } />
              </View>
            </View>
            <View mt={ 2 }>
              <ReadingFormatSelector 
                format={ format } 
                preferredFormat={ preferredReadingFormat }
                compact={ compact }
                onChange={ onFormatChange } />
              <View mt={ 4 }>
                {content && <Text variant='body1' mt={ 4 }>{content}</Text>}
              </View>
            </View>
          </React.Fragment>
        )}
      </View>
    </ViewShot>
  );
}
