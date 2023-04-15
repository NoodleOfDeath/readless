import React from 'react';

import NavigationController from '~/NavigationController';
import {
  AppStateContextProvider,
  MediaContextProvider,
  SessionContextProvider,
  ToastContextProvider,
} from '~/contexts';

export default function App() {
  return (
    <SessionContextProvider>
      <AppStateContextProvider>
        <MediaContextProvider>
          <ToastContextProvider>
            <NavigationController />
          </ToastContextProvider>
        </MediaContextProvider>
      </AppStateContextProvider>
    </SessionContextProvider>
  );
}
