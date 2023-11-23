import React from 'react';

import { Badge as RNBadge } from 'react-native-paper';

import { TextProps, ViewProps } from '~/components';
import { 
  useStyles, 
  useTextStyles,
  useTheme,
} from '~/hooks';

export type BadgeProps = Parameters<typeof RNBadge>[0] & TextProps & ViewProps & {
  topLeft?: boolean;
  topRight?: boolean;
  bottomLeft?: boolean;
  bottomRight?: boolean;
  xs?: boolean;
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
  xs,
  small,
  big,
  size = xs ? 12 : small ? 16 : big ? 36 : undefined,
  color = 'contrastText',
  fontSize = xs ? 8 : small ? 12 : big ? 24 : undefined,
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
      rounded
      size={ size }
      itemsCenter
      justifyCenter
      textCenter
      { ...props }
      style={ [style, textStyle] } />
  );
}