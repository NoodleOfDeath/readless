import React from 'react';
import {
  Animated,
  Easing,
  EasingFunction,
} from 'react-native';

import { ViewProps } from '~/components';

export type PulseProps = ViewProps & {
  animating?: boolean;
  minScale?: number;
  maxScale?: number;
  rate?: number;
  easing?: EasingFunction;
};

export function Pulse({
  animating = true,
  minScale = 1,
  maxScale = 1.2,
  rate = 1000,
  easing = Easing.linear,
  ...props
}: PulseProps) {

  const scale = React.useRef(new Animated.Value(1)).current;

  React.useEffect(() => {
    if (animating) {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scale, {
            duration: rate / 2,
            easing,
            toValue: maxScale,
            useNativeDriver: true,
          }),
          Animated.timing(scale, {
            duration: rate / 2,
            easing,
            toValue: minScale,
            useNativeDriver: true,
          }),
        ])
      ).start();
    }
  }, [animating, easing, maxScale, minScale, rate, scale]);

  return (
    <Animated.View 
      { ...props }
      style={ { transform: [ { scale } ] } } />
  );
}