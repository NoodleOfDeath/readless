import React from 'react';

import {
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
  const { unreadBookmarkCount } = React.useContext(SessionContext);
  return (
    <View>
      <Chip
        haptic
        badge={ unreadBookmarkCount }
        leftIcon='menu' 
        iconSize={ 24 }
        onPress={ () => navigation?.getParent('LeftDrawer')?.openDrawer?.() } />
    </View>
  );
}

export function SettingsToggle() {
  const { navigation } = useNavigation();
  return (
    <View>
      <Chip
        haptic
        leftIcon='cog' 
        iconSize={ 24 }
        onPress={ () => navigation?.getParent('RightDrawer')?.openDrawer?.() } />
    </View>
  );
}