import React from 'react';
import { Platform } from 'react-native';

import { SheetManager, SheetProps } from 'react-native-actions-sheet';

import { SubscriptionEvent } from '~/api';
import {
  Button,
  DateTimePicker,
  Text,
  View,
  Walkthrough,
  WalkthroughSliderRef,
  WalkthroughStep,
} from '~/components';
import { NotificationContext, StorageContext } from '~/contexts';
import { strings } from '~/locales';
import { usePlatformTools } from '~/utils';

export function OnboardingWalkthrough(props: SheetProps) {
  
  const { emitEvent } = usePlatformTools();
  const { viewFeature } = React.useContext(StorageContext);
  const { subscribe, unsubscribe } = React.useContext(NotificationContext);

  const [iLikeReading, setILikeReading] = React.useState(false);
  const [enableDailyReminders, setEnableDailyReminders] = React.useState(false);
  const [fireTime, setFireTime] = React.useState<Date>(new Date());

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
              contained
              onPress={ () => {
                emitEvent('poll-i-hate-reading');
                setILikeReading(false);
                console.log(walkthroughRef.current);
                walkthroughRef.current?.next?.();
              } }>
              {strings.misc_yesReading}
            </Button>
            <Button
              contained
              onPress={ () => {
                emitEvent('poll-the-news-is-negative');
                setILikeReading(false);
                console.log(walkthroughRef.current);
                walkthroughRef.current?.next?.();
              } }>
              {strings.misc_yesNegative}
            </Button>
            <Button
              contained
              onPress={ () => {
                emitEvent('poll-the-news-is-boring');
                setILikeReading(false);
                console.log(walkthroughRef.current);
                walkthroughRef.current?.next?.();
              } }>
              {strings.misc_yesBoring}
            </Button>
            <Button
              contained
              onPress={ () => {
                emitEvent('poll-reading-is-enjoyable');
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
                  setEnableDailyReminders(true);
                  subscribe({ event: SubscriptionEvent.DailyReminder });
                  walkthroughRef.current?.next?.();
                } }>
                {strings.misc_yes}
              </Button> 
              <Button
                contained
                onPress={ async () => {
                  setEnableDailyReminders(false);
                  unsubscribe({ event: SubscriptionEvent.DailyReminder });
                  walkthroughRef.current?.next?.();
                } }>
                {strings.misc_maybeLater}
              </Button>
              <Text subtitle1 textCenter>{strings.walkthroughs_onboarding_enableRemindersDescription2}</Text>
            </View>
          ),
          title: strings.walkthroughs_onboarding_enableReminders,
        }
      );
    }
    if (enableDailyReminders) {
      steps.push(
        {
          body: (
            <View itemsCenter gap={ 12 }>
              <DateTimePicker 
                value={ fireTime }
                onChange={ async (event, date) => {
                  if (event.type !== 'set') {
                    return;
                  }
                  if (date) {
                    const newDate = new Date();
                    newDate.setMonth(new Date().getMonth());
                    newDate.setFullYear(new Date().getFullYear());
                    if (date.getHours() < new Date().getHours()) {
                      newDate.setDate(new Date().getDate() + 1);
                    }
                    newDate.setHours(date.getHours());
                    newDate.setMinutes(date.getMinutes());
                    setFireTime(newDate);
                    await unsubscribe({ event: SubscriptionEvent.DailyReminder });
                    await subscribe({ 
                      body: strings.notifications_dailyReminderDescription, 
                      event: SubscriptionEvent.DailyReminder,
                      fireTime: newDate.toISOString(),
                      repeats: '1d',
                      title: strings.notifications_dailyReminder, 
                    });
                  }
                } }
                mode="time" />
            </View>
          ),
          title: strings.walkthroughs_onboarding_enableRemindersDescription3,
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
  }, [emitEvent, enableDailyReminders, fireTime, iLikeReading, onDone, subscribe, unsubscribe]);
  
  return (
    <Walkthrough
      { ...props }
      ref={ walkthroughRef }
      payload={ { onDone, steps } } />
  );
  
}