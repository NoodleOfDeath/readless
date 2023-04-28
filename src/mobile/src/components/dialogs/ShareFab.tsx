import React from 'react';
import { Platform } from 'react-native';

import { BASE_DOMAIN } from '@env';
import Clipboard from '@react-native-clipboard/clipboard';
import RNFS from 'react-native-fs';
import { FAB, FABGroupProps } from 'react-native-paper';
import Share, { Social } from 'react-native-share';
import ViewShot from 'react-native-view-shot';

import {
  InteractionType,
  PublicSummaryAttributes,
  ReadingFormat,
} from '~/api';
import { Text } from '~/components';
import { ToastContext } from '~/contexts';
import {  useOrientation, useTheme } from '~/hooks';
import { SummaryUtils } from '~/utils';

export type ShareFabProps = Partial<FABGroupProps> & {
  summary?: PublicSummaryAttributes;
  viewshot?: ViewShot | null;
  content?: string;
  format?: ReadingFormat;
  onInteract?: (type: InteractionType, subtype: string, data?: Record<string, unknown>, callback?: () => void) => void;
  onDismiss?: () => void;
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

export function ShareFab({
  summary,
  viewshot,
  content,
  format,
  open = false,
  visible = true,
  onInteract,
  onDismiss,
  ...other
}: ShareFabProps) {
  const theme = useTheme();
  const orientation = useOrientation();
  const toast = React.useContext(ToastContext);

  const handleCopyToClipboard = React.useCallback(async (content: string, message: string) => {
    try {
      Clipboard.setString(content);
      onInteract?.(InteractionType.Copy, content);
      toast.alert(<Text>{message}</Text>);
    } catch (e) {
      console.error(e);
    }
    onDismiss?.();
  }, [onDismiss, onInteract, toast]);
  
  const handleStandardShare = React.useCallback(async () => {
    if (!summary) {
      return;
    }
    try {
      const url = SummaryUtils.shareableLink(summary, BASE_DOMAIN);
      const urls = [url];
      const imageUrl = await viewshot?.capture?.();
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
    onDismiss?.();
  }, [onDismiss, onInteract, summary, viewshot]);
  
  const handleSocialShare = React.useCallback(async (social: Social) => {
    if (!summary) {
      return;
    }
    try {
      const url = await viewshot?.capture?.();
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
    onDismiss?.();
  }, [onDismiss, onInteract, summary, viewshot]);
  
  return (
    <FAB.Group
      { ...other }
      color="white"
      fabStyle={ { backgroundColor: theme.colors.primary } }
      visible={ visible }
      open={ open }
      icon="close"
      actions={ [
        {
          icon: 'link-variant',
          label: 'Copy link',
          onPress: () => summary && handleCopyToClipboard(content ?? SummaryUtils.shareableLink(summary, BASE_DOMAIN, format), `Copied "${SummaryUtils.shareableLink(summary, BASE_DOMAIN, format)}" to clipboard`),
        },
        {
          icon: 'link-variant',
          label: 'Copy original source link',
          onPress: () => summary && handleCopyToClipboard(summary.url, `Copied "${summary.url}" to clipboard`),
        },
        {
          icon:'content-copy',
          label: 'Copy summary title',
          onPress: () => handleCopyToClipboard(content ?? summary?.title ?? '', 'Summary title copied to clipboard'), 
        },
        {
          icon:'content-copy',
          label: 'Copy summary bullets',
          onPress: () => handleCopyToClipboard(summary?.bullets.join('\n') ?? '', 'Summary bullets copied to clipboard'), 
        },
        {
          icon:'content-copy',
          label: 'Copy summary paragraph',
          onPress: () => handleCopyToClipboard(summary?.shortSummary ?? '', 'Summary paragraph copied to clipboard'), 
        },
        {
          icon:'instagram',
          label: 'Instagram Feed',
          onPress: () => handleSocialShare(Social.Instagram), 
        },
        {
          icon:'instagram',
          label: 'Instagram Stories',
          onPress: () => handleSocialShare(Social.InstagramStories), 
        },
        {
          icon:'twitter',
          label: 'Twitter',
          onPress:() => handleSocialShare(Social.Twitter), 
        },
        {
          icon: 'export-variant',
          label: 'Share',
          onPress: () => handleStandardShare(), 
        },
      ] }
      onStateChange={ ({ open }) => !open && onDismiss?.() } />
  );
}