import React from 'react';

import { SheetProps } from 'react-native-actions-sheet';
import { Social } from 'react-native-share';
import { SvgUri } from 'react-native-svg';
import ViewShot from 'react-native-view-shot';

import { PublicSummaryGroup, ReadingFormat } from '~/api';
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
import { LayoutContext, SessionContext } from '~/contexts';
import { useShare, useTheme } from '~/hooks';
import { strings } from '~/locales';

export const SHARE_FORMATS = [
  'big',
  'big-summary',
  'big-bullets',
  'compact-shortSummary',
  'compact-summary', 
  'compact-bullets',
  'compact',
] as const;

export type ShareFormat = typeof SHARE_FORMATS[number];

export type ShareDialogProps = {
  summary: PublicSummaryGroup;
  format?: ReadingFormat;
  onComplete?: (callback?: () => void) => Promise<unknown>;
  onClose?: () => void;
};

export type ShareDialogAction = {
  icon?: React.ReactNode;
  iconText?: string;
  imageUri?: string;
  label: string;
  onPress: () => void;
};

export function ShareDialog({
  payload,
  ...props
}: SheetProps<ShareDialogProps>) { 
 
  const theme = useTheme();
  const viewshot = React.useRef<ViewShot>(null);
  
  const { screenWidth, screenHeight } = React.useContext(LayoutContext);
  const { compactSummaries, preferredReadingFormat } = React.useContext(SessionContext);
  
  const {
    summary,
    format: format0,
    onClose,
  } = React.useMemo(() => ({ ...payload }), [payload]);
  
  const [shareFormat, setShareFormat] = React.useState<ShareFormat>(compactSummaries ? ((format0 || preferredReadingFormat) === ReadingFormat.Bullets ? 'compact-bullets' : 'compact-shortSummary') : ((format0 || preferredReadingFormat) === ReadingFormat.Bullets ? 'big-bullets' : 'big'));
  const format = React.useMemo(() => /bullets/i.test(shareFormat) ? ReadingFormat.Bullets : ReadingFormat.Summary, [shareFormat]);
  
  const {
    saveToCameraRoll,
    shareSocial, 
    shareStandard, 
  } = useShare({ callback: onClose });

  const actions: ShareDialogAction[][] = React.useMemo(() => {
    if (!summary || !viewshot) {
      return [];
    }
    const genericActions: ShareDialogAction[] = 
      [
        {
          icon: 'export-variant',
          label: strings.share_shareAsLink,
          onPress: () => shareStandard(summary, { format }), 
        },
        {
          icon: 'link-variant',
          label: strings.share_shareOriginalLink,
          onPress: () => shareStandard(summary, { originalUrl: true }),
        },
        {
          icon: 'download',
          label: strings.share_saveToCameraRoll,
          onPress: () => saveToCameraRoll(summary, { viewshot: viewshot.current }), 
        },
        {
          icon: 'camera-outline',
          label: strings.share_shareAsImage,
          onPress: () => shareStandard(summary, {
            format,
            viewshot: viewshot.current,
          }), 
        },
      ];
    const socialActions: ShareDialogAction[] =
      [
        {
          icon: 'facebook',
          label: strings.share_facebook,
          onPress: () => shareSocial(summary, {
            format,
            social: Social.Facebook,
          }), 
        },
        {
          icon: 'twitter',
          label: strings.share_twitter,
          onPress:() => shareSocial(summary, { 
            format,
            social: Social.Twitter,
            viewshot: viewshot.current, 
          }), 
        },
        {
          icon: 'instagram',
          label: strings.share_instagram,
          onPress: () => shareSocial(summary, {
            format,
            social: Social.Instagram,
            viewshot: viewshot.current,
          }), 
        },
        {
          icon: 'instagram',
          label: strings.share_instagramStories,
          onPress: () => shareSocial(summary, {
            format,
            social: Social.InstagramStories,
            viewshot: viewshot.current,
          }), 
        },
        {
          icon: 'linkedin',
          label: strings.share_linkedin,
          onPress: () => {
            shareSocial(summary, {
              format,
              social: Social.Linkedin,
              viewshot: viewshot.current,
            });
          },
        },
        {
          icon: 'send',
          label: strings.share_telegram,
          onPress: () => shareSocial(summary, {
            format,
            social: Social.Telegram,
            viewshot: viewshot.current,
          }),
        },
        {
          icon: 'whatsapp',
          label: strings.share_whatsapp,
          onPress: () => shareSocial(summary, {
            format,
            social: Social.Whatsapp,
          }),
        },
      ];
    const actions = [genericActions, socialActions];
    return actions;
  }, [format, saveToCameraRoll, shareSocial, shareStandard, summary]);

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
                  icon: 'text-long',
                  value: 'big-summary',
                },
                {
                  icon: 'format-list-text',
                  value: 'big-bullets',
                },
                {
                  icon: 'text-short',
                  value: 'compact-shortSummary',
                },
                {
                  icon: 'text',
                  value: 'compact-summary',
                },
                {
                  icon: 'format-list-bulleted',
                  value: 'compact-bullets',
                },
                {
                  icon: 'image-text',
                  value: 'compact',
                },
              ] } />
          </View>
          <ScrollView
            maxWidth={ (Math.min(screenWidth, screenHeight, 480)) - 24 }
            maxHeight={ (Math.min(screenHeight * 0.4, 480)) - 24 }>
            <ViewShot ref={ viewshot }>
              <View
                beveled
                my={ 12 }
                style={ theme.components.card }>
                <Summary 
                  showcase
                  big={ /^big/.test(shareFormat) }
                  showImage={ !/compact-(summary|shortSummary|bullets)/.test(shareFormat) }
                  forceExpanded={ !/^compact$/.test(shareFormat) }
                  forceShortSummary={ /^big|compact-(shortSummary|bullets)$/.test(shareFormat) }
                  bulletsAsShortSummary={ /bullets/.test(shareFormat) }
                  summaryAsShortSummary={ /summary/.test(shareFormat) }
                  disableInteractions
                  showFullDate
                  summary={ summary } />
                <Divider />
                <View height={ 20 } my={ 3 }>
                  <SvgUri
                    color={ theme.colors.text }
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
          <View key={ i } height={ 120 } gap={ 6 }>
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
                    width={ 100 }
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