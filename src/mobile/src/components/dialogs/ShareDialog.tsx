import React from 'react';

import { BASE_DOMAIN } from '@env';
import ActionSheet, { SheetProps } from 'react-native-actions-sheet';
import { Social } from 'react-native-share';
import ViewShot from 'react-native-view-shot';

import {
  InteractionType,
  PublicSummaryAttributes,
  ReadingFormat,
} from '~/api';
import {
  Divider,
  Icon,
  ScrollView,
  Text,
  View,
} from '~/components';
import { DialogContext } from '~/contexts';
import {  useShare } from '~/hooks';
import { shareableLink } from '~/utils';

export type ShareDialogProps = {
  summary: PublicSummaryAttributes;
  viewshot: ViewShot | null;
  format?: ReadingFormat;
  onInteract?: (type: InteractionType, subtype: string, data?: Record<string, unknown>, callback?: () => void) => void;
  onClose?: () => void;
};

export function ShareDialog({
  payload,
  ...props
}: SheetProps<ShareDialogProps>) { 
  
  const { setShareTarget } = React.useContext(DialogContext);

  const {
    summary,
    viewshot,
    format,
    onClose,
    onInteract,
  } = React.useMemo(() => (payload ?? {}) as Partial<ShareDialogProps>, [payload]);
  
  const {
    copyToClipboard, shareSocial, shareStandard, 
  } = useShare({
    callback: onClose,
    onInteract,
  });

  React.useEffect(() => {
    setShareTarget(summary);
    return () => setShareTarget(undefined);
  }, [setShareTarget, summary]);
  
  const actions = React.useMemo(() => summary && viewshot && [
    [
      {
        icon: 'share-outline',
        label: 'Share as Link',
        onPress: () => shareStandard(summary, null), 
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
    ],
    [
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
        icon: 'camera-outline',
        label: 'Share as Image',
        onPress: () => shareStandard(summary, viewshot), 
      },
    ],
    [
      { 
        icon:'content-copy',
        label: 'Copy summary title',
        onPress: () => copyToClipboard(summary.title), 
      },
      {
        icon:'content-copy',
        label: 'Copy summary snippet',
        onPress: () => copyToClipboard(summary.shortSummary), 
      },
      {
        icon:'content-copy',
        label: 'Copy summary paragraph',
        onPress: () => copyToClipboard(summary.summary), 
      },
      {
        icon:'content-copy',
        label: 'Copy summary bullets',
        onPress: () => copyToClipboard(summary.bullets.join('\n')), 
      },
    ],
  ] || [], [copyToClipboard, format, shareSocial, shareStandard, summary, viewshot]);

  return (
    <ActionSheet id={ props.sheetId }>
      <View pv={ 12 }>
        {Object.values(actions).map((subactions, i) => (
          <View key={ i } height={ 120 } gap={ 12 }>
            <ScrollView horizontal>
              {subactions.map(({
                icon, label, onPress, 
              }, index) => (
                <View 
                  key={ index }
                  onPress={ onPress }>
                  <View
                    gap={ 6 }
                    width={ 120 }
                    p={ 12 }
                    justifyCenter
                    alignCenter>
                    <View outlined p={ 12 } borderRadius={ 24 }>
                      {typeof icon === 'string' ? <Icon name={ icon } size={ 24 } /> : icon}
                    </View>
                    <Text 
                      caption 
                      textCenter
                      numberOfLines={ 2 }>
                      {label}
                    </Text>
                  </View>
                </View>
              ))}
            </ScrollView>
            {i + 1 < Object.values(actions).length && (
              <Divider />
            )}
          </View>
        ))}
      </View>
    </ActionSheet>
  );
}