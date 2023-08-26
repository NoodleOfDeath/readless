import React from 'react';
import { TouchableOpacity } from 'react-native';

import { Menu } from 'react-native-paper';
import  RNPopover from 'react-native-popover-view';
import { PublicPopoverProps } from 'react-native-popover-view/dist/Popover';

import { SessionEvent } from '~/core';
import { useTheme } from '~/hooks';
import { usePlatformTools } from '~/utils';

export type PopoverProps = PublicPopoverProps & {
  anchor?: React.ReactNode;
  disabled?: boolean;
  onPress?: () => void;
  event?: { name: SessionEvent, params?: Record<string, unknown> };
  longPress?: boolean;
  variant?: 'default' | 'menu';
  menu?: boolean;
};

export function Popover({
  children,
  anchor,
  disabled,
  onPress,
  event,
  longPress,
  menu,
  variant = menu ? 'menu' : 'default',
  ...props
}: PopoverProps) {

  const { emitEvent } = usePlatformTools();
  const theme = useTheme();

  const [visible, setVisible] = React.useState(false);

  if (disabled) {
    return <TouchableOpacity disabled>{anchor}</TouchableOpacity>;
  }

  if (variant === 'menu') {
    return (
      <Menu
        anchor={ (
          <TouchableOpacity
            onPress={ () => {
              if (event) {
                emitEvent(event.name);
              }
              onPress?.();
              !longPress && setVisible(true); 
            } }
            onLongPress={ () => longPress && setVisible(true) }
            delayLongPress={ 200 }>
            {anchor}
          </TouchableOpacity>
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
        <TouchableOpacity
          onPress={ () => {
            onPress?.();
            !longPress && setVisible(true);
          } }
          onLongPress={ () => longPress && setVisible(true) }
          delayLongPress={ 200 }>
          {anchor}
        </TouchableOpacity>
      ) }
      popoverStyle={ theme.components.card }>
      {children}
    </RNPopover>
  );
}