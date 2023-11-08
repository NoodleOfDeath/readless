
import React from 'react';

import { DrawerToggle, SettingsToggle } from '~/components';
import { StorageContext } from '~/contexts';
import { useNavigation } from '~/hooks';
import { strings } from '~/locales';

export const DrawerToggleWithIndicator = () => {
  const { navigation } = useNavigation();
  const { hasViewedFeature, unreadBookmarkCount } = React.useContext(StorageContext);
  return (
    <DrawerToggle
      accessible
      accessibilityLabel={ strings.axe_menu }
      indicator={ !hasViewedFeature('first-view-publishers', 'first-view-categories') || (unreadBookmarkCount > 0 && !hasViewedFeature('unread-bookmarks')) } 
      onPress={ () => {
        (navigation?.getParent('leftDrawerNav') as typeof navigation)?.openDrawer?.();
      } } />
  );
};

export const SettingsToggleWithIndicator = () => {
  const { navigation } = useNavigation();
  const { hasViewedFeature } = React.useContext(StorageContext);
  return (
    <SettingsToggle
      accessible
      accessibilityLabel={ strings.axe_settings }
      indicator={ !hasViewedFeature(
        'first-view-settings',
        'first-view-notifs'
      ) }
      onPress={ () => navigation?.navigate('settings') } />
  );
};