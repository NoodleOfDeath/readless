import React from 'react';
import { NativeSyntheticEvent } from 'react-native';

import RNContextMenu, {
  ContextMenuOnPressNativeEvent,
  ContextMenuAction as RNContextMenuAction,
  ContextMenuProps as RNContextMenuProps,
} from 'react-native-context-menu-view';

export type ContextMenuRef = React.ForwardedRef<RNContextMenu>;

export type ContextMenuAction = Omit<RNContextMenuAction, | 'systemIcon'> & {
  onPress?: () => void;
  systemIcon?: React.ReactNode | ((action: ContextMenuAction) => React.ReactNode);
};

export type ContextMenuProps = Omit<RNContextMenuProps, 'actions'> & {
  actions?: ContextMenuAction[];
};

export const ContextMenu = React.forwardRef(function ContextMenu({
  actions,
  onPress,
  ...props
}: ContextMenuProps, ref: ContextMenuRef) {

  const menuHandler = React.useCallback((e: NativeSyntheticEvent<ContextMenuOnPressNativeEvent>) => {
    onPress ?? actions?.[e.nativeEvent.index].onPress?.();
  }, [onPress, actions]);

  return (
    <RNContextMenu
      ref={ ref }
      actions={ actions as RNContextMenuAction[] }
      onPress={ menuHandler }
      { ...props } />
  );
}) as React.ForwardRefExoticComponent<ContextMenuProps & React.RefAttributes<RNContextMenu>>;