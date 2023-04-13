import React from 'react';
import { Text as RNText, TextStyle } from 'react-native';

import { Stylable, View } from '~/components';
import { SessionContext } from '~/contexts';
import { useStyles, useTheme } from '~/hooks';

export type TextProps = Stylable<TextStyle> & React.PropsWithChildren<{
  color?: keyof ReturnType<typeof useTheme>['colors'] | string;
  variant?: keyof ReturnType<typeof useTheme>['typography'];
}>;

export function Text({
  children,
  color = 'text',
  variant = 'base',
  ...styleProps
}: TextProps) {
  
  const theme = useTheme();
  const { preferences: { textScale = 1 } } = React.useContext(SessionContext);
  
  const { textAlign, ...otherStyles } = useStyles(styleProps);
  
  const style = React.useMemo(() => ({
    ...theme.typography[variant],
    color: Object.keys(theme.colors).includes(color) ? theme.colors[color as keyof typeof theme.colors] : color,
    textAlign,
    ...otherStyles,
    fontSize: (otherStyles.fontSize ?? 20) * textScale
  }), [color, otherStyles, textAlign, textScale, theme, variant]);
  
  return (
    <View style={ otherStyles }><RNText style={ style }>{children}</RNText></View>
  );
}

export function Code({ children, ...props }: TextProps) {
  return <Text variant="code" { ...props }>{children}</Text>;
}

export function Strong({ children, ...props }: TextProps) {
  return <Text bold { ...props }>{children}</Text>;
}

export function Em({ children, ...props }: TextProps) {
  return <Text italic { ...props }>{children}</Text>;
}

export function StrongEm({ children, ...props }: TextProps) {
  return <Text bold italic { ...props }>{children}</Text>;
}