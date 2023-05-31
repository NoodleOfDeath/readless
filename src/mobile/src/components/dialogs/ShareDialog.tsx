import React from 'react';

import { BASE_DOMAIN } from '@env';
import { Social } from 'react-native-share';
import ViewShot from 'react-native-view-shot';

import {
  InteractionType,
  PublicSummaryAttributes,
  ReadingFormat,
} from '~/api';
import {
  Button,
  Dialog,
  DialogProps,
  ScrollView,
  Text,
  View,
} from '~/components';
import {  useShare } from '~/hooks';
import { shareableLink } from '~/utils';

export type ShareDialogProps = DialogProps & {
  summary: PublicSummaryAttributes;
  viewshot: ViewShot | null;
  content?: string;
  format?: ReadingFormat;
  onInteract?: (type: InteractionType, subtype: string, data?: Record<string, unknown>, callback?: () => void) => void;
  onClose?: () => void;
};

export function ShareDialog({
  summary,
  viewshot,
  content,
  format,
  onInteract,
  onClose,
  ...other
}: ShareDialogProps) {
  
  const {
    copyToClipboard, shareSocial, shareStandard, 
  } = useShare({
    callback: onClose,
    onInteract,
  });

  const actions = React.useMemo(() => {
    return [
      {
        icon: 'share',
        label: 'Share as Link',
        onPress: () => shareStandard(summary, null), 
      },
      {
        icon: 'camera',
        label: 'Share as Image',
        onPress: () => shareStandard(summary, viewshot), 
      },
      {
        icon:'twitter',
        label: 'Twitter',
        onPress:() => shareSocial(summary, viewshot, Social.Twitter), 
      },
      {
        icon:'instagram',
        label: 'Instagram Stories',
        onPress: () => shareSocial(summary, viewshot, Social.InstagramStories), 
      },
      {
        icon:'instagram',
        label: 'Instagram Feed',
        onPress: () => shareSocial(summary, viewshot, Social.Instagram), 
      },
      {
        icon: 'link-variant',
        label: 'Copy shareable link',
        onPress: () => copyToClipboard(shareableLink(summary, BASE_DOMAIN, format)),
      },
      {
        icon: 'link-variant',
        label: 'Copy original source link',
        onPress: () => copyToClipboard(summary.url),
      },
      {
        icon:'content-copy',
        label: 'Copy summary paragraph',
        onPress: () => copyToClipboard(summary?.shortSummary ?? ''), 
      },
      {
        icon:'content-copy',
        label: 'Copy summary bullets',
        onPress: () => copyToClipboard(summary?.bullets.join('\n') ?? ''), 
      },
      {
        icon:'content-copy',
        label: 'Copy summary title',
        onPress: () => copyToClipboard(content ?? summary?.title ?? ''), 
      },
    ];
  }, [content, copyToClipboard, format, shareSocial, shareStandard, summary, viewshot]);

  return (
    <Dialog { ...other } onClose={ onClose }>
      <View height={ 320 }>
        <View row gap={ 12 } flexWrap='wrap'>
          {actions.map(({
            icon, label, onPress, 
          }, index) => (
            <View key={ index }>
              <Button
                outlined
                rounded
                p={ 3 }
                gap={ 6 }
                width={ 100 }
                height={ 70 }
                justifyCenter
                alignCenter
                startIcon={ icon }
                onPress={ onPress }>
                <Text caption textCenter>{label}</Text>
              </Button>
            </View>
          ))}
        </View>
      </View>
    </Dialog>
  );
}