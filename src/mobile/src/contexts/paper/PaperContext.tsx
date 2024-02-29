import React from 'react';

import {
  DefaultTheme,
  MD3DarkTheme,
  PaperProvider,
} from 'react-native-paper';

import { useTheme } from '~/hooks';

export const PaperContextProvider = ({ children }: React.PropsWithChildren) => {
  const theme = useTheme();
  const currentTheme = React.useMemo(() => theme.isDarkMode ? MD3DarkTheme : DefaultTheme, [theme.isDarkMode]);
  return (
    <PaperProvider theme={ currentTheme }>
      {children}
    </PaperProvider>
  );
};