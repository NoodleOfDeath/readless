import React from 'react';
import { TouchableHighlight } from 'react-native';

import { Menu } from 'react-native-paper';
import  RNPopover from 'react-native-popover-view';
import { PublicPopoverProps } from 'react-native-popover-view/dist/Popover';

import { useTheme } from '~/hooks';

export type PopoverProps = PublicPopoverProps & {
  anchor?: React.ReactNode;
  disabled?: boolean;
  onPress?: () => void;
  longPress?: boolean;
  variant?: 'default' | 'menu';
  menu?: boolean;
};

export function Popover({
  children,
  anchor,
  disabled,
  onPress,
  longPress,
  menu,
  variant = menu ? 'menu' : 'default',
  ...props
}: PopoverProps) {
  const theme = useTheme();

  const [visible, setVisible] = React.useState(false);

  if (disabled) {
    return <TouchableHighlight disabled>{anchor}</TouchableHighlight>;
  }

  if (variant === 'menu') {
    return (
      <Menu
        anchor={ (
          <TouchableHighlight
            onPress={ () => {
              onPress?.();
              !longPress && setVisible(true); 
            } }
            onLongPress={ () => longPress && setVisible(true) }
            delayLongPress={ 200 }>
            {anchor}
          </TouchableHighlight>
        ) }
        visible={ visible }
        onDismiss={ () => setVisible(false) }
        style={ theme.components.card }>
        {children}
      </Menu>
    );
  }

  return (
    <RNPopover
      { ...props }
      isVisible={ visible }
      onRequestClose={ () => setVisible(false) }
      from={ (
        <TouchableHighlight
          onPress={ () => {
            onPress?.();
            !longPress && setVisible(true);
          } }
          onLongPress={ () => longPress && setVisible(true) }
          delayLongPress={ 200 }>
          {anchor}
        </TouchableHighlight>
      ) }
      popoverStyle={ theme.components.card }>
      {children}
    </RNPopover>
  );
}