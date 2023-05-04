import React from 'react';

import { Menu as RNMenu, MenuProps as RNMenuProps } from 'react-native-paper';

import { View, ViewProps } from '~/components';
import { useStyles, useTheme } from '~/hooks';

export type MenuProps = Omit<RNMenuProps, 'anchor' | 'theme' | 'visible'> & ViewProps & {
  anchor?: React.ReactNode;
  autoAnchor?: React.ReactNode;
  visible?: boolean;
};

export function Menu({
  children,
  ...props
}: MenuProps) {

  const theme = useTheme();
  const style = useStyles(props);

  const [visible, setVisible] = React.useState(false);
  
  const computedAnchor = React.useMemo(() => {
    return (
      <View onPress={ () => setVisible(true) }>
        {props.autoAnchor}
      </View>
    );
  }, [props.autoAnchor]);
  
  React.useEffect(() => setVisible(Boolean(props.visible)), [props.visible]);

  return (
    <RNMenu
      contentStyle={ { 
        ...theme.components.menu,
        ...style,
      } }
      { ...props } 
      anchor={ props.autoAnchor ? computedAnchor : props.anchor }
      onDismiss= { props.autoAnchor ? () => setVisible(false) : props.onDismiss }
      visible={ visible }>
      {children}
    </RNMenu>
  );
}