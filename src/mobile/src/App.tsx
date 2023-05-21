import React from 'react';
import { useColorScheme } from 'react-native';

import {
  MD2DarkTheme,
  MD3LightTheme,
  PaperProvider,
} from 'react-native-paper';

import NavigationController from '~/NavigationController';
import {
  DialogContextProvider,
  MediaContextProvider,
  SessionContextProvider,
  ToastContextProvider,
} from '~/contexts';

export default function App() {

  const colorScheme = useColorScheme();
  const theme = React.useMemo(() => colorScheme === 'dark' ? MD2DarkTheme : MD3LightTheme, [colorScheme]);

  return (
    <SessionContextProvider>
      <PaperProvider theme={ theme }>
        <ToastContextProvider>
          <MediaContextProvider>
            <DialogContextProvider>
              <NavigationController />
            </DialogContextProvider>
          </MediaContextProvider>
        </ToastContextProvider>
      </PaperProvider>
    </SessionContextProvider>
  );
}
