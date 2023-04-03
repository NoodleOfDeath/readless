import React from 'react';

import { IconProps as RNIconProps } from 'react-native-elements';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

export type IconProps = RNIconProps;

export function Icon({ size = 24, ...other }: IconProps) {
  return <MCIcon size={ size } { ...other } />;
}