import React from 'react';

import { IconProps as RNIconProps } from 'react-native-elements';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { useTheme } from '~/hooks';

export type IconProps = RNIconProps;

export function Icon({ size = 24, ...other }: IconProps) {
  const theme = useTheme();
  return <MCIcon size={ size } color={ theme.colors.primary } { ...other } />;
}