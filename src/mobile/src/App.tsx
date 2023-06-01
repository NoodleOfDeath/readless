import React from 'react';

import NavigationController from '~/NavigationController';
import {
  DialogContextProvider,
  IapContextProvider,
  MediaContextProvider,
  SessionContextProvider,
} from '~/contexts';

export default function App() {
  return (
    <SessionContextProvider>
      <IapContextProvider>
        <DialogContextProvider>
          <MediaContextProvider>
            <NavigationController />
          </MediaContextProvider>
        </DialogContextProvider>
      </IapContextProvider>
    </SessionContextProvider>
  );
}
