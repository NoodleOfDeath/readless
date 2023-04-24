import React from 'react';
import {
  Text as RNText,
  TextProps as RNTextProps,
  TextStyle,
} from 'react-native';

import { Stylable, View } from '~/components';
import { SessionContext } from '~/contexts';
import { useStyles, useTheme } from '~/hooks';

export type TextProps = Stylable<TextStyle> & RNTextProps & React.PropsWithChildren<{
  color?: keyof ReturnType<typeof useTheme>['colors'] | string;
}>;

export function Text({
  children,
  color = 'text',
  ...styleProps
}: TextProps) {
  
  const theme = useTheme();
  const { preferences: { textScale = 1, fontFamily } } = React.useContext(SessionContext);
  
  const { textAlign, ...otherStyles } = useStyles(styleProps);
  
  const style = React.useMemo(() => ({
    ...theme.components.text,
    color: color && (Object.keys(theme.colors).includes(color) ? theme.colors[color as keyof typeof theme.colors] : color),
    textAlign,
    ...otherStyles,
    fontFamily: otherStyles.fontFamily ?? fontFamily,
    fontSize: (styleProps.fontSize ?? otherStyles.fontSize ?? 18) * textScale,
  }), [color, fontFamily, otherStyles, styleProps.fontSize, textAlign, textScale, theme]);
  
  return (
    <View style={ otherStyles }>
      <RNText { ...styleProps } style={ style }>{children}</RNText>
    </View>
  );
}