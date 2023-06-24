import React from 'react';
import {
  GestureResponderEvent,
  Pressable,
  View as RNView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { trigger } from 'react-native-haptic-feedback';

import { Surface, ViewProps } from '~/components';
import { useStyles, useTheme } from '~/hooks';

export function View({ 
  children,
  touchable,
  elevated,
  haptic,
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
  
  const onPress = React.useCallback((event: GestureResponderEvent) => {
    if (!props.onPress) {
      return;
    }
    if (haptic) {
      trigger('rigid', {
        enableVibrateFallback: true,
        ignoreAndroidSystemSettings: false,
      });
    }
    props.onPress(event);
  }, [haptic, props]);
  
  return (touchable) ? (
    <TouchableOpacity
      { ...props } 
      style={ elevated ? undefined : style }
      onPress={ onPress }>
      {contents}
    </TouchableOpacity>
  ) : props.onPress ? (
    <Pressable
      { ...props } 
      style={ elevated ? undefined : style }
      onPress={ onPress }>
      {contents}
    </Pressable>
  ) : (
    <RNView { ...props } style={ elevated ? undefined : style }>
      {contents}
    </RNView>
  );
}
