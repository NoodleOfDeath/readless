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
      <MediaContextProvider>
        <DialogContextProvider>
          <NavigationController />
        </DialogContextProvider>
      </MediaContextProvider>
    </SessionContextProvider>
  );
}
