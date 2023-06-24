import React from 'react';

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

export type ChipProps = TextProps & ViewProps & {
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  vertical?: boolean;
  iconSize?: number;
  selected?: boolean;
  variant?: 'default' | 'contained';
  contained?: boolean;
};

export function Chip({
  children,
  leftIcon,
  rightIcon,
  vertical,
  iconSize,
  contained,
  variant = contained ? 'contained' : 'default',
  itemsCenter = !vertical,
  flexRow = !vertical,
  ...props
}: ChipProps) {
  
  const theme = useTheme();
  
  const textStyle = useTextStyles(props);
  const style = useStyles({
    ...props, flexRow, itemsCenter,
  });
  
  const buttonStyle = React.useMemo(() => {
    return {
      ...theme.components.chip,
      ...(variant === 'contained' ? theme.components.chipContained : {}),
      ...(props.selected ? theme.components.chipSelected : {}),
      ...(props.disabled ? theme.components.chipDisabled : {}),
      ...props,
      ...style,
    };
  }, [theme.components.chip, theme.components.chipContained, theme.components.chipSelected, theme.components.chipDisabled, variant, props, style]);

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

  return (
    <View 
      elevated={ variant === 'contained' }
      { ...props } 
      style={ buttonStyle }>
      {leftIconComponent && <View>{leftIconComponent }</View>}
      {typeof children === 'string' ? (
        <Text style={ { ...textStyle, color: buttonStyle.color ?? textStyle.color } }>
          { children }
        </Text>
      ) : children}
      {rightIconComponent && <View>{ rightIconComponent }</View>}
    </View>
  );
}