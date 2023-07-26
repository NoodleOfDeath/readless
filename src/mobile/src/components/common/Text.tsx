import React from 'react';
import { Text as RNText } from 'react-native';

import {
  TextProps,
  View,
  ViewProps,
} from '~/components';
import { useTextStyles } from '~/hooks';

export function Text({
  children,
  fontSizeFixed,
  sentenceCase,
  ...props
}: ViewProps & TextProps) {
  const textStyle = useTextStyles({
    ...props, 
    fontSizeFixed: fontSizeFixed || props.adjustsFontSizeToFit, 
  });
  return (
    <View { ...props }>
      <RNText
        style={ textStyle }
        { ...props }>
        {sentenceCase && typeof children === 'string' ? children.replace(/^\w/, ($0) => $0.toUpperCase()) : children}
      </RNText>
    </View>
  );
}