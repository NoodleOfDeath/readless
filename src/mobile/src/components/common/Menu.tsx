import React from 'react';

import { Menu as RNMenu, MenuProps as RNMenuProps } from 'react-native-paper';

import { ViewProps } from '~/components';
import { useStyles, useTheme } from '~/hooks';

export type MenuProps = Omit<RNMenuProps, 'theme'> & ViewProps & {
  children?: React.ReactNode | React.ReactNode[];
};

export function Menu(props: MenuProps) {

  const theme = useTheme();
  const style = useStyles(props);

  const [visible, setVisible] = React.useState(false);

  return (
    <RNMenu
      contentStyle={ { 
        ...theme.components.menu,
        ...style,
      } }
      { ...props } 
      visible={ visible } />
  );
}