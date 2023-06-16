import React from 'react';

import {
  HStack,
  ISwitchProps,
  Switch as RNSwitch,
  Text,
} from 'native-base';

import { useTheme } from '~/hooks';

export type SwitchProps = ISwitchProps & {
  leftLabel?: React.ReactNode;
  rightLabel?: React.ReactNode;
  spacing?: number;
};

export const Switch = ({
  leftLabel,
  rightLabel,
  ...props
}: SwitchProps) => {
  const theme = useTheme();
  return (
    <HStack>
      { typeof leftLabel === 'string' ? <Text>{ leftLabel }</Text> : leftLabel }
      <RNSwitch { ...props } color={ theme.colors.primary } />
      { typeof rightLabel === 'string' ? <Text>{ rightLabel }</Text> : rightLabel }
    </HStack>
  );
};