import React from 'react';

import NavigationController from '~/NavigationController';
import { AppStateContextProvider, SessionContextProvider } from '~/contexts';

export default function App() {
  return (
    <SessionContextProvider>
      <AppStateContextProvider>
        <NavigationController />
      </AppStateContextProvider>
    </SessionContextProvider>
  );
}
