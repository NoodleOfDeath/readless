import React from 'react';
import { TouchableOpacity } from 'react-native';

import { IPopoverProps, Popover as NBPopover } from 'native-base';

import { Text } from '~/components';

export type PopoverProps = Omit<IPopoverProps, 'trigger'> & {
  anchor?: React.ReactNode;
};

export function Popover({
  children,
  anchor,
  ...props
}: PopoverProps) {
  return (
    <NBPopover
      { ...props }
      trigger={ (props) => (
        <TouchableOpacity { ...props }>{anchor}</TouchableOpacity>
      ) }>
      <NBPopover.Content>
        <NBPopover.Arrow />
        <NBPopover.Body>
          {typeof children === 'string' ? <Text>{children}</Text> : children}
        </NBPopover.Body>
      </NBPopover.Content>
    </NBPopover>
  );
}