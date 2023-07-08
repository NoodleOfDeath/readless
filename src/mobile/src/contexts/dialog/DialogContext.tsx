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
  PromoCodeWalkthrough,
  SentimentWalkthrough,
  ShareDialog,
  SharingWalkthrough,
  TriggerWordsWalkthrough,
} from '~/components';

export const DialogContext = React.createContext(DEFAULT_DIALOG_CONTEXT);

export function DialogContextProvider({ children }: React.PropsWithChildren) {

  React.useEffect(() => {
    // onboarding/features
    registerSheet('appearance-walkthrough', AppearanceWalkthrough);
    registerSheet('bookmark-walkthrough', BookmarkWalkthrough);
    registerSheet('custom-feed-walkthrough', CustomFeedWalkthrough);
    registerSheet('onboarding-walkthrough', OnboardingWalkthrough);
    registerSheet('promo-code-walkthrough', PromoCodeWalkthrough);
    registerSheet('sentiment-walkthrough', SentimentWalkthrough);
    registerSheet('sharing-walkthrough', SharingWalkthrough);
    registerSheet('trigger-words-walkthrough', TriggerWordsWalkthrough);
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
