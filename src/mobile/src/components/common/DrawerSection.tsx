import React from 'react';

import { Drawer } from 'react-native-paper';

import { Button, ButtonProps } from '~/components';
import { useStyles, useTheme } from '~/hooks';

export type DrawerSectionProps = ButtonProps & Parameters<typeof Drawer.Section>[0];

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
        <Button 
          system
          h6
          color={ theme.colors.textSecondary }
          justifyStart
          { ...props }>
          {title}
        </Button> as unknown as string
      ) : title }
      style={ style } />
  );
}