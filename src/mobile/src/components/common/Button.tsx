import React from 'react';
import { GestureResponderEvent } from 'react-native';

import { 
  Icon,
  Text,
  TextProps,
  View,
  ViewProps,
} from '~/components';
import { 
  useStyles, 
  useTextStyles, 
  useTheme,
} from '~/hooks';

export type ButtonProps = TextProps & ViewProps & {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  horizontal?: boolean;
  iconSize?: number;
  selected?: boolean;
  textStyles?: TextProps;
};

export function Button({
  children,
  leftIcon,
  rightIcon,
  horizontal,
  iconSize,
  selected,
  itemsCenter = horizontal,
  flexRow = horizontal,
  touchable = true,
  ...props
}: ButtonProps) {
  
  const theme = useTheme();
  
  const textStyle = useTextStyles(props);
  const style = useStyles({
    ...props, flexRow, itemsCenter,
  });
  const [isPressed, setIsPressed] = React.useState(false);
  
  const buttonStyle = React.useMemo(() => {
    let newStyle = props.elevated ? { ...theme.components.button, ...style } : { ...style };
    if (selected || isPressed) {
      newStyle = {
        ...newStyle,
        backgroundColor: theme.colors.selectedBackground,
        color: theme.colors.contrastText,
      };
    }
    if (props.disabled) {
      newStyle = {
        ...newStyle,
        ...theme.components.buttonDisabled,
      };
    }
    return newStyle;
  }, [props.elevated, props.disabled, theme.components.button, theme.components.buttonDisabled, theme.colors.selectedBackground, theme.colors.contrastText, style, selected, isPressed]);
  
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
      { ...props } 
      { ...buttonStyle }
      pressable 
      touchable={ touchable }
      onPress={ handlePress } 
      onPressOut={ handlePressOut }>
      {leftIconComponent && <View>{leftIconComponent }</View>}
      {typeof children === 'string' ? (
        <Text { ...textStyle } color={ buttonStyle.color ?? textStyle.color }>
          { children }
        </Text>
      ) : children}
      {rightIconComponent && <View>{ rightIconComponent }</View>}
    </View>
  );
}