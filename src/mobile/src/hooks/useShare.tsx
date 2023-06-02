import React from 'react';
import { Platform } from 'react-native';

import { BASE_DOMAIN } from '@env';
import Clipboard from '@react-native-clipboard/clipboard';
import RNFS from 'react-native-fs';
import Share, { Social } from 'react-native-share';
import ViewShot from 'react-native-view-shot';

import { InteractionType, PublicSummaryAttributes } from '~/api';
import { shareableLink } from '~/utils';

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

export type UseShareProps = {
  onInteract?: (type: InteractionType, subtype: string, data?: Record<string, unknown>, callback?: () => void) => void;
  callback?: () => void;
};

export function useShare({
  onInteract,
  callback,
}: UseShareProps) {

  const copyToClipboard = React.useCallback(async (content: string) => {
    try {
      await Clipboard.setString(content);
      await onInteract?.(InteractionType.Copy, content);
    } catch (e) {
      console.error(e);
    }
    callback?.();
  }, [callback, onInteract]);
  
  const shareStandard = React.useCallback(async (summary: PublicSummaryAttributes, viewshot: ViewShot | null) => {
    if (!summary) {
      return;
    }
    try {
      let url = shareableLink(summary, BASE_DOMAIN);
      const imageUrl = await viewshot?.capture?.();
      const base64ImageUrl = imageUrl ? `data:image/png;base64,${await RNFS.readFile(imageUrl, 'base64')}` : undefined;
      if (base64ImageUrl) {
        url = base64ImageUrl;
      }
      await onInteract?.(InteractionType.Share, 'standard', { message: summary.title, url }, async () => {
        await Share.open({ url });
      });
    } catch (e) {
      console.error(e);
    }
    callback?.();
  }, [callback, onInteract]);
  
  const shareSocial = React.useCallback(async (summary: PublicSummaryAttributes, viewshot: ViewShot | null, social: Social) => {
    if (!summary) {
      return;
    }
    try {
      const url = await viewshot?.capture?.();
      await onInteract?.(InteractionType.Share, 'social', {
        message: summary.title, social, url, 
      }, async () => {
        if (!url) {
          return;
        }
        const base64ImageUrl = `data:image/png;base64,${await RNFS.readFile(url, 'base64')}`;
        await Share.shareSingle({ 
          appId: SocialAppIds[social],
          backgroundBottomColor: '#fefefe',
          backgroundTopColor: '#906df4',
          message: `${summary.title} ${shareableLink(summary, BASE_DOMAIN)}`,
          social,
          stickerImage: base64ImageUrl,
          url,
        });
      });
    } catch (e) {
      console.error(e);
    }
    callback?.();
  }, [callback, onInteract]);

  return {
    copyToClipboard,
    shareSocial,
    shareStandard,
  };

}