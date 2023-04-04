import React from 'react';
import {
  StyleProp,
  ViewProps,
  ViewStyle,
} from 'react-native';

import { AnimateProps } from 'react-native-reanimated';
import Animated from 'react-native-reanimated';

type Props = AnimateProps<ViewProps> & {
  style?: StyleProp<ViewStyle>;
};

export function AnimatedCard({
  style = { flex: 1 },
  testID,
  children,
  ...animatedViewProps
}: Props) {
  return (
    <Animated.View testID={ testID } style={ style } { ...animatedViewProps }>
      {children}
    </Animated.View>
  );
}
