import React from 'react';

import { NativeBaseProvider } from 'native-base';

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
    <NativeBaseProvider>
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
    </NativeBaseProvider>
  );
}
