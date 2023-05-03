import React from 'react';

import { Menu, MenuProps } from 'react-native-paper';

type Props = Omit<MenuProps, 'children' | 'theme'>;

export function SearchOptionsMenu({ anchor, visible }: Props) {
  return (
    <Menu anchor={ anchor } visible={ visible }>
      
    </Menu>
  );
}