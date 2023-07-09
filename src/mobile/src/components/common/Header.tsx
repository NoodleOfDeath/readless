import React from 'react';

import {
  Badge,
  Chip,
  Icon,
  Text,
  View,
  ViewProps,
} from '~/components';
import { SessionContext } from '~/core';
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
  const { unreadBookmarkCount } = React.useContext(SessionContext);
  
  return (
    <View 
      flexRow
      itemsCenter
      { ...props } 
      height={ 56 } 
      px={ 24 } 
      py={ 3 }>
      <View>
        {unreadBookmarkCount > 0 && (
          <Badge topLeft small>
            {unreadBookmarkCount}
          </Badge>
        )}
        <Chip
          haptic
          leftIcon='menu' 
          iconSize={ 24 }
          onPress={ () => navigation?.toggleDrawer?.() } />
      </View>
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