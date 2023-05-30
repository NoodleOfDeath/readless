import React from 'react';

import NavigationController from '~/NavigationController';
import {
  DialogContextProvider,
  MediaContextProvider,
  SessionContextProvider,
} from '~/contexts';

export default function App() {

  return (
    <SessionContextProvider>
      <DialogContextProvider>
        <MediaContextProvider>
          <NavigationController />
        </MediaContextProvider>
      </DialogContextProvider>
    </SessionContextProvider>
  );
}
