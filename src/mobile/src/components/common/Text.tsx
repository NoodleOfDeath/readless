import React from 'react';
import {
  Text as RNText,
  TextProps as RNTextProps,
  TextStyle,
} from 'react-native';

import { Stylable, View } from '~/components';
import { useStyles, useTheme } from '~/hooks';

export type TextProps = Stylable<TextStyle> & RNTextProps & React.PropsWithChildren<{
  color?: keyof ReturnType<typeof useTheme>['colors'] | string;
  capitalize?: boolean;
}>;

export function Text({
  children,
  color = 'text',
  capitalize,
  ...textProps
}: TextProps) {

  const style = useStyles({
    ...textProps, color, fontSizeFixed: textProps.fontSizeFixed || textProps.adjustsFontSizeToFit, 
  });
  const computedChildren = React.useMemo(() => capitalize && typeof children === 'string' ? children.replace(/^./, ($0) => $0.toUpperCase()) : children, [capitalize, children]);

  return (
    <View style={ style }>
      <RNText { ...textProps } style={ style }>{computedChildren}</RNText>
    </View>
  );
}