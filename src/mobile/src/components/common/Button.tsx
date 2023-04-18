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
  spacing?: number;
  iconSize?: number;
  fontSize?: number;
  selected?: boolean;
};

export function Button({
  children,
  startIcon,
  endIcon,
  spacing = 0,
  fontSize,
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
  underline,
  ...pressableProps
}: ButtonProps) {

  const textStyle = React.useMemo(() => ({
    body1, body2, caption, h1, h2, h3, h4, h5, h6, underline, 
  }), [h1, h2, h3, h4, h5, h6, body1, body2, caption, underline]);
  
  const theme = useTheme();
  const style = useStyles({ ...textStyle, ...pressableProps });
  const [isPressed, setIsPressed] = React.useState(false);
  
  const buttonStyle = React.useMemo(
    () => {
      let newStyle = { ...style };
      if (pressableProps.selectable) {
        if (selected || isPressed) {
          newStyle = {
            ...newStyle,
            ...theme.components.buttonSelected,
          };
        }
      }
      return newStyle;
    }
    , [isPressed, pressableProps.selectable, style, selected, theme]
  );
  
  const startIconComponent = React.useMemo(() => {
    if (!startIcon) {
      return; 
    }
    if (typeof startIcon === 'string') {
      return (
        <Icon 
          name={ startIcon } 
          size={ iconSize ?? buttonStyle.fontSize } 
          color={ buttonStyle.color } />
      );
    }
    return startIcon;
  }, [startIcon, iconSize, buttonStyle.color, buttonStyle.fontSize]);
  
  const endIconComponent = React.useMemo(() => {
    if (!endIcon) {
      return;
    }
    if (typeof endIcon === 'string') {
      return (
        <Icon 
          name={ endIcon } 
          size={ iconSize ?? buttonStyle.fontSize } 
          color={ buttonStyle.color } />
      );
    }
    return endIcon;
  }, [endIcon, iconSize, buttonStyle.color, buttonStyle.fontSize]);

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
    <View pressable { ...pressableProps } onPress={ handlePress } onPressOut={ handlePressOut } style={ buttonStyle }> 
      {startIconComponent && <View mr={ pressableProps.row ? spacing : 0 } mb={ pressableProps.row ? 0 : spacing }>{ startIconComponent }</View>}
      {children && (
        <Text { ...{ 
          ...textStyle, 
          color: buttonStyle.color,
          fontFamily: buttonStyle.fontFamily,
          fontSize: fontSize ?? buttonStyle.fontSize,
        } }>
          { children }
        </Text>
      )}
      {endIconComponent && <View ml={ pressableProps.row ? spacing : 0 } mt={ pressableProps.row ? 0 : spacing }>{ endIconComponent }</View>}
    </View>
  );
}