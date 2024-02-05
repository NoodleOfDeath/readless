import React from 'react';
import {
  GestureResponderEvent,
  Pressable,
  View as RNView,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

import { trigger } from 'react-native-haptic-feedback';

import { ViewProps } from '~/components';
import { useStyles, useTheme } from '~/hooks';

export function View({ 
  children,
  untouchable,
  touchable = untouchable ? false : undefined,
  haptic,
  inactive,
  elevated,
  progress,
  progressColor,
  progressOpacity,
  ...props
}: ViewProps) {
  
  const style = useStyles({ ...props, elevated });
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

  const underlay = React.useMemo(() => {
    if (progress != null) {
      return (
        <View
          absolute
          top={ 0 }
          transform={ [ { scaleX: progress }] }
          zIndex={ 0 }
          style={ {
            ...StyleSheet.absoluteFillObject, 
            backgroundColor: progressColor ?? theme.colors.primary,
            borderBottomLeftRadius: style.borderBottomLeftRadius ?? 0, 
            borderBottomRightRadius: style.borderBottomRightRadius ?? 0,
            borderRadius: style.borderRadius ?? 0,
            borderTopLeftRadius: style.borderTopLeftRadius ?? 0,
            borderTopRightRadius: style.borderTopRightRadius ?? 0,
            opacity: progressOpacity ?? 0.3,
            overflow: 'hidden',
          } } />
      );
    }
  }, [progress, progressColor, progressOpacity, style.borderBottomLeftRadius, style.borderBottomRightRadius, style.borderRadius, style.borderTopLeftRadius, style.borderTopRightRadius, theme.colors.primary]);
  
  const contents = React.useMemo(() => (
    <React.Fragment>
      {inactive && overlay}
      {children}
      {underlay}
    </React.Fragment>
  ), [children, inactive, overlay, underlay]);
  
  const onPress = React.useCallback((event: GestureResponderEvent) => {
    if (!props.onPress || props.disabled) {
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
      style={ style }
      onPress={ onPress }>
      {contents}
    </TouchableOpacity>
  ) : props.onPress ? (
    <Pressable
      { ...props } 
      style={ style }
      onPress={ onPress }>
      {contents}
    </Pressable>
  ) : (
    <RNView
      { ...props }
      style={ style }>
      {contents}
    </RNView>
  );
}
