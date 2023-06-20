import React from 'react';

import { IconProps as RNIconProps } from 'react-native-vector-icons/Icon';
import MCIcon from 'react-native-vector-icons/MaterialCommunityIcons';

import { ChildlessViewProps, View } from '~/components';
import { useTheme } from '~/hooks';

export type IconProps = RNIconProps & ChildlessViewProps;

export function Icon({
  size = 20, color, ...props 
}: IconProps) {
  const theme = useTheme();
  return (
    <View { ...props }>
      <MCIcon 
        size={ size } 
        color={ Object.keys(theme.colors).includes(color as string) ? theme.colors[color as keyof typeof theme.colors] : color ?? theme.colors.text } 
        { ...props } />
    </View>
  );
}