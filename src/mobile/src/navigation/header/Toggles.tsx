
import React from 'react';

import { DrawerToggle, SettingsToggle } from '~/components';
import { StorageContext } from '~/contexts';

export const DrawerToggleWithIndicator = () => {
  const { hasViewedFeature, unreadBookmarkCount } = React.useContext(StorageContext);
  return (
    <DrawerToggle
      indicator={ !hasViewedFeature('first-view-publishers', 'first-view-categories') || (unreadBookmarkCount > 0 && !hasViewedFeature('unread-bookmarks')) } />
  );
};

export const SettingsToggleWithIndicator = () => {
  const { hasViewedFeature } = React.useContext(StorageContext);
  return (
    <SettingsToggle
      indicator={ !hasViewedFeature(
        'first-view-settings',
        'first-view-notifs'
      ) } />
  );
};