import React from 'react';

import { SheetManager, SheetProps } from 'react-native-actions-sheet';

import {
  Button,
  Chip,
  Divider,
  Icon,
  Markdown,
  Text,
  View,
  Walkthrough,
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
  
  const steps = React.useMemo(() => [
    {
      artwork: 'https://readless.nyc3.cdn.digitaloceanspaces.com/img/guides/walkthrough-accessible-news.png',
      body: (
        <View gap={ 12 } itemsCenter>
          <Markdown subtitle1 textCenter system contained>
            {strings.walkthroughs_onboarding_beingInformed}
          </Markdown>
          <Markdown subtitle1 textCenter system>
            {strings.walkthroughs_onboarding_inTodaysWorld}
          </Markdown>
          <View col />
        </View>
      ),
      title: strings.walkthroughs_onboarding_newsShouldBeAccessible,
    },
    {
      artwork: (
        <View
          width="100%"
          mt={ 24 }
          itemsCenter
          gap={ 12 }>
          <Chip
            contained
            subtitle1
            textCenter
            py={ 24 }>
            {'"Having Neanderthal Ancestors Could Mean You Have This Debilitating Trait!"'}
          </Chip>
          <Icon name="arrow-down-bold" size={ 48 } />
          <Chip
            contained
            textCenter
            subtitle1
            py={ 24 }>
            {'"Neanderthal DNA linked to common hand condition (Dupuytren\'s contracture)"'}
          </Chip>
        </View>
      ),
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
          <Text subtitle1 textCenter system>
            {strings.walkthroughs_onboarding_fromNewsHeadlines}
          </Text>
        </View>
      ),
      title: strings.walkthroughs_onboarding_readlessUses,
    },
    {
      artwork: 'https://readless.nyc3.cdn.digitaloceanspaces.com/img/guides/walkthrough-granular-control.png',
      body: (
        <View gap={ 24 }>
          <Markdown subtitle1 textLeft mr={ 64 } system contained>
            {strings.walkthroughs_onboarding_granularControl}
          </Markdown>
          <Markdown subtitle1 textRight ml={ 64 } system contained>
            {strings.walkthroughs_onboarding_separateFromSocialMedia}
          </Markdown>
          <Markdown subtitle1 textLeft mr={ 64 } system contained>
            {strings.walkthroughs_onboarding_withoughtNeedingAnAccount}
          </Markdown>
        </View>
      ),
      title: strings.walkthroughs_onboarding_madeWithYouInMind,
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
    },
  ], [onDone]);
  
  return (
    <Walkthrough
      { ...props }
      payload={ { onDone, steps } } />
  );
  
}