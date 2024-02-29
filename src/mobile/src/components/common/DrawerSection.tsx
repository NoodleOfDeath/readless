import React from 'react';

import { Drawer } from 'react-native-paper';

import { 
  Button, 
  ButtonProps,
  View,
} from '~/components';
import { useStyles, useTheme } from '~/hooks';

export type DrawerSectionProps = ButtonProps & Parameters<typeof Drawer.Section>[0];

export function DrawerSection({
  title,
  children,
  ...props
}: DrawerSectionProps) {
  const theme = useTheme();
  const style = useStyles(props);
  return (
    <View 
      gap={ 12 }
      mb={ 12 }
      style={ style }>
      {title && (
        <Button
          system
          justifyBetween
          contained
          color={ theme.colors.textSecondary }
          mx={ 12 }
          { ...props }>
          {title}
        </Button>
      )}
      {children}
    </View>
  );
}