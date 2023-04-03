import React from 'react';

import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';

import { SessionContextProvider } from '~/core';

export type AppStateContextType = {
  screenOptions: BottomTabNavigationOptions;
  setScreenOptions: React.Dispatch<
    React.SetStateAction<BottomTabNavigationOptions>
  >;
};

export const AppStateContext = React.createContext<AppStateContextType>({
  screenOptions: { headerShown: true },
  setScreenOptions: () => {
    /** placeholder */
  },
});

export function AppStateContextProvider({ children }: React.PropsWithChildren) {
  const [screenOptions, setScreenOptions] =
    React.useState<BottomTabNavigationOptions>({});
  return (
    <AppStateContext.Provider value={ {
      screenOptions,
      setScreenOptions,
    } }>
      <SessionContextProvider>
        {children}
      </SessionContextProvider>
    </AppStateContext.Provider>
  );
}
