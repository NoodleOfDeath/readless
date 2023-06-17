import React from 'react';

import { Switch as RNSwitch, SwitchProps as RNSwitchProps } from 'react-native-paper';

import { Text, View } from '~/components';
import { useTheme } from '~/hooks';

export type SwitchProps = RNSwitchProps & {
  leftLabel?: JSX.Element | JSX.Element[];
  rightLabel?: JSX.Element | JSX.Element[];
  spacing?: number;
};

export const Switch = ({
  leftLabel,
  rightLabel,
  ...props
}: SwitchProps) => {
  const theme = useTheme();
  return (
    <View flexRow alignCenter gap={ 12 }>
      { typeof leftLabel === 'string' ? <Text>{ leftLabel }</Text> : leftLabel }
      <RNSwitch { ...props } color={ theme.colors.primary } />
      { typeof rightLabel === 'string' ? <Text>{ rightLabel }</Text> : rightLabel }
    </View>
  );
};