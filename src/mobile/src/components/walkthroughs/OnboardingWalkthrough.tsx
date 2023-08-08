import React from 'react';
import { Platform } from 'react-native';

import analytics from '@react-native-firebase/analytics';
import { SheetManager, SheetProps } from 'react-native-actions-sheet';

import { SubscriptionEvent } from '~/api';
import {
  Button,
  Text,
  View,
  Walkthrough,
  WalkthroughSliderRef,
  WalkthroughStep,
} from '~/components';
import { NotificationContext, SessionContext } from '~/contexts';
import { strings } from '~/locales';

export function OnboardingWalkthrough(props: SheetProps) {
  
  const {
    enablePush, pushNotificationsEnabled, viewFeature, 
  } = React.useContext(SessionContext);
  const { registerRemoteNotifications } = React.useContext(NotificationContext);

  const [iLikeReading, setILikeReading] = React.useState(false);

  const walkthroughRef = React.useRef<WalkthroughSliderRef>(null);
  
  const onDone = React.useCallback(async () => {
    await viewFeature(props.sheetId);
    await SheetManager.hide(props.sheetId);
  }, [props.sheetId, viewFeature]);
  
  const steps = React.useMemo(() => {
    const steps: WalkthroughStep[] = [
      {
        body: (
          <View itemsCenter gap={ 12 }>
            <Button
              h4
              contained
              onPress={ () => {
                analytics().logEvent('poll_reading_is_a_pain');
                setILikeReading(false);
                console.log(walkthroughRef.current);
                walkthroughRef.current?.next?.();
              } }>
              {strings.misc_yesPain}
            </Button>
            <Button
              h4
              contained
              onPress={ () => {
                analytics().logEvent('poll_the_news_is_negative');
                setILikeReading(false);
                console.log(walkthroughRef.current);
                walkthroughRef.current?.next?.();
              } }>
              {strings.misc_yesNegative}
            </Button>
            <Button
              h4
              contained
              onPress={ () => {
                analytics().logEvent('poll_the_news_is_boring');
                setILikeReading(false);
                console.log(walkthroughRef.current);
                walkthroughRef.current?.next?.();
              } }>
              {strings.misc_yesBoring}
            </Button>
            <Button
              h4
              contained
              onPress={ () => {
                analytics().logEvent('poll_reading_is_enjoyable');
                setILikeReading(true);
                walkthroughRef.current?.next?.();
              } }>
              {strings.misc_iEnjoyReading}
            </Button>
            <Text subtitle1 textCenter>{strings.walkthroughs_onboarding_isReadingForYouAChoreDescription}</Text>
          </View>
        ),
        title: strings.walkthroughs_onboarding_isReadingForYouAChore,
      },
    ];
    if (!iLikeReading) {
      steps.push(
        {
          body: (
            <View itemsCenter gap={ 12 }>
              <Text subtitle1 textCenter>{strings.walkthroughs_onboarding_enableRemindersDescription}</Text>
              <Button
                contained
                onPress={ async () => {
                  await registerRemoteNotifications();
                  await enablePush(SubscriptionEvent.DailyReminder, {
                    body: '',
                    title: '',
                  });
                } }>
                {strings.misc_yes}
              </Button> 
              <Text subtitle1 textCenter>{strings.walkthroughs_onboarding_enableRemindersDescription2}</Text>
            </View>
          ),
          title: strings.walkthroughs_onboarding_enableReminders,
        }
      );
    }
    if (pushNotificationsEnabled) {
      steps.push(
        {
          body: (
            <View itemsCenter gap={ 12 }>
              <Text subtitle1 textCenter>{strings.walkthroughs_onboarding_enableRemindersDescription}</Text>
              <Text subtitle1 textCenter>{strings.walkthroughs_onboarding_enableRemindersDescription2}</Text>
            </View>
          ),
          title: strings.walkthroughs_onboarding_enableReminders,
        }
      );
    }
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
  }, [iLikeReading, onDone, pushNotificationsEnabled]);
  
  return (
    <Walkthrough
      { ...props }
      ref={ walkthroughRef }
      payload={ { onDone, steps } } />
  );
  
}