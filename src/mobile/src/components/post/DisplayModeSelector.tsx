import React from 'react';

import { SegmentedButtons } from '~/components';
import { SessionContext } from '~/contexts';
import { strings } from '~/locales';

export function DisplayModeSelector() {
  
  const { displayMode, setPreference } = React.useContext(SessionContext);
  
  return (
    <SegmentedButtons
      value={ displayMode ?? 'system' }
      onValueChange={ (value) => setPreference('displayMode', value as ColorMode) }
      buttons={ [
        { label: strings.settings_light, value: 'light' },
        { label: strings.settings_system, value: 'system' },
        { label: strings.settings_dark, value: 'dark' },
      ] } />
  );
}