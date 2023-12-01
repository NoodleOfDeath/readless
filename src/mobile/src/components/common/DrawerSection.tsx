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
    <View gap={ 12 } style={ style }>
      {title && (
        <Button
          system
          subtitle1
          justifyEvenly
          color={ theme.colors.textSecondary }
          p={ 12 }
          mx={ 12 }
          { ...props }>
          {title}
        </Button>
      )}
      { children }
    </View>
  );
}