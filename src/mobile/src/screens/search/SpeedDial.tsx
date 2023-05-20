import React from 'react';

import { FAB, FABProps } from 'react-native-paper';

import { ViewProps } from '~/components';
import { useStyles } from '~/hooks';

export type SpeedDialProps = ViewProps & Partial<FABProps> & {
  onAppear?: () => void;
  onDismiss?: () => void;
};

export function SpeedDial({
  onAppear,
  onDismiss,
  ...props
}: SpeedDialProps = {}) {

  const style = useStyles(props);
  const [open, setOpen] = React.useState(false);

  return (
    <FAB.Group
      { ...props }
      fabStyle={ style }
      visible
      open={ open }
      icon="menu"
      actions={ [
        {
          icon: 'link-variant',
          label: 'Copy link',
          onPress: () => {
            /* do something */
          },
        },
      ] }
      onStateChange={ ({ open }) => {
        setOpen(open);
        open ? onAppear?.() : onDismiss?.();
      } } />
  );
}