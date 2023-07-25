import React from 'react';
import { useWindowDimensions } from 'react-native';

import { BASE_DOMAIN } from '@env';
import { SheetProps } from 'react-native-actions-sheet';
import { Social } from 'react-native-share';
import { SvgUri } from 'react-native-svg';
import ViewShot from 'react-native-view-shot';

import {
  InteractionType,
  PublicSummaryGroup,
  ReadingFormat,
} from '~/api';
import {
  ActionSheet,
  Divider,
  Icon,
  Image,
  ScrollView,
  SegmentedButtons,
  Summary,
  Text,
  View,
} from '~/components';
import {  useShare, useTheme } from '~/hooks';
import { strings } from '~/locales';
import { shareableLink } from '~/utils';

export type ShareDialogProps = {
  summary: PublicSummaryGroup;
  format?: ReadingFormat;
  onInteract?: (type: InteractionType, subtype: string, data?: Record<string, unknown>, callback?: () => void) => Promise<unknown>;
  onClose?: () => void;
};

export type ShareDialogAction = {
  icon?: React.ReactNode;
  iconText?: string;
  imageUri?: string;
  label: string;
  onPress: () => void;
};

export const SHARE_FORMATS = ['big', 'compact-shortSummary', 'compact-bullets', 'compact'] as const;

export type ShareFormat = typeof SHARE_FORMATS[number];

export function ShareDialog({
  payload,
  ...props
}: SheetProps<ShareDialogProps>) { 
 
  const theme = useTheme();
  const viewshot = React.useRef<ViewShot>(null);
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const [shareFormat, setShareFormat] = React.useState<ShareFormat>('big');

  const {
    summary,
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

  const actions: ShareDialogAction[][] = React.useMemo(() => summary && viewshot && [
    [
      {
        icon: 'export-variant',
        label: strings.share_shareAsLink,
        onPress: () => shareStandard(summary, null), 
      },
      {
        icon: 'link-variant',
        label: strings.share_copyLink,
        onPress: () => copyToClipboard(shareableLink(summary, BASE_DOMAIN, format)),
      },
      {
        icon: 'link-variant',
        label: strings.share_copyOriginalSourceLink,
        onPress: () => copyToClipboard(summary.url),
      },
    ],
    [
      {
        icon: 'twitter',
        // imageUri: 'https://readless.nyc3.cdn.digitaloceanspaces.com/img/app/twitter.png',
        label: strings.share_twitter,
        onPress:() => shareSocial(summary, viewshot.current, Social.Twitter), 
      },
      {
        icon: 'instagram',
        // imageUri: 'https://readless.nyc3.cdn.digitaloceanspaces.com/img/app/instagram.png',
        label: strings.share_instagramStories,
        onPress: () => shareSocial(summary, viewshot.current, Social.InstagramStories), 
      },
      // {
      //   iconText: '🧵',
      //   imageUri: 'https://readless.nyc3.cdn.digitaloceanspaces.com/img/app/threads.png',
      //   label: strings.share_threads,
      //   onPress: () => shareSocial(summary, viewshot, 'threads'), 
      // },
      {
        icon: 'camera-outline',
        label: strings.share_shareAsImage,
        onPress: () => shareStandard(summary, viewshot.current), 
      },
    ],
    [
      { 
        icon:'content-copy',
        label: strings.share_copyTitle,
        onPress: () => copyToClipboard(summary.title), 
      },
      {
        icon:'content-copy',
        label: strings.share_copyShortSummary,
        onPress: () => copyToClipboard(summary.shortSummary), 
      },
      {
        icon:'content-copy',
        label: strings.share_copySummary,
        onPress: () => copyToClipboard(summary.summary), 
      },
      {
        icon:'content-copy',
        label: strings.share_copyBulletPoints,
        onPress: () => copyToClipboard(summary.bullets?.join('\n')), 
      },
    ],
  ] || [], [copyToClipboard, format, shareSocial, shareStandard, summary, viewshot]);

  return (
    <ActionSheet
      id={ props.sheetId }
      closeButton
      gestureEnabled={ false }>
      {summary && (
        <View
          bg={ theme.colors.headerBackground }
          inactive
          itemsCenter>
          <View
            absolute
            top={ -65 }
            p={ 12 }
            zIndex={ 3 }>
            <SegmentedButtons
              elevated
              initialValue={ shareFormat }
              onValueChange={ (f) => setShareFormat(f) }
              options={ [
                {
                  icon: 'cards-variant',
                  value: 'big',
                },
                {
                  icon: 'id-card',
                  value: 'compact-shortSummary',
                },
                {
                  icon: 'card-bulleted-outline',
                  value: 'compact-bullets',
                },
                {
                  icon: 'card-text-outline',
                  value: 'compact',
                },
              ] } />
          </View>
          <ScrollView
            maxWidth={ (Math.min(screenWidth, screenHeight, 480)) - 24 }
            maxHeight={ (Math.min(screenWidth, screenHeight / 2, 400)) - 24 }>
            <ViewShot ref={ viewshot }>
              <View
                beveled
                my={ 12 }
                style={ theme.components.card }>
                <Summary 
                  showcase
                  big={ /^big$/.test(shareFormat) }
                  showImage={ !/compact-(shortSummary|bullets)/.test(shareFormat) }
                  forceExpanded={ !/^compact$/.test(shareFormat) }
                  forceShortSummary={ /^big|compact-(shortSummary|bullets)$/.test(shareFormat) }
                  bulletsAsShortSummary={ /bullets/.test(shareFormat) }
                  disableInteractions
                  showFullDate
                  summary={ summary } />
                <Divider />
                <View height={ 20 } my={ 3 }>
                  <SvgUri
                    viewBox='328 0 724 338'
                    uri='https://www.readless.ai/logo.svg' 
                    height={ 20 } /> 
                </View>
              </View>
            </ViewShot>
          </ScrollView>
        </View>
      )}
      <View py={ 12 } alignCenter>
        {Object.values(actions).map((subactions, i) => (
          <View key={ i } height={ 120 } gap={ 12 }>
            <ScrollView horizontal>
              {subactions.map(({
                icon, label, onPress, imageUri = '',
              }, index) => (
                <View 
                  key={ index }
                  touchable
                  haptic
                  onPress={ onPress }>
                  <View
                    gap={ 6 }
                    width={ 120 }
                    p={ 12 }
                    justifyCenter
                    itemsCenter>
                    <View 
                      outlined 
                      p={ 12 } 
                      overflow="hidden" 
                      borderRadius={ 24 }>
                      {imageUri ? (
                        <Image
                          fallbackComponent={ 
                            icon && (typeof icon === 'string' ? <Icon name={ icon } size={ 24 } /> : icon)
                          }
                          source={ { uri: imageUri } }
                          width={ 48 }
                          height={ 48 }
                          m={ -12 } />
                      ) :
                        typeof icon === 'string' ? <Icon name={ icon } size={ 24 } /> : icon }
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