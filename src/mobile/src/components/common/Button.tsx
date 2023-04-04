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

  return (
    <Pressable { ...pressableProps }>
      <FlexView style={ buttonStyle }> 
        {iconComponent && <FlexView mr={ children ? 8 : 0 }>{ iconComponent }</FlexView>}
        {children &&<Text color={ textColor } style={ { fontSize } }>{ children }</Text>}
      </FlexView>
    </Pressable>
  );
}