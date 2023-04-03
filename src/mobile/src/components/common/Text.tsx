import React from 'react';
import { Text as RNText } from 'react-native';

import { Stylable } from '~/components';
import { useStyles, useTheme } from '~/hooks';

export type TextProps = Stylable & {
  children?: string;
  color?: keyof ReturnType<typeof useTheme>['colors'] | string;
  variant?: keyof ReturnType<typeof useTheme>['typography'];
};

export function Text({
  children,
  color = 'text',
  variant = 'body1',
  ...styleProps
}: TextProps) {
  
  const theme = useTheme();
  
  const { textAlign } = useStyles(styleProps);
  
  const style = React.useMemo(() => ({
    ...theme.typography[variant],
    color: Object.keys(theme.colors).includes(color) ? theme.colors[color as keyof typeof theme.colors] : color,
    textAlign,
  }), [color, textAlign, theme, variant]);
  
  return (
    <RNText style={ style }>{children}</RNText>
  );
}