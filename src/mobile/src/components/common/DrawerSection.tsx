import React from 'react';

import { Drawer } from 'react-native-paper';

import { 
  ChildlessViewProps,
  Text,
  TextProps,
} from '~/components';
import { useStyles, useTheme } from '~/hooks';

export type DrawerSectionProps = ChildlessViewProps & TextProps & Parameters<typeof Drawer.Section>[0];

export function DrawerSection({
  title,
  ...props
}: DrawerSectionProps) {
  const theme = useTheme();
  const style = useStyles(props);
  return (
    <Drawer.Section
      { ...props }
      title={ typeof title === 'string' ? (
        <Text 
          system
          h6
          color={ theme.colors.textSecondary }
          { ...props }>
          {title}
        </Text> as unknown as string
      ) : title }
      style={ style } />
  );
}