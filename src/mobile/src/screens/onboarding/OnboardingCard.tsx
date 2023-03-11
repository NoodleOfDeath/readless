import React from "react";
import type { StyleProp, ViewStyle, ViewProps } from "react-native";

import type { AnimateProps } from "react-native-reanimated";
import Animated from "react-native-reanimated";

type Props = AnimateProps<ViewProps> & {
  style?: StyleProp<ViewStyle>;
};

export default function OnboardingCard({
  style,
  testID,
  children,
  ...animatedViewProps
}: Props) {
  return (
    <Animated.View testID={testID} style={{ flex: 1 }} {...animatedViewProps}>
      {children}
    </Animated.View>
  );
}
