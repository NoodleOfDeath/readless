import React from 'react';

import NavigationController from '~/NavigationController';
import {
  DialogContextProvider,
  IapContextProvider,
  LayoutContextProvider,
  MediaContextProvider,
  SessionContextProvider,
} from '~/contexts';

export default function App() {
  return (
    <SessionContextProvider>
      <IapContextProvider>
        <LayoutContextProvider>
          <DialogContextProvider>
            <MediaContextProvider>
              <NavigationController />
            </MediaContextProvider>
          </DialogContextProvider>
        </LayoutContextProvider>
      </IapContextProvider>
    </SessionContextProvider>
  );
}
