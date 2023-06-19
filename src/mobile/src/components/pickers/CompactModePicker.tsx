import React from 'react';

import { PrefSwitch } from './PrefSwitch';

import {
  Button,
  Text,
  View,
} from '~/components';
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
    return (
      <PrefSwitch
        leftLabel={ labeled && (
          <View>
            <Button caption gap={ 4 } leftIcon="view-agenda" iconSize={ 24 } bold itemsCenter>
              {strings.settings_expanded}
            </Button>
          </View>
        ) }
        rightLabel={ labeled && (
          <View>
            <Button caption gap={ 4 } leftIcon="view-headline" iconSize={ 24 } bold itemsCenter>
              {strings.settings_compactMode}
            </Button>
          </View>
        ) }
        prefKey={ 'compactMode' } />
    );
  }, [labeled]);

  const shortSummarySwitch = React.useMemo(() => <PrefSwitch prefKey='showShortSummary' />, []);

  if (compactSwitchOnly) {
    return compactModeSwitch;
  } else if (shortSummarySwitchOnly) {
    return shortSummarySwitch;
  }
  
  return (
    <View flexRow justifyCenter flexWrap="wrap" gap={ 16 }>
      <View itemsCenter gap={ 6 }>
        {compactModeSwitch}
      </View>
      <View itemsCenter gap={ 6 }>
        <Text caption numberOfLines={ 2 }>
          {compactMode ? strings.settings_shortSummariesInsteadOfTitles : strings.settings_shortSummaries}
        </Text>
        {shortSummarySwitch}
      </View>
    </View>
  );
}