import React from 'react';

import { registerSheet } from 'react-native-actions-sheet';
import { Provider } from 'react-native-paper';

import { DEFAULT_DIALOG_CONTEXT } from './types';

import {
  AppearanceWalkthrough,
  BookmarkWalkthrough,
  CustomFeedWalkthrough,
  FeedbackDialog,
  OnboardingWalkthrough,
  SentimentWalkthrough,
  ShareDialog,
  SharingWalkthrough,
  TriggerWordsWalkthrough,
  WhatsNewWalkthrough,
} from '~/components';

export const DialogContext = React.createContext(DEFAULT_DIALOG_CONTEXT);

export function DialogContextProvider({ children }: React.PropsWithChildren) {

  React.useEffect(() => {
    // onboarding/features
    registerSheet('appearance-walkthrough', AppearanceWalkthrough);
    registerSheet('bookmark-walkthrough', BookmarkWalkthrough);
    registerSheet('custom-feed-walkthrough', CustomFeedWalkthrough);
    registerSheet('onboarding-walkthrough', OnboardingWalkthrough);
    registerSheet('sentiment-walkthrough', SentimentWalkthrough);
    registerSheet('sharing-walkthrough', SharingWalkthrough);
    registerSheet('trigger-words-walkthrough', TriggerWordsWalkthrough);
    registerSheet('whats-new', WhatsNewWalkthrough);
    // summary specific
    registerSheet('share', ShareDialog);
    registerSheet('feedback', FeedbackDialog);
  }, []);

  return (
    <DialogContext.Provider value={ {} }>
      <Provider>
        {children}
      </Provider>
    </DialogContext.Provider>
  );
}
