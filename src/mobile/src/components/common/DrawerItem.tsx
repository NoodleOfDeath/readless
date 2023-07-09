import React from 'react';

import { Drawer } from 'react-native-paper';

import {
  ChildlessViewProps,
  IconProps,
  TextProps,
} from '~/components';
import { useStyles } from '~/hooks';

export type DrawerItemProps = Omit<ChildlessViewProps & TextProps & Parameters<typeof Drawer.Item>[0], 'label' | 'left' | 'right'> & {
  label?: React.ReactNode | (() => React.ReactNode);
  left?: React.ReactNode | (() => React.ReactNode);
  right?: React.ReactNode | ((props: IconProps) => React.ReactNode);
};

export function DrawerItem({
  my = -6,
  left,
  right,
  ...props
}: DrawerItemProps) {
  const style = useStyles({ ...props, my });
  return (
    <Drawer.Item
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      left={ left as any }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      right={ right as any }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      { ...props as any }
      style={ style } />
  );
}