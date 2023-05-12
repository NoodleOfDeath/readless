import React from 'react';
import {
  Text as RNText,
  TextProps as RNTextProps,
  TextStyle,
} from 'react-native';

import {
  Icon,
  Stylable,
  View,
} from '~/components';
import { useStyles, useTheme } from '~/hooks';

export type TextProps = Stylable<TextStyle> & RNTextProps & React.PropsWithChildren<{
  color?: keyof ReturnType<typeof useTheme>['colors'] | string;
  iconSize?: number;
  startIcon?: string;
  endIcon?: string;
}>;

export function Text({
  children,
  color = 'text',
  iconSize = 24,
  startIcon,
  endIcon,
  ...textProps
}: TextProps) {
  const style = useStyles({ ...textProps, color });
  return (
    <View style={ style }>
      {startIcon && <Icon name={ startIcon } size={ iconSize } />}
      <RNText { ...textProps } style={ style }>{children}</RNText>
      {endIcon && <Icon name={ endIcon } size={ iconSize } />}
    </View>
  );
}