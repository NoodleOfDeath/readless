import React from 'react';

import { PrefSwitch } from './PrefSwitch';

import { Chip, View } from '~/components';
import { SessionContext } from '~/contexts';
import { strings } from '~/locales';

type CompactModePickerProps = {
  compactSwitchOnly?: boolean;
  shortSummarySwitchOnly?: boolean;
  labeled?: boolean;
};

export function CompactModePicker({
  compactSwitchOnly,
  shortSummarySwitchOnly,
  labeled,
}: CompactModePickerProps) {
  
  const { compactMode } = React.useContext(SessionContext);

  const compactModeSwitch = React.useMemo(() => {
    return labeled ? (
      <Chip system contained gap={ 12 }>
        {strings.settings_compactMode}
        <View row />
        <PrefSwitch prefKey={ 'compactMode' } />
      </Chip>
    ) : (
      <PrefSwitch prefKey={ 'compactMode' } />
    );
  }, [labeled]);
  
  const shortSummarySwitch = React.useMemo(() => {
    return labeled ? (
      <Chip system contained gap={ 12 }>
        {compactMode ? strings.settings_shortSummariesInsteadOfTitles : strings.settings_shortSummaries}
        <View row />
        <PrefSwitch prefKey={ 'showShortSummary' } />
      </Chip>
    ) : (
      <PrefSwitch prefKey={ 'showShortSummary' } />
    );
  }, [compactMode, labeled]);

  if (compactSwitchOnly) {
    return compactModeSwitch;
  } else if (shortSummarySwitchOnly) {
    return shortSummarySwitch;
  }
  
  return (
    <View flexRow justifyCenter flexWrap="wrap" gap={ 16 }>
      {compactModeSwitch}
      {shortSummarySwitch}
    </View>
  );
}