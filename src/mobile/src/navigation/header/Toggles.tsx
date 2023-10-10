
import React from 'react';

import { DrawerToggle, SettingsToggle } from '~/components';
import { SessionContext } from '~/contexts';

export const DrawerToggleWithIndicator = () => {
  const { hasViewedFeature, unreadBookmarkCount } = React.useContext(SessionContext);
  return (
    <DrawerToggle
      indicator={ !hasViewedFeature('first-view-publishers', 'first-view-categories') || (unreadBookmarkCount > 0 && !hasViewedFeature('unread-bookmarks')) } />
  );
};

export const SettingsToggleWithIndicator = () => {
  const { hasViewedFeature } = React.useContext(SessionContext);
  return (
    <SettingsToggle
      indicator={ !hasViewedFeature(
        'first-view-settings',
        'first-view-notifs'
      ) } />
  );
};