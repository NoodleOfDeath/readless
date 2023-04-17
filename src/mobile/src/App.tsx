import React from 'react';

import NavigationController from '~/NavigationController';
import {
  DialogContextProvider,
  MediaContextProvider,
  SessionContextProvider,
  ToastContextProvider,
} from '~/contexts';

export default function App() {
  return (
    <SessionContextProvider>
      <ToastContextProvider>
        <MediaContextProvider>
          <DialogContextProvider>
            <NavigationController />
          </DialogContextProvider>
        </MediaContextProvider>
      </ToastContextProvider>
    </SessionContextProvider>
  );
}
