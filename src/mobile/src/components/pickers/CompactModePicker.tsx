import React from 'react';

import {
  Button,
  Switch,
  Text,
  View,
} from '~/components';
import { SessionContext } from '~/contexts';
import { useTheme } from '~/hooks';
import { strings } from '~/locales';

export function CompactModePicker() {
  
  const theme = useTheme();
  
  const { 
    compactMode: compactMode0, 
    showShortSummary: showShortSummary0, 
    setPreference,
  } = React.useContext(SessionContext);
  
  const [compactMode, setCompactMode] = React.useState(compactMode0);
  const [showShortSummary, setShowShortSummary] = React.useState(showShortSummary0);
  
  return (
    <View flexRow justifyCenter flexWrap="wrap" gap={ 16 }>
      <View alignCenter gap={ 6 }>
        <Switch 
          leftLabel={ (
            <View>
              <Button caption gap={ 4 } startIcon="view-agenda" iconSize={ 24 } bold alignCenter>
                {strings.settings_expanded} 
              </Button>
            </View>
          ) }
          rightLabel={ (
            <View>
              <Button caption gap={ 4 } startIcon="view-headline" iconSize={ 24 } bold alignCenter>
                {strings.settings_compactMode}
              </Button>
            </View>
          ) }
          value={ compactMode } 
          onValueChange={ () => {
            setCompactMode((prev) => !prev);
            setPreference('compactMode', (prev) => !prev);
          } } />
      </View>
      <View alignCenter gap={ 6 }>
        <Text caption numberOfLines={ 2 }>
          {compactMode ? strings.settings_shortSummariesInsteadOfTitles : strings.settings_shortSummaries}
        </Text>
        <Switch 
          color={ theme.colors.primary } 
          value={ showShortSummary }
          onValueChange={ () => {
            setShowShortSummary((prev) => !prev);
            setPreference('showShortSummary', (prev) => !prev);
          } } />
      </View>
    </View>
  );
}