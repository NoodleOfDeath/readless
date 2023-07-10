import React from 'react';

import { Badge as RNBadge, useTheme } from 'react-native-paper';

import { TextProps, ViewProps } from '~/components';
import { useStyles, useTextStyles } from '~/hooks';

export type BadgeProps = ViewProps & TextProps & Parameters<typeof RNBadge>[0] & {
  topLeft?: boolean;
  topRight?: boolean;
  bottomLeft?: boolean;
  bottomRight?: boolean;
  small?: boolean;
  big?: boolean;
};

export function Badge({
  topLeft,
  topRight,
  bottomLeft,
  bottomRight,
  absolute = topLeft || topRight || bottomLeft || bottomRight,
  top = (topLeft || topRight) ? -2 : undefined,
  bottom = (bottomLeft || bottomRight) ? -2 : undefined,
  left = (topLeft || bottomLeft) ? -2 : undefined,
  right = (topRight || bottomRight) ? -2 : undefined,
  small,
  big,
  size = small ? 16 : big ? 36 : undefined,
  color = 'contrastText',
  fontSize = small ? 12 : big ? 24 : undefined,
  zIndex = 100,
  ...props
}: BadgeProps) {
  const theme = useTheme();
  const style = useStyles({ 
    ...props, 
    absolute,
    bg: theme.colors.primary, 
    bottom, 
    left,
    right,
    top,
    zIndex,
  });
  const textStyle = useTextStyles({ color, fontSize });
  return (
    <RNBadge
      size={ size }
      itemsCenter
      justifyCenter
      textCenter
      { ...props }
      style={ [style, textStyle] } />
  );
}