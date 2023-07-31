import React from 'react';
import { Platform } from 'react-native';

import { SheetManager, SheetProps } from 'react-native-actions-sheet';

import {
  Button,
  Chip,
  Text,
  View,
  Walkthrough,
  WalkthroughStep,
} from '~/components';
import { Bookmark, SessionContext } from '~/contexts';
import { strings } from '~/locales';

export function OnboardingWalkthrough(props: SheetProps) {
  
  const { setPreference } = React.useContext(SessionContext);
  
  const onDone = React.useCallback(async () => {
    setPreference('viewedFeatures', (prev) => {
      const state = { ...prev };
      state[props.sheetId] = new Bookmark(true);
      return (prev = state);
    });
    await SheetManager.hide(props.sheetId);
  }, [props.sheetId, setPreference]);
  
  const steps = React.useMemo(() => {
    const steps: WalkthroughStep[] = [
      {
        artwork: 'https://readless.nyc3.cdn.digitaloceanspaces.com/img/guides/walkthrough-accessible-news.png',
        body: (
          <View gap={ 12 }>
            <Chip 
              subtitle1
              bold
              contained
              justifyStart
              leftIcon="check"
              gap={ 6 }
              system>
              {strings.walkthroughs_onboarding_minimizeBias}
            </Chip>
            <Chip 
              subtitle1
              bold
              contained
              leftIcon="check"
              gap={ 6 }
              justifyStart
              system>
              {strings.walkthroughs_onboarding_reduceClickbait}
            </Chip>
            <Chip 
              subtitle1
              bold
              contained
              leftIcon="check"
              gap={ 6 }
              justifyStart
              system>
              {strings.walkthroughs_onboarding_extractTheFacts}
            </Chip>
            <Chip 
              subtitle1
              bold
              contained
              leftIcon="check"
              gap={ 6 }
              justifyStart
              system>
              {strings.walkthroughs_onboarding_measureSentiment}
            </Chip>
            <Text bold subtitle1 textCenter system>
              {strings.walkthroughs_onboarding_fromNewsHeadlines}
            </Text>
          </View>
        ),
        title: strings.walkthroughs_onboarding_readlessUses,
      },
    ];
    if (Platform.OS === 'ios') {
      steps.push({
        artwork: 'https://readless.nyc3.digitaloceanspaces.com/img/guides/short-press-preview.gif',
        tallImage: true,
        title: strings.walkthroughs_onboarding_shortPress,
      });
    }
    steps.push(
      {
        artwork: 'https://readless.nyc3.digitaloceanspaces.com/img/guides/sentiment-preview.gif',
        tallImage: true,
        title: strings.walkthroughs_onboarding_readSentiment,
      },
      {
        artwork: 'https://readless.nyc3.digitaloceanspaces.com/img/guides/settings-preview.gif',
        tallImage: true,
        title: strings.walkthroughs_onboarding_settings,
      },
      {
        artwork: 'https://readless.nyc3.cdn.digitaloceanspaces.com/img/guides/walkthrough-start-reading.png',
        body: (
          <View itemsCenter gap={ 12 }>
            <Button
              h4
              contained
              onPress={ onDone }>
              {strings.walkthroughs_onboarding_yesLetsGetStarted}
            </Button>
          </View>
        ),
        title: strings.walkthroughs_onboarding_areYouReady,
      }
    );
    return steps;
  }, [onDone]);
  
  return (
    <Walkthrough
      { ...props }
      payload={ { onDone, steps } } />
  );
  
}