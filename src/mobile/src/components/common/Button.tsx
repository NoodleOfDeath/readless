import React from 'react'; 

import { Avatar } from 'react-native-paper';

import { 
  Badge,
  Icon,
  IconProps,
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
  badge?: boolean | number;
  indicator?: boolean;
  avatar?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  iconProps?: Partial<IconProps>;
  vertical?: boolean;
  iconSize?: number;
  selected?: boolean;
  variant?: 'contained' | 'default';
  contained?: boolean;
  primary?: boolean;
  destructive?: boolean;
  disclosureIndicator?: boolean;
};

export function Button({
  children,
  badge,
  indicator,
  avatar,
  leftIcon,
  disclosureIndicator,
  rightIcon = disclosureIndicator ? 'chevron-right' : undefined,
  iconProps,
  vertical,
  iconSize,
  contained,
  variant = contained ? 'contained' : 'default',
  primary,
  destructive,
  itemsCenter = !vertical,
  flexRow = !vertical,
  untouchable,
  touchable = !untouchable,
  ...props
}: ButtonProps) {
  
  const theme = useTheme();
  
  const textStyle = useTextStyles(props);
  const style = useStyles({
    ...props, flexRow, itemsCenter, touchable,
  });
  
  const buttonStyle = React.useMemo(() => {
    return {
      ...theme.components.chip,
      ...(variant === 'contained' ? theme.components.chipContained : {}),
      backgroundColor: variant === 'contained' && primary ? theme.colors.primary : variant === 'contained' ? theme.components.chipContained.backgroundColor : undefined,
      color: destructive ? 'red' : variant === 'contained' && primary ? theme.colors.contrastText : variant === 'contained' ? theme.components.chipContained.color : undefined,
      ...(props.selected ? theme.components.chipSelected : {}),
      ...(props.disabled ? theme.components.chipDisabled : {}),
      ...props,
      ...style,
    };
  }, [theme.components.chip, theme.components.chipContained, theme.components.chipSelected, theme.components.chipDisabled, theme.colors.primary, theme.colors.contrastText, variant, primary, destructive, props, style]);

  const leftIconComponent = React.useMemo(() => {
    if (typeof leftIcon === 'string') {
      if (avatar) {
        return (
          <Avatar.Icon
            accessible={ false }
            icon={ leftIcon } 
            size={ iconSize ?? textStyle.fontSize } 
            color={ buttonStyle.color ?? textStyle.color }
            { ...iconProps } />
        );
      }
      return (
        <Icon 
          accessible={ false }
          name={ leftIcon } 
          size={ iconSize ?? textStyle.fontSize } 
          color={ buttonStyle.color ?? textStyle.color }
          { ...iconProps } />
      );
    }
    return leftIcon;
  }, [iconProps, leftIcon, avatar, iconSize, textStyle.fontSize, textStyle.color, buttonStyle.color]);
  
  const rightIconComponent = React.useMemo(() => {
    if (typeof rightIcon === 'string') {
      return (
        <Icon 
          accessible={ false }
          { ...iconProps }
          name={ rightIcon } 
          size={ iconSize ?? textStyle.fontSize } 
          color={ buttonStyle.color ?? textStyle.color } />
      );
    }
    return rightIcon;
  }, [iconProps, rightIcon, iconSize, textStyle.fontSize, textStyle.color, buttonStyle.color]);

  return (
    <View 
      accessible
      accessibilityLabel={ props.accessibilityLabel ?? (typeof leftIcon === 'string' ? leftIcon : undefined) }
      elevated={ variant === 'contained' }
      { ...props } 
      style={ buttonStyle }>
      {Boolean(badge) && (
        <Badge topRight small>
          {badge === true ? '' : `${badge}`}
        </Badge>
      )}
      {indicator && (
        <Badge topRight xs />
      )}
      {leftIconComponent && <View>{leftIconComponent }</View>}
      {(Array.isArray(children) ? children : [children]).map((child, i) => (
        <React.Fragment key={ i }>
          {typeof child === 'string' || typeof child === 'number' ? (
            <Text style={ { ...textStyle, color: buttonStyle.color ?? textStyle.color } }>
              { child }
            </Text>
          ) : child}
        </React.Fragment>
      ))}
      {rightIconComponent && <View>{ rightIconComponent }</View>}
    </View>
  );
}