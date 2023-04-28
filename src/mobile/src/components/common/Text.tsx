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
}>;

export function Text({
  children,
  color = 'text',
  ...textProps
}: TextProps) {
  const style = useStyles({ ...textProps, color });
  return (
    <View style={ style }>
      <RNText { ...textProps } style={ style }>{children}</RNText>
    </View>
  );
}