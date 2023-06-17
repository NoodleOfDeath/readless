import React from 'react';
import { TouchableOpacity } from 'react-native';

import { IPopoverProps, Popover as NBPopover } from 'native-base';
import  RNPopover from 'react-native-popover-view';

import { Text } from '~/components';
import { useTheme } from '~/hooks';

export type PopoverProps = Omit<IPopoverProps, 'trigger'> & {
  anchor?: JSX.Element | JSX.Element[];
  modal?: boolean;
  header?: JSX.Element | JSX.Element[];
  footer?: JSX.Element | JSX.Element[];
};

export function Popover({
  children,
  anchor,
  modal,
  header,
  footer,
  ...props
}: PopoverProps) {
  
  const theme = useTheme();
  
  if (modal) {
    return (
      <RNPopover
        from={ <TouchableOpacity>{anchor}</TouchableOpacity> }
        popoverStyle={ theme.components.card }>
        {children}
      </RNPopover>
    );
  }
  
  return (
    <NBPopover
      { ...props }
      trigger={ (props) => (
        <TouchableOpacity { ...props }>{anchor}</TouchableOpacity>
      ) }>
      <NBPopover.Content>
        <NBPopover.Arrow />
        {header && (
          <NBPopover.Header>{header}</NBPopover.Header>
        )}
        <NBPopover.Body>
          {typeof children === 'string' ? <Text>{children}</Text> : children}
        </NBPopover.Body>
        {footer && (
          <NBPopover.Footer>{footer}</NBPopover.Footer>
        )}
      </NBPopover.Content>
    </NBPopover>
  );
}