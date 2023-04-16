import React from 'react';

import { IconProps as RNIconProps } from '@rneui/base';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { View, ViewProps } from '~/components';
import { useStyles, useTheme } from '~/hooks';

export type IconProps = RNIconProps & ViewProps;

export function Icon({
  size = 24, color, ...other 
}: IconProps) {
  const theme = useTheme();
  const style = useStyles(other);
  return (
    <View style={ style }>
      <MCIcon size={ size } color={ Object.keys(theme.colors).includes(color as string) ? theme.colors[color] : color ?? theme.colors.text } { ...other } />
    </View>
  );
}