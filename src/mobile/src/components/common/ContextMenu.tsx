import React from 'react';
import { NativeSyntheticEvent } from 'react-native';

import RNContextMenu, {
  ContextMenuOnPressNativeEvent,
  ContextMenuAction as RNContextMenuAction,
  ContextMenuProps as RNContextMenuProps,
} from 'react-native-context-menu-view';

export type ContextMenuAction = Omit<RNContextMenuAction, | 'systemIcon'> & {
  onPress?: () => void;
  systemIcon?: React.ReactNode | ((action: ContextMenuAction) => React.ReactNode);
};

export type ContextMenuProps = Omit<RNContextMenuProps, 'actions'> & {
  actions?: ContextMenuAction[];
};

export function ContextMenu({
  actions,
  onPress,
  ...props
}: ContextMenuProps) {

  const menuHandler = React.useCallback((e: NativeSyntheticEvent<ContextMenuOnPressNativeEvent>) => {
    onPress ?? actions?.[e.nativeEvent.index].onPress?.();
  }, [onPress, actions]);

  return (
    <RNContextMenu 
      actions={ actions as RNContextMenuAction[] }
      onPress={ menuHandler }
      { ...props } />
  );
}