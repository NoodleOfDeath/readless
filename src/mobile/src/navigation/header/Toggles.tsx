
import React from 'react';

import { SettingsToggle } from '~/components';
import { StorageContext } from '~/contexts';
import { useNavigation } from '~/hooks';
import { strings } from '~/locales';

export const SettingsToggleWithIndicator = () => {
  const { navigation } = useNavigation();
  const { hasViewedFeature } = React.useContext(StorageContext);
  return (
    <SettingsToggle
      accessible
      accessibilityLabel={ strings.settings }
      indicator={ !hasViewedFeature(
        'first-view-settings',
        'first-view-notifs'
      ) }
      onPress={ () => navigation?.navigate('settings') } />
  );
};