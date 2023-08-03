import React from 'react';

import NavigationController from '~/NavigationController';
import {
  LayoutContextProvider,
  MediaContextProvider,
  NotificationContextProvider,
  SessionContextProvider,
} from '~/contexts';

export default function App() {
  return (
    <SessionContextProvider>
      <LayoutContextProvider>
        <NotificationContextProvider>
          <MediaContextProvider>
            <NavigationController />
          </MediaContextProvider>
        </NotificationContextProvider>
      </LayoutContextProvider>
    </SessionContextProvider>
  );
}
