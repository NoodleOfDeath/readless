import React from 'react';
import { NativeSyntheticEvent } from 'react-native';

import RNContextMenu, {
  ContextMenuOnPressNativeEvent,
  ContextMenuAction as RNContextMenuAction,
  ContextMenuProps as RNContextMenuProps,
} from 'react-native-context-menu-view';

import { StorageEventName } from '~/core';
import { usePlatformTools } from '~/utils';

export type ContextMenuRef = React.ForwardedRef<RNContextMenu>;

export type ContextMenuAction = Omit<RNContextMenuAction, | 'systemIcon'> & {
  onPress?: () => void;
  systemIcon?: React.ReactNode | ((action: ContextMenuAction) => React.ReactNode);
};

export type ContextMenuProps = Omit<RNContextMenuProps, 'actions'> & {
  actions?: ContextMenuAction[];
  event?: { name: StorageEventName, params?: Record<string, string> };
};

export const ContextMenu = React.forwardRef(function ContextMenu({
  actions,
  event,
  onPress,
  ...props
}: ContextMenuProps, ref: ContextMenuRef) {

  const { emitStorageEvent } = usePlatformTools();

  const menuHandler = React.useCallback((e: NativeSyntheticEvent<ContextMenuOnPressNativeEvent>) => {
    if (event) {
      emitStorageEvent(event.name, event.params);
    }
    onPress ?? actions?.[e.nativeEvent.index].onPress?.();
  }, [event, onPress, actions, emitStorageEvent]);

  return (
    <RNContextMenu
      ref={ ref }
      actions={ actions as RNContextMenuAction[] }
      onPress={ menuHandler }
      { ...props } />
  );
}) as React.ForwardRefExoticComponent<ContextMenuProps & React.RefAttributes<RNContextMenu>>;