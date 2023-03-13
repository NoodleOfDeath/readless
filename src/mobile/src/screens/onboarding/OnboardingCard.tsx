import React from "react";
import type { StyleProp, ViewProps, ViewStyle } from "react-native";
import type { AnimateProps } from "react-native-reanimated";
import Animated from "react-native-reanimated";

type Props = AnimateProps<ViewProps> & {
  style?: StyleProp<ViewStyle>;
};

export default function OnboardingCard({
  style = { flex: 1 },
  testID,
  children,
  ...animatedViewProps
}: Props) {
  return (
    <Animated.View testID={testID} style={style} {...animatedViewProps}>
      {children}
    </Animated.View>
  );
}
