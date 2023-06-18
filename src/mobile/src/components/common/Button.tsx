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
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  horizontal?: boolean;
  iconSize?: number;
  selected?: boolean;
};

export function Button({
  children,
  leftIcon,
  rightIcon,
  horizontal,
  color,
  fontSize,
  fontFamily,
  adjustsFontSizeToFit,
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
  subtitle1,
  subtitle2,
  bold,
  italic,
  underline,
  letterSpacing, 
  lineHeight,
  flexRow = horizontal,
  flexGrow = horizontal ? 1 : undefined,
  alignCenter = horizontal,
  touchable = true,
  ...props
}: ButtonProps) {
  
  const theme = useTheme();
  
  const textStyle = {
    adjustsFontSizeToFit, body1, body2, bold, caption, color, fontFamily, fontSize, h1, h2, h3, h4, h5, h6, italic, letterSpacing, lineHeight, subtitle1, subtitle2, underline,
  };
  const style = useStyles({
    ...textStyle, ...props, alignCenter, flexGrow, flexRow,
  });
  const [isPressed, setIsPressed] = React.useState(false);
  
  const buttonStyle = React.useMemo(
    () => {
      let newStyle = props.elevated ? { ...theme.components.button, ...style } : { ...style };
      if (props.selectable) {
        if (selected || isPressed) {
          newStyle = {
            ...newStyle,
            ...theme.components.buttonSelected,
          };
        }
      }
      if (props.disabled) {
        newStyle = {
          ...newStyle,
          ...theme.components.buttonDisabled,
        };
      }
      return newStyle;
    }
    , [props.elevated, props.selectable, props.disabled, theme.components.button, theme.components.buttonSelected, theme.components.buttonDisabled, style, selected, isPressed]
  );
  
  const leftIconComponent = React.useMemo(() => {
    if (typeof leftIcon === 'string') {
      return (
        <Icon 
          name={ leftIcon } 
          size={ iconSize ?? textStyle.fontSize } 
          color={ buttonStyle.color ?? textStyle.color } />
      );
    }
    return leftIcon;
  }, [leftIcon, iconSize, textStyle.fontSize, textStyle.color, buttonStyle.color]);
  
  const rightIconComponent = React.useMemo(() => {
    if (typeof rightIcon === 'string') {
      return (
        <Icon 
          name={ rightIcon } 
          size={ iconSize ?? textStyle.fontSize } 
          color={ buttonStyle.color ?? textStyle.color } />
      );
    }
    return rightIcon;
  }, [rightIcon, iconSize, textStyle.fontSize, textStyle.color, buttonStyle.color]);

  const handlePress = React.useCallback((e: GestureResponderEvent) => {
    setIsPressed(true);
    setTimeout(() => setIsPressed(false), 100);
    props.onPress?.(e);
  }, [props]);

  const handlePressOut = React.useCallback((e: GestureResponderEvent) => {
    setIsPressed(false);
    props.onPressOut?.(e);
  }, [props]);

  return (
    <View 
      pressable 
      touchable={ touchable }
      { ...props } 
      onPress={ handlePress } 
      onPressOut={ handlePressOut } 
      style={ buttonStyle }>
      {leftIconComponent && <View>{leftIconComponent }</View>}
      {children && (
        <Text { ...textStyle } color={ buttonStyle.color ?? textStyle.color }>
          { children }
        </Text>
      )}
      {rightIconComponent && <View>{ rightIconComponent }</View>}
    </View>
  );
}