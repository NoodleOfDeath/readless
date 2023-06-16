import React from 'react';

import RNFS from 'react-native-fs';

import { PrefSwitch } from '../pickers/PrefSwitch';

import {
  CompactModePicker,
  DisplayModePicker,
  FontPicker,
  FontSizePicker,
  Icon,
  Switch,
  TableView,
  TableViewCell,
  TableViewSection,
  View,
} from '~/components';
import { SessionContext } from '~/contexts';
import { useNavigation } from '~/hooks';
import { strings } from '~/locales';

export function SettingsTable() {
  
  const { navigate } = useNavigation();
  
  const {
    compactMode, fontFamily, resetPreferences, 
  } = React.useContext(SessionContext);
  
  const [loading, setLoading] = React.useState(false);
  const [cacheSize, setCacheSize] = React.useState('');

  const handleClearCache = React.useCallback(async () => {
    const files = await RNFS.readDir(RNFS.CachesDirectoryPath);
    files.forEach((file) => {
      RNFS.unlink(file.path);
    });
    setCacheSize('0MB');
  }, []);
  
  const onMount = React.useCallback(async () => {
    setLoading(true);
    const files = await RNFS.readDir(RNFS.CachesDirectoryPath);
    const size = files.reduce((acc, file) => acc + file.size, 0);
    setCacheSize(`${(size / 1000000).toFixed(1)}MB`);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    onMount();
  }, [onMount]);

  return (
    <TableView 
      flexGrow={ 1 }>
      <TableViewSection
        grouped
        header="System">
        <TableViewCell
          bold
          title={ strings.settings_colorScheme }
          cellIcon="format-size"
          cellAccessoryView={ <DisplayModePicker /> } />
        <TableViewCell
          bold
          cellStyle="RightDetail"
          title={ strings.settings_font }
          detail={ fontFamily }
          accessory="DisclosureIndicator"
          cellIcon="format-font"
          onPress={ () => navigate('generic', { component: <FontPicker /> }) } />
        <TableViewCell
          bold
          title={ strings.settings_fontSize }
          cellIcon="format-size"
          cellAccessoryView={ <FontSizePicker /> } />
      </TableViewSection>
      <TableViewSection
        grouped
        header="Summary Display">
        <TableViewCell
          bold
          title={ strings.settings_compactMode }
          cellIcon="view-headline"
          cellAccessoryView={ <PrefSwitch prefKey='compactMode' /> }>
        </TableViewCell>
        <TableViewCell
          bold
          title={ compactMode ? strings.settings_shortSummariesInsteadOfTitles : strings.settings_shortSummaries }
          cellIcon="text-short"
          cellAccessoryView={ <PrefSwitch prefKey='showShortSummary' /> }>
        </TableViewCell>
        <TableViewCell
          bold
          title={ strings.walkthroughs_sentiment_enable }
          cellIcon="speedometer"
          cellAccessoryView={ <PrefSwitch prefKey='sentimentEnabled' /> }>
        </TableViewCell>
      </TableViewSection>
      <TableViewSection
        grouped
        header="General">
        <TableViewCell
          bold
          title={ 'Reset Preferences' }
          onPress={ () => resetPreferences() }>
        </TableViewCell>
      </TableViewSection>
    </TableView>
  );
}

