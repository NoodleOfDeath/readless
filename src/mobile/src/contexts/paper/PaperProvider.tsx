import React from 'react';

import {
  MD3DarkTheme,
  MD3LightTheme,
  PaperProvider as RNPaperProvider,
} from 'react-native-paper';

import { useTheme } from '~/hooks';

export function PaperProvider({ children }: React.PropsWithChildren) {

  const darkMode = useTheme().navContainerTheme.dark;
  const theme = React.useMemo(() => darkMode ? MD3DarkTheme : MD3LightTheme, [darkMode]);

  React.useEffect(() => console.log(theme.dark), [theme]);

  return (
    <RNPaperProvider theme={ theme }>
      {children}
    </RNPaperProvider>
  );

}