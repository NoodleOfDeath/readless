import React from 'react';
import { useColorScheme } from 'react-native';

import { StorageContext } from '~/contexts';
import { DARK_THEME, LIGHT_THEME } from '~/contexts/paper';

// eslint-disable-next-line @typescript-eslint/ban-types
export function useTheme() {
  const preferences = React.useContext(StorageContext);
  const colorScheme = useColorScheme();
  return ((preferences.colorScheme && preferences.colorScheme !== 'system' ? preferences.colorScheme : colorScheme) === 'dark') ? DARK_THEME : LIGHT_THEME;
}
