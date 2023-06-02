import React from 'react';
import { GestureResponderEvent, PressableProps } from 'react-native';

import { 
  Icon,
  Text,
  View,
  ViewProps,
} from '~/components';
import { useStyles, useTheme } from '~/hooks';

export type ButtonProps = PressableProps & ViewProps & {
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  iconSize?: number;
  selected?: boolean;
};

export function Button({
  children,
  startIcon,
  endIcon,
  fontSize,
  fontFamily,
  iconSize,
  selected,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6,
  body1,
  body2,
  caption,
  bold,
  italic,
  underline,
  ...pressableProps
}: ButtonProps) {
  
  const theme = useTheme();
  
  const textStyle = useStyles({
    body1, body2, bold, caption, fontFamily, fontSize, h1, h2, h3, h4, h5, h6, italic, underline,
  });
  const style = useStyles({ ...textStyle, ...pressableProps });
  const [isPressed, setIsPressed] = React.useState(false);
  
  const buttonStyle = React.useMemo(
    () => {
      let newStyle = pressableProps.elevated ? { ...theme.components.button, ...style } : { ...style };
      if (pressableProps.selectable) {
        if (selected || isPressed) {
          newStyle = {
            ...newStyle,
            ...theme.components.buttonSelected,
          };
        }
      }
      if (pressableProps.disabled) {
        newStyle = {
          ...newStyle,
          ...theme.components.buttonDisabled,
        };
      }
      return newStyle;
    }
    , [pressableProps.elevated, pressableProps.selectable, pressableProps.disabled, theme.components.button, theme.components.buttonSelected, theme.components.buttonDisabled, style, selected, isPressed]
  );
  
  const startIconComponent = React.useMemo(() => {
    if (!startIcon) {
      return; 
    }
    if (typeof startIcon === 'string') {
      return (
        <Icon 
          name={ startIcon } 
          size={ iconSize ?? textStyle.fontSize } 
          color={ pressableProps.color ?? textStyle.color } />
      );
    }
    return startIcon;
  }, [startIcon, iconSize, textStyle.fontSize, textStyle.color, pressableProps.color]);
  
  const endIconComponent = React.useMemo(() => {
    if (!endIcon) {
      return;
    }
    if (typeof enStringsdIcon === 'string') {
      return (
        <Icon 
          name={ endIcon } 
          size={ iconSize ?? textStyle.fontSize } 
          color={ pressableProps.color ?? textStyle.color } />
      );
    }
    return endIcon;
  }, [endIcon, iconSize, textStyle.fontSize, textStyle.color, pressableProps.color]);

  const handlePress = React.useCallback((e: GestureResponderEvent) => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 100);
    pressableProps.onPress?.(e);
  }, [pressableProps]);

  const handlePressOut = React.useCallback((e: GestureResponderEvent) => {
    setIsPressed(false);
    pressableProps.onPressOut?.(e);
  }, [pressableProps]);

  return (
    <View 
      pressable 
      { ...pressableProps } 
      onPress={ handlePress } 
      onPressOut={ handlePressOut } 
      style={ buttonStyle }>
      {startIconComponent && <View>{startIconComponent }</View>}
      {children && (
        <Text { ...{ 
          ...textStyle, 
          color: pressableProps.color ?? buttonStyle.color,
        } }>
          { children }
        </Text>
      )}
      {endIconComponent && <View>{ endIconComponent }</View>}
    </View>
  );
}