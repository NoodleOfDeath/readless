import React from 'react';

import { registerSheet } from 'react-native-actions-sheet';

import { FeedbackDialog, ShareDialog } from './components';
import { PaperContextProvider } from './contexts/paper';

import {
  LayoutContextProvider,
  MediaContextProvider,
  NotificationContextProvider,
  StorageContextProvider,
  ToastContextProvider,
} from '~/contexts';
import { RootNavigator } from '~/navigation';

// summary specific
registerSheet('share', ShareDialog);
registerSheet('feedback', FeedbackDialog);

export default function App() {
  return (
    <LayoutContextProvider>
      <StorageContextProvider>
        <PaperContextProvider>
          <ToastContextProvider>
            <NotificationContextProvider>
              <MediaContextProvider>
                <RootNavigator />
              </MediaContextProvider>
            </NotificationContextProvider>
          </ToastContextProvider>
        </PaperContextProvider>
      </StorageContextProvider>
    </LayoutContextProvider>
  );
}
