import React from 'react';

import { Switch as RNSwitch, SwitchProps as RNSwitchProps } from 'react-native-paper';

import { ViewProps } from '~/components';
import { useStyles, useTheme } from '~/hooks';

export type SwitchProps = ViewProps & RNSwitchProps;

export const Switch = (props: SwitchProps) => {
  const theme = useTheme();
  const style = useStyles(props);
  return <RNSwitch { ...props } color={ theme.colors.primary } style={ style } />;
};