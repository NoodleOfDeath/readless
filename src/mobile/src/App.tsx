import React from 'react';

import { registerSheet } from 'react-native-actions-sheet';

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
} from './components';

import {
  LayoutContextProvider,
  MediaContextProvider,
  NotificationContextProvider,
  SessionContextProvider,
} from '~/contexts';
import { RootNavigator } from '~/navigation';

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

export default function App() {
  return (
    <SessionContextProvider>
      <LayoutContextProvider>
        <NotificationContextProvider>
          <MediaContextProvider>
            <RootNavigator />
          </MediaContextProvider>
        </NotificationContextProvider>
      </LayoutContextProvider>
    </SessionContextProvider>
  );
}
