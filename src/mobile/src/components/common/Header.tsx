import React from 'react';

import {
  Badge,
  Chip,
  ContextMenu,
  ContextMenuAction,
  ScrollView,
  SearchMenu,
  Text,
  View,
  ViewProps,
} from '~/components';
import { SessionContext } from '~/core';
import { useNavigation, useTheme } from '~/hooks';

export function DrawerToggle() {
  const { navigation } = useNavigation();
  return (
    <View>
      <Chip
        haptic
        leftIcon='menu' 
        iconSize={ 24 }
        onPress={ () => navigation?.getParent('LeftDrawer')?.openDrawer?.() } />
    </View>
  );
}

export function SettingsToggle() {
  const { navigation } = useNavigation();
  const { unreadBookmarkCount } = React.useContext(SessionContext);
  return (
    <View>
      {unreadBookmarkCount > 0 && (
        <Badge topLeft small>
          {unreadBookmarkCount}
        </Badge>
      )}
      <Chip
        haptic
        leftIcon='cog' 
        iconSize={ 24 }
        onPress={ () => navigation?.getParent('RightDrawer')?.openDrawer?.() } />
    </View>
  );
}