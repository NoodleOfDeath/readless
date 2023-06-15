import React from 'react';
import { TouchableOpacity } from 'react-native';

import Popover, { PopoverProps } from 'react-native-popover-view';

import {
  Text,
  View,
  ViewProps,
} from '~/components';
import { useStyles, useTheme } from '~/hooks';

export type MenuProps = PopoverProps & ViewProps & {
  anchor?: React.ReactNode;
};

export function Menu({
  children,
  anchor,
  ...props
}: MenuProps) {

  const theme = useTheme();
  const style = useStyles(props);

  const [visible, setVisible] = React.useState(false);

  React.useEffect(() => {
    setTimeout(() => setVisible(false), 3000);
  }, [visible]);

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