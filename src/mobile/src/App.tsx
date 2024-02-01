import React from 'react';

import { registerSheet } from 'react-native-actions-sheet';
import { Provider } from 'react-redux';

import { FeedbackDialog, ShareDialog } from './components';
import { PaperContextProvider } from './contexts/paper';

import {
  LayoutContextProvider,
  MediaContextProvider,
  NotificationContextProvider,
  StorageContextProvider,
  ToastContextProvider,
} from '~/contexts';
import store from '~/core/store';
import { RootNavigator } from '~/navigation';

// summary specific
registerSheet('share', ShareDialog);
registerSheet('feedback', FeedbackDialog);

export default function App() {
  return (
    <LayoutContextProvider>
      <StorageContextProvider>
        <Provider store={ store }>
          <PaperContextProvider>
            <ToastContextProvider>
              <NotificationContextProvider>
                <MediaContextProvider>
                  <RootNavigator />
                </MediaContextProvider>
              </NotificationContextProvider>
            </ToastContextProvider>
          </PaperContextProvider>
        </Provider>
      </StorageContextProvider>
    </LayoutContextProvider>
  );
}
