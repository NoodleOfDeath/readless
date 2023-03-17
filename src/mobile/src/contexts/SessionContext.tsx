import React from 'react';

import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';

export type SessionContextType = {
  tabControllerScreenOptions: BottomTabNavigationOptions;
  setTabControllerScreenOptions: React.Dispatch<
    React.SetStateAction<BottomTabNavigationOptions>
  >;
};

export const SessionContext = React.createContext<SessionContextType>({
  setTabControllerScreenOptions: () => {
    /** placeholder */
  },
  tabControllerScreenOptions: { headerShown: true },
});

export default function SessionContextProvider({ children }: React.PropsWithChildren) {
  const [tabControllerScreenOptions, setTabControllerScreenOptions] =
    React.useState<BottomTabNavigationOptions>({});

  return (
    <SessionContext.Provider
      value={ {
        setTabControllerScreenOptions,
        tabControllerScreenOptions,
      } }>
      {children}
    </SessionContext.Provider>
  );
}
