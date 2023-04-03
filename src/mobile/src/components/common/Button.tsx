import React from 'react';
import { Pressable, PressableProps } from 'react-native';

import { 
  FlexView,
  FlexViewProps,
  Icon,
  Text,
} from '~/components';
import { useStyles, useTheme } from '~/hooks';

export type ButtonProps = PressableProps & FlexViewProps & {
  icon?: React.ReactNode;
  iconSize?: number;
  selected?: boolean;
};

export function Button({
  children,
  icon,
  iconSize = 24,
  selected,
  ...pressableProps
}: ButtonProps) {
  
  const theme = useTheme();
  const style = useStyles(pressableProps);
  
  const buttonStyle = React.useMemo(() => ({
    ...style,
    ...(selected ? theme.components.buttonSelected : undefined),
  }), [style, selected, theme]);
  
  const textColor = React.useMemo(() => selected ? theme.colors.contrastText : theme.colors.primary, [selected, theme]);
  
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
  
  const content = React.useMemo(() => {
    if (typeof children === 'string') {
      return (
        <Text color={ textColor }>{ children }</Text>
      );
    } else if (!(children instanceof Function)) {
      return children;
    }
  }, [children, textColor]);
  
  return (
    <Pressable { ...pressableProps }>
      <FlexView style={ buttonStyle }> 
        {iconComponent && <FlexView mr={ 8 }>{ iconComponent }</FlexView>}
        { content }
      </FlexView>
    </Pressable>
  );
}