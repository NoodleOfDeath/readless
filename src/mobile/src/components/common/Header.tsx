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
  const { hasViewedFeature, unreadBookmarkCount } = React.useContext(SessionContext);
  return (
    <View>
      <Chip
        haptic
        indicator={ !hasViewedFeature('first-view-publishers', 'first-view-categories') || (unreadBookmarkCount > 0 && !hasViewedFeature('unread-bookmarks')) }
        leftIcon='menu' 
        iconSize={ 24 }
        onPress={ () => {
          navigation?.getParent('LeftDrawer')?.openDrawer?.(); 
        } } />
    </View>
  );
}

export function SettingsToggle() {
  const { navigation } = useNavigation();
  const { hasViewedFeature } = React.useContext(SessionContext);
  return (
    <View>
      <Chip
        haptic
        indicator={ !hasViewedFeature(
          'first-view-settings',
          'first-view-notifs'
        ) }
        leftIcon='cog' 
        iconSize={ 24 }
        onPress={ () => {
          navigation?.getParent('RightDrawer')?.openDrawer?.();
        } } />
    </View>
  );
}