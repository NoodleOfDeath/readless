import React from 'react';

import RNDateTimePicker from '@react-native-community/datetimepicker';

import { useTheme } from '~/hooks';

export type DateTimePickerProps = Parameters<typeof RNDateTimePicker>[0];

export function DateTimePicker(props: DateTimePickerProps) {
  const theme = useTheme();
  return (
    <RNDateTimePicker
      themeVariant={ theme.isDarkMode ? 'dark' : 'light' }
      { ...props } />
  );
}