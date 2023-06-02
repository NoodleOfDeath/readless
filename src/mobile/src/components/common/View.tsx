import React from 'react';
import {
  Pressable,
  PressableProps,
  View as RNView,
  ViewProps as RNViewProps,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';

import { Stylable, Surface } from '~/components';
import { useStyles, useTheme } from '~/hooks';

export type ViewProps = React.PropsWithChildren<PressableProps & TouchableOpacityProps & RNViewProps & Stylable> & {
  pressable?: boolean;
  touchable?: boolean;
  elevated?: boolean;
};

export function View({ 
  children,
  pressable,
  touchable,
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
          borderBottomLeftRadius: style.borderBottomLeftRadius ?? 0, 
          borderBottomRightRadius: style.borderBottomRightRadius ?? 0,
          borderRadius: style.borderRadius ?? 0,
          borderTopLeftRadius: style.borderTopLeftRadius ?? 0,
          borderTopRightRadius: style.borderTopRightRadius ?? 0,
          opacity: 0.3,
          overflow: 'hidden',
        } } />
      );
    }
  }, [inactive, style, theme.colors.inactive]);
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
  ) : touchable ? (
    <TouchableOpacity { ...props } style={ elevated ? undefined : style }>
      {contents}
    </TouchableOpacity>
  ) : (
    <RNView { ...props } style={ elevated ? undefined : style }>
      {contents}
    </RNView>
  );
}
