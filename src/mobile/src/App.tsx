import React from 'react';

import NavigationController from '~/NavigationController';
import {
  DialogContextProvider,
  MediaContextProvider,
  PaperProvider,
  SessionContextProvider,
  ToastContextProvider,
} from '~/contexts';

export default function App() {

  return (
    <SessionContextProvider>
      <PaperProvider>
        <ToastContextProvider>
          <MediaContextProvider>
            <DialogContextProvider>
              <NavigationController />
            </DialogContextProvider>
          </MediaContextProvider>
        </ToastContextProvider>
      </PaperProvider>
    </SessionContextProvider>
  );
}
