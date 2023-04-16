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
  small?: boolean;
  big?: boolean;
  size?: 'small' | 'normal' | 'big';
  fontSize?: number;
  selected?: boolean;
};

export const BUTTON_SIZES = {
  big: 24,
  normal: 16,
  small: 13,
};

export function Button({
  children,
  startIcon,
  endIcon,
  spacing = 0,
  small,
  big,
  size = small ? 'small' : big ? 'big' : 'normal',
  fontSize = BUTTON_SIZES[size],
  iconSize = fontSize,
  selected,
  ...pressableProps
}: ButtonProps) {
  
  const theme = useTheme();
  const style = useStyles(pressableProps);
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
          size={ iconSize } 
          color={ buttonStyle.color } />
      );
    }
    return startIcon;
  }, [startIcon, iconSize, buttonStyle.color]);
  
  const endIconComponent = React.useMemo(() => {
    if (!endIcon) {
      return;
    }
    if (typeof endIcon === 'string') {
      return (
        <Icon 
          name={ endIcon } 
          size={ iconSize } 
          color={ buttonStyle.color } />
      );
    }
    return endIcon;
  }, [endIcon, iconSize, buttonStyle.color]);

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
      {children && <Text color={ buttonStyle.color } style={ { fontSize } }>{ children }</Text>}
      {endIconComponent && <View ml={ pressableProps.row ? spacing : 0 } mt={ pressableProps.row ? 0 : spacing }>{ endIconComponent }</View>}
    </View>
  );
}