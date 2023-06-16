import React from 'react';
import { TouchableOpacity } from 'react-native';

import Popover from 'react-native-popover-view';
import { PublicPopoverProps } from 'react-native-popover-view/dist/Popover.d';

import {
  Text,
  View,
  ViewProps,
} from '~/components';
import { useStyles, useTheme } from '~/hooks';

export type MenuProps = ViewProps & PublicPopoverProps & {
  anchor?: React.ReactNode;
};

export function Menu({
  children,
  anchor,
  ...props
}: MenuProps) {

  const theme = useTheme();
  const style = useStyles(props);

  return (
    <Popover
      from={ (
        <TouchableOpacity style={ style }>
          {anchor}
        </TouchableOpacity>
      ) }>
      <View style={ theme.components.menu }>
        {typeof children === 'string' ? <Text>{children}</Text> : children}
      </View>
    </Popover>
  );
}