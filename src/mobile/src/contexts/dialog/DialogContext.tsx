import React from 'react';

import { registerSheet } from 'react-native-actions-sheet';
import { Provider } from 'react-native-paper';

import { DEFAULT_DIALOG_CONTEXT, Responder } from './types';

import { PublicSummaryAttributes } from '~/api';
import {
  AppearanceWalkthrough,
  CustomFeedWalkthrough,
  FeedbackDialog,
  MainMenuDialog,
  OnboardingWalkthrough,
  SentimentWalkthrough,
  ShareDialog,
  SubscribeDialog,
  TriggerWordsWalkthrough,
} from '~/components';

export const DialogContext = React.createContext(DEFAULT_DIALOG_CONTEXT);

export function DialogContextProvider({ children }: React.PropsWithChildren) {

  React.useEffect(() => {
    // global
    registerSheet('main-menu', MainMenuDialog);
    registerSheet('subscribe', SubscribeDialog);
    // onboarding/features
    registerSheet('appearance-walkthrough', AppearanceWalkthrough);
    registerSheet('custom-feed-walkthrough', CustomFeedWalkthrough);
    registerSheet('onboarding-walkthrough', OnboardingWalkthrough);
    registerSheet('sentiment-walkthrough', SentimentWalkthrough);
    registerSheet('trigger-words-walkthrough', TriggerWordsWalkthrough);
    // summary specific
    registerSheet('share', ShareDialog);
    registerSheet('feedback', FeedbackDialog);
  }, []);

  const [shareTarget, setShareTarget] = React.useState<PublicSummaryAttributes>();

  return (
    <DialogContext.Provider value={ {
      setShareTarget,
      shareTarget,
    } }>
      <Provider>
        {children}
      </Provider>
    </DialogContext.Provider>
  );
}
