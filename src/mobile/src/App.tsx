import React from 'react';

import NavigationController from '~/NavigationController';
import {
  DialogContextProvider,
  LayoutContextProvider,
  MediaContextProvider,
  SessionContextProvider,
} from '~/contexts';

export default function App() {
  return (
    <SessionContextProvider>
      <LayoutContextProvider>
        <DialogContextProvider>
          <MediaContextProvider>
            <NavigationController />
          </MediaContextProvider>
        </DialogContextProvider>
      </LayoutContextProvider>
    </SessionContextProvider>
  );
}
