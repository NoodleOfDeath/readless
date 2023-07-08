import React from 'react';

import {
  Chip,
  Icon,
  Text,
  View,
  ViewProps,
} from '~/components';
import { useNavigation } from '~/hooks';

export type HeaderProps = ViewProps & {
  title?: string;
  subtitle?: string;
  back?: boolean;
  backTitle?: string;
  actions?: React.ReactNode;
};

export function Header({
  back,
  backTitle,
  actions,
  children,
  ...props
}: HeaderProps) {
  
  const { navigation } = useNavigation();
  
  return (
    <View 
      flexRow
      itemsCenter
      { ...props } 
      height={ 56 } 
      px={ 24 } 
      py={ 3 }>
      <Chip
        haptic
        leftIcon='menu' 
        iconSize={ 24 }
        onPress={ () => navigation?.toggleDrawer?.() } />
      {back && (
        <View flexRow gap={ 6 } itemsCenter>
          <Icon name='arrow-left' size={ 24 } />
          {backTitle && <Text>{backTitle}</Text>}
        </View>
      )}
      {children}
      {actions}
    </View>
  );
}