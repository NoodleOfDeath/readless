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
  icon?: React.ReactNode;
  iconSize?: number;
  small?: boolean;
  big?: boolean;
  size?: 'small' | 'normal' | 'big';
  fontSize?: number;
  selected?: boolean;
};

export const BUTTON_SIZES = {
  big: 64,
  normal: 24,
  small: 20,
};

export function Button({
  children,
  icon,
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
    () => ({
      ...style,
      ...(selected || isPressed) && pressableProps.selectable ? theme.components.buttonSelected : undefined,
    })
    , [isPressed, pressableProps.selectable, style, selected, theme]
  );
  
  const textColor = React.useMemo(() => {
    return (selected || isPressed) && pressableProps.selectable ? theme.colors.contrastText : theme.colors.primary; 
  }, [isPressed, pressableProps.selectable, selected, theme]);
  
  const iconComponent = React.useMemo(() => {
    if (!icon) {
      return;
    }
    if (typeof icon === 'string') {
      return (
        <Icon 
          name={ icon } 
          size={ iconSize } 
          color={ textColor } />
      );
    }
    return icon;
  }, [icon, iconSize, textColor]);

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
      {iconComponent && <View mr={ children ? 8 : 0 }>{ iconComponent }</View>}
      {children &&<Text color={ textColor } style={ { fontSize } }>{ children }</Text>}
    </View>
  );
}