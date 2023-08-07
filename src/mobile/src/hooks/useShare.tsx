import React from 'react';
import { DeviceEventEmitter, Platform } from 'react-native';

import { BASE_DOMAIN } from '@env';
import Clipboard from '@react-native-clipboard/clipboard';
import analytics from '@react-native-firebase/analytics';
import RNFS from 'react-native-fs';
import Share, { ShareOptions as RNShareOptions, Social } from 'react-native-share';
import ViewShot from 'react-native-view-shot';

import { useApiClient } from '.';

import { 
  InteractionType, 
  PublicSummaryGroup,
  ReadingFormat,
} from '~/api';
import { shareableLink } from '~/utils';

const SocialAppIds: Record<string, string> = {
  [Social.Facebook]: 'com.facebook.Facebook',
  [Social.FacebookStories]: 'com.facebook.katana',
  [Social.Instagram]: 'com.burbn.instagram',
  [Social.InstagramStories]: `com.instagram.${Platform.OS}`,
  [Social.Linkedin]: `com.linkedin.${Platform.OS}`,
  [Social.Messenger]: 'com.facebook.orca',
  [Social.Pinterest]: 'com.pinterest',
  [Social.Pagesmanager]: 'com.facebook.pages.app',
  // 'threads': 'com.burbn.barcelona',
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

export type UseShareProps = {
  onInteract?: (type: InteractionType, subtype: string, data?: Record<string, unknown>, callback?: () => void) => Promise<unknown>;
  callback?: () => void;
};

export type ShareOptions = Partial<RNShareOptions> & {
  format?: ReadingFormat;
  social?: Social;
  viewshot?: ViewShot | null;
};

export function useShare({ callback }: UseShareProps) {

  const { interactWithSummary } = useApiClient();

  const copyToClipboard = React.useCallback(async (summary: PublicSummaryGroup, property: keyof PublicSummaryGroup) => {
    if (!property) {
      return;
    }
    const content = summary[property] as string;
    try {
      analytics().logEvent('copy_to_clipboard', { content });
      Clipboard.setString(content);
      interactWithSummary(summary.id, InteractionType.Copy, { content });
    } catch (e) {
      console.error(e);
    }
    callback?.();
  }, [callback, interactWithSummary]);
  
  const shareStandard = React.useCallback(async (summary: PublicSummaryGroup, { format, viewshot }: ShareOptions) => {
    if (!summary) {
      return;
    }
    try {
      analytics().logEvent('share_standard', { summary });
      let url = shareableLink(summary, BASE_DOMAIN, format);
      const imageUrl = await viewshot?.capture?.();
      const base64ImageUrl = imageUrl ? `data:image/png;base64,${await RNFS.readFile(imageUrl, 'base64')}` : undefined;
      if (base64ImageUrl) {
        url = base64ImageUrl;
      }
      const options: RNShareOptions = { url };
      Share.open(options);
      interactWithSummary(summary.id, InteractionType.Share, {
        metadata: {
          content: 'standard', 
          message: summary.title, 
          url, 
        }, 
      });
    } catch (e) {
      console.error(e);
    }
    DeviceEventEmitter.emit('share');
    callback?.();
  }, [callback, interactWithSummary]);
  
  const shareSocial = React.useCallback(async (summary: PublicSummaryGroup, { social, viewshot }: ShareOptions) => {
    if (!summary || !social) {
      return;
    }
    try {
      analytics().logEvent('share_social', {
        social,
        summary,
      });
      const url = await viewshot?.capture?.();
      if (!url) {
        return;
      }
      const base64ImageUrl = `data:image/png;base64,${await RNFS.readFile(url, 'base64')}`;
      await Share.shareSingle({ 
        appId: SocialAppIds[social],
        message: `${summary.title} ${shareableLink(summary, BASE_DOMAIN)}`,
        social,
        stickerImage: base64ImageUrl,
        url,
        urls: [url],
      });
      interactWithSummary(summary.id, InteractionType.Share, {
        content: 'social', metadata: {
          message: summary.title, social, url, 
        },
      });
    } catch (e) {
      console.error(e);
    }
    DeviceEventEmitter.emit('share');
    callback?.();
  }, [callback, interactWithSummary]);

  return {
    copyToClipboard,
    shareSocial,
    shareStandard,
  };

}