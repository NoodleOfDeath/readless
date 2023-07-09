import React from 'react';

import { Badge as RNBadge } from 'react-native-paper';

import { ViewProps } from '~/components';
import { useStyles } from '~/hooks';

export type BadgeProps = ViewProps & Parameters<typeof RNBadge>[0] & {
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
  bg = 'primary',
  color = 'contrastText',
  zIndex = 100,
  ...props
}: BadgeProps) {
  const style = useStyles({ 
    ...props, 
    absolute,
    bg, 
    bottom, 
    color,
    left,
    right,
    top,
    zIndex,
  });
  return (
    <RNBadge
      { ...props }
      size={ size }
      style={ style } />
  );
}