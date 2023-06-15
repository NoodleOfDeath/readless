import React from 'react';

import { SheetManager, SheetProps } from 'react-native-actions-sheet';

import {
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
        <View>
          <Markdown textCenter>
            Read Less uses **large language models** to summarize news articles and provide **sentiment analysis.**
          </Markdown>
        </View>
      ),
      title: strings.walkthroughs_onboarding_welcome,
    },
    {
      body: (
        <View>
          <Markdown textCenter>
            Read Less uses **large language models** to summarize news articles and provide **sentiment analysis.**
          </Markdown>
        </View>
      ),
      title: strings.walkthroughs_onboarding_addCategories,
    },
    {
      body: (
        <View>
          <Markdown textCenter>
            Read Less uses **large language models** to summarize news articles and provide **sentiment analysis.**
          </Markdown>
        </View>
      ),
      title: strings.walkthroughs_onboarding_addNewsSources,
    },
    {
      body: (
        <View>
          <Markdown textCenter>
            The news will always be free because being informed is a **human right**, but as we scale up, you can enjoy enteraining features like daily/weekly/monthly recaps and premium text-to-speech voices through a subscription.
          </Markdown>
        </View>
      ),
      title: 'Subscriptions',
    },
  ], []);
  
  return (
    <Walkthrough
      { ...props }
      payload={ { onDone, steps } } />
  );
  
}