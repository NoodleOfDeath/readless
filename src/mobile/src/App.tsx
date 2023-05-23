import React from 'react';

import NavigationController from '~/NavigationController';
import {
  DialogContextProvider,
  MediaContextProvider,
  PaperProvider,
  SessionContextProvider,
} from '~/contexts';

export default function App() {

  return (
    <SessionContextProvider>
      <PaperProvider>
        <MediaContextProvider>
          <DialogContextProvider>
            <NavigationController />
          </DialogContextProvider>
        </MediaContextProvider>
      </PaperProvider>
    </SessionContextProvider>
  );
}
