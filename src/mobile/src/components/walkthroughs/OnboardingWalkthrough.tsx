import React from 'react';

import { SheetManager, SheetProps } from 'react-native-actions-sheet';

import {
  Button,
  Divider,
  Icon,
  Image,
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
      body: (
        <View gap={ 12 } itemsCenter>
          <View>
            <Image 
              rounded
              overflow='hidden'
              elevated
              width={ 300 }
              height={ 200 }
              resizeMode="contain"
              source={ { uri: 'https://readless.nyc3.cdn.digitaloceanspaces.com/img/guides/meme.jpg' } } />
            <Text subscript>{`${strings.walkthroughs_onboarding_imageCourtesyOf} ImageFlip`}</Text>
          </View>
          <Divider />
          <Markdown subtitle1 textCenter>
            {strings.walkthroughs_onboarding_beingInformed}
          </Markdown>
          <Markdown subtitle1 textCenter>
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
          mt={ 24 }
          itemsCenter
          mx={ 32 }
          gap={ 12 }>
          <View elevated rounded p={ 12 }>
            <Text subtitle1 bold textCenter>
              {'"Having Neanderthal Ancestors Could Mean You Have This Debilitating Trait!"'}
            </Text>
          </View>
          <Icon name="arrow-down-bold" size={ 48 } />
          <View elevated rounded p={ 12 }>
            <Text subtitle1 bold textCenter>
              {'"Neanderthal DNA linked to common hand condition (Dupuytren\'s contracture)"'}
            </Text>
          </View>
        </View>
      ),
      body: (
        <View gap={ 48 }>
          <View>
            <Text h5 bold textLeft>
              {strings.walkthroughs_onboarding_minimizeBias}
            </Text>
            <Text h5 bold textCenter>
              {strings.walkthroughs_onboarding_reduceClickbait}
            </Text>
            <Text h5 bold textRight>
              {strings.walkthroughs_onboarding_extractTheFacts}
            </Text>
            <Text subtitle1 textCenter>
              {strings.walkthroughs_onboarding_fromNewsHeadlines}
            </Text>
          </View>
        </View>
      ),
      title: strings.walkthroughs_onboarding_readlessUses,
    },
    {
      body: (
        <View gap={ 24 }>
          <Markdown subtitle1 textLeft mr={ 64 }>
            {strings.walkthroughs_onboarding_granularControl}
          </Markdown>
          <Markdown subtitle1 textRight ml={ 64 }>
            {strings.walkthroughs_onboarding_separateFromSocialMedia}
          </Markdown>
          <Markdown subtitle1 textLeft mr={ 64 }>
            {strings.walkthroughs_onboarding_withoughtNeedingAnAccount}
          </Markdown>
        </View>
      ),
      title: strings.walkthroughs_onboarding_madeWithYouInMind,
    },
    {
      body: (
        <View itemsCenter gap={ 24 }>
          <Button
            h4
            elevated
            rounded
            p={ 6 }
            onPress={ onDone }>
            {strings.walkthroughs_onboarding_yesLetsGetStarted}
          </Button>
          <Divider />
          <Text subtitle1 textCenter>
            {strings.walkthroughs_onboarding_subscribe}
          </Text>
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