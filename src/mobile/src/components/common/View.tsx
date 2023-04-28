import React from 'react';
import {
  Animated,
  Pressable,
  PressableProps,
  View as RNView,
  ViewProps as RNViewProps,
  StyleSheet,
} from 'react-native';

import { Stylable, Surface } from '~/components';
import { useStyles, useTheme } from '~/hooks';

export type ViewProps = React.PropsWithChildren<PressableProps & RNViewProps & Stylable> & {
  title?: string;
  animated?: boolean;
  pressable?: boolean;
  elevated?: boolean;
};

export function View({ 
  children,
  animated,
  pressable,
  elevated,
  inactive,
  ...props
}: ViewProps) {
  const style = useStyles(props);
  const theme = useTheme();
  const overlay = React.useMemo(() => {
    if (inactive) {
      return (
        <View style={ {
          ...StyleSheet.absoluteFillObject, 
          backgroundColor: theme.colors.inactive, 
          borderRadius: style.borderRadius ?? 0,
          opacity: 0.3,
        } } />
      );
    }
  }, [inactive, style.borderRadius, theme.colors.inactive]);
  const contents = React.useMemo(() => {
    if (elevated) {
      return (
        <Surface style={ style }>
          {inactive && overlay}
          {children}
        </Surface>
      );
    } else {
      return (
        <React.Fragment>
          {inactive && overlay}
          {children}
        </React.Fragment>
      );
    }
  }, [children, elevated, inactive, overlay, style]);
  return (pressable || props.onPress) ? (
    <Pressable { ...props } style={ elevated ? undefined : style }>
      {contents}
    </Pressable>
  ) : animated ? (
    <Animated.View { ...props } style={ elevated ? undefined : style }>
      {contents}
    </Animated.View>
  ) : (
    <RNView { ...props } style={ elevated ? undefined : style }>
      {contents}
    </RNView>
  );
}
