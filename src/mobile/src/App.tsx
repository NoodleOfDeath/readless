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
      <DialogContextProvider>
        <MediaContextProvider>
          <ToastContextProvider>
            <NavigationController />
          </ToastContextProvider>
        </MediaContextProvider>
      </DialogContextProvider>
    </SessionContextProvider>
  );
}
