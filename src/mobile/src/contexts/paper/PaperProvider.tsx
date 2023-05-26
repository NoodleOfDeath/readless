import React from 'react';
import { useColorScheme } from 'react-native';

import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider as RNPaperProvider,
} from 'react-native-paper';

import { SessionContext } from '..';

export function PaperProvider({ children }: React.PropsWithChildren) {

  const { preferences: { displayMode } } = React.useContext(SessionContext);

  const darkMode = useColorScheme() === 'dark';
  const theme = React.useMemo(() => (displayMode === 'dark' || darkMode) ? MD3DarkTheme : MD3LightTheme, [darkMode, displayMode]);

  return (
    <RNPaperProvider theme={ theme }>
      {children}
    </RNPaperProvider>
  );

}