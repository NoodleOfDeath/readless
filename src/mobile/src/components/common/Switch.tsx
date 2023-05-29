import React from 'react';

import { Switch as RNSwitch, SwitchProps as RNSwitchProps } from 'react-native-paper';

import {
  Text,
  View,
  ViewProps,
} from '~/components';
import { useStyles, useTheme } from '~/hooks';

export type SwitchProps = ViewProps & RNSwitchProps & {
  leftLabel?: React.ReactNode;
  rightLabel?: React.ReactNode;
  spacing?: number;
};

export const Switch = ({
  leftLabel,
  rightLabel,
  gap = 10,
  ...props
}: SwitchProps) => {
  const theme = useTheme();
  const style = useStyles(props);
  return (
    <View col style={ style }>
      <View row style={ style } gap={ gap } alignCenter>
        { typeof leftLabel === 'string' ? <Text>{ leftLabel }</Text> : leftLabel }
        <RNSwitch { ...props } color={ theme.colors.primary } />
        { typeof rightLabel === 'string' ? <Text>{ rightLabel }</Text> : rightLabel }
      </View>
    </View>
  );
};