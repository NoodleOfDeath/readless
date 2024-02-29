import React from 'react';
import { Platform } from 'react-native';

import RNDateTimePicker, {
  AndroidNativeProps,
  DateTimePickerAndroid,
  IOSNativeProps,
} from '@react-native-community/datetimepicker';

import { Text } from '~/components';
import { useTheme } from '~/hooks';

export type DateTimePickerProps = IOSNativeProps;

export function DateTimePicker(props: DateTimePickerProps) {
  const theme = useTheme();

  if (Platform.OS === 'android') {
    return (
      <Text
        disabled={ props.disabled }
        onPress={ async () => {
          DateTimePickerAndroid.open({
            mode: props.mode as AndroidNativeProps['mode'],
            onChange: (...args) => {
              DateTimePickerAndroid.dismiss(props.mode as AndroidNativeProps['mode']);
              props.onChange?.(...args);
            },
            value: props.value,
          });
        } }>
        {props.value?.toLocaleTimeString()}
      </Text>
    );
  }

  return (
    <RNDateTimePicker
      { ...props }
      themeVariant={ theme.isDarkMode ? 'dark' : 'light' } />
  );
}