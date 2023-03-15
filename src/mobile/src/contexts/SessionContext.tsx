import { BottomTabNavigationOptions } from '@react-navigation/bottom-tabs';
import React from 'react';

export type SessionContextType = {
  tabControllerScreenOptions: BottomTabNavigationOptions;
  setTabControllerScreenOptions: React.Dispatch<
    React.SetStateAction<BottomTabNavigationOptions>
  >;
};

export const SessionContext = React.createContext<SessionContextType>({
  tabControllerScreenOptions: { headerShown: true },
  setTabControllerScreenOptions: () => {
    /** placeholder */
  },
});

export default function SessionContextProvider({ children }: React.PropsWithChildren) {
  const [tabControllerScreenOptions, setTabControllerScreenOptions] =
    React.useState<BottomTabNavigationOptions>({});

  return (
    <SessionContext.Provider
      value={{
        tabControllerScreenOptions,
        setTabControllerScreenOptions,
      }}
    >
      {children}
    </SessionContext.Provider>
  );
}
