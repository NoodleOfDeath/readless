
import React from 'react';

import { SettingsToggle } from '~/components';
import { StorageContext } from '~/contexts';
import { useNavigation } from '~/hooks';
import { strings } from '~/locales';

export const SettingsToggleWithIndicator = () => {
  const { navigation } = useNavigation();
  const { viewFeature, hasViewedFeature } = React.useContext(StorageContext);
  return (
    <SettingsToggle
      accessible
      accessibilityLabel={ strings.translate }
      leftIcon="eye"
      indicator={ !hasViewedFeature(
        'display-preferences'
      ) }
      onPress={ () => {
        viewFeature('display-preferences');
        navigation?.navigate('displayPreferences'); 
      } } />
  );
};