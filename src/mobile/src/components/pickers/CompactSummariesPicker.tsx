import React from 'react';

import { PrefSwitch } from './PrefSwitch';

import { Button, View } from '~/components';
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
  
  const { compactSummaries } = React.useContext(SessionContext);

  const compactSummariesSwitch = React.useMemo(() => {
    return labeled ? (
      <Button system contained gap={ 12 }>
        {strings.settings_compactSummaries}
        <View row />
        <PrefSwitch prefKey={ 'compactSummaries' } />
      </Button>
    ) : (
      <PrefSwitch prefKey={ 'compactSummaries' } />
    );
  }, [labeled]);
  
  const shortSummarySwitch = React.useMemo(() => {
    return labeled ? (
      <Button system contained gap={ 12 }>
        {compactSummaries ? strings.settings_shortSummariesInsteadOfTitles : strings.settings_shortSummaries}
        <View row />
        <PrefSwitch prefKey={ 'showShortSummary' } />
      </Button>
    ) : (
      <PrefSwitch prefKey={ 'showShortSummary' } />
    );
  }, [compactSummaries, labeled]);

  if (compactSwitchOnly) {
    return compactSummariesSwitch;
  } else if (shortSummarySwitchOnly) {
    return shortSummarySwitch;
  }
  
  return (
    <View flexRow justifyCenter flexWrap="wrap" gap={ 16 }>
      {compactSummariesSwitch}
      {shortSummarySwitch}
    </View>
  );
}