import React from 'react';

import { BASE_DOMAIN } from '@env';
import { FAB, FABGroupProps } from 'react-native-paper';
import { Social } from 'react-native-share';
import ViewShot from 'react-native-view-shot';

import {
  InteractionType,
  PublicSummaryAttributes,
  ReadingFormat,
} from '~/api';
import {  useShare, useTheme } from '~/hooks';
import { SummaryUtils } from '~/utils';

export type ShareDialogProps = Partial<FABGroupProps> & {
  summary: PublicSummaryAttributes;
  viewshot: ViewShot | null;
  content?: string;
  format?: ReadingFormat;
  onInteract?: (type: InteractionType, subtype: string, data?: Record<string, unknown>, callback?: () => void) => void;
  onDismiss?: () => void;
};

export function ShareDialog({
  summary,
  viewshot,
  content,
  format,
  open = false,
  visible = true,
  onInteract,
  onDismiss,
  ...other
}: ShareDialogProps) {
  const theme = useTheme();
  
  const {
    copyToClipboard, shareSocial, shareStandard, 
  } = useShare({
    callback: onDismiss,
    onInteract,
  });

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
          onPress: () => summary && copyToClipboard(content ?? SummaryUtils.shareableLink(summary, BASE_DOMAIN, format), `Copied "${SummaryUtils.shareableLink(summary, BASE_DOMAIN, format)}" to clipboard`),
        },
        {
          icon: 'link-variant',
          label: 'Copy original source link',
          onPress: () => summary && copyToClipboard(summary.url, `Copied "${summary.url}" to clipboard`),
        },
        {
          icon:'content-copy',
          label: 'Copy summary title',
          onPress: () => copyToClipboard(content ?? summary?.title ?? '', 'Summary title copied to clipboard'), 
        },
        {
          icon:'content-copy',
          label: 'Copy summary bullets',
          onPress: () => copyToClipboard(summary?.bullets.join('\n') ?? '', 'Summary bullets copied to clipboard'), 
        },
        {
          icon:'content-copy',
          label: 'Copy summary paragraph',
          onPress: () => copyToClipboard(summary?.shortSummary ?? '', 'Summary paragraph copied to clipboard'), 
        },
        {
          icon:'instagram',
          label: 'Instagram Feed',
          onPress: () => shareSocial(summary, viewshot, Social.Instagram), 
        },
        {
          icon:'instagram',
          label: 'Instagram Stories',
          onPress: () => shareSocial(summary, viewshot, Social.InstagramStories), 
        },
        {
          icon:'twitter',
          label: 'Twitter',
          onPress:() => shareSocial(summary, viewshot, Social.Twitter), 
        },
        {
          icon: 'export-variant',
          label: 'Share',
          onPress: () => shareStandard(summary, viewshot), 
        },
      ] }
      onStateChange={ ({ open }) => !open && onDismiss?.() } />
  );
}