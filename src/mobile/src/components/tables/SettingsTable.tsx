import React from 'react';

import RNFS from 'react-native-fs';

import { ReadingFormat } from '~/api';
import {
  DisplayModePicker,
  FontPicker,
  FontSizePicker,
  PrefSwitch,
  ScrollView,
  Summary,
  TableView,
  TableViewCell,
  TableViewSection,
  TriggerWordPicker,
  View,
} from '~/components';
import { SessionContext } from '~/contexts';
import { useNavigation } from '~/hooks';
import { strings } from '~/locales';

export function SettingsTable() {
  
  const { navigate } = useNavigation();
  
  const {
    compactMode,
    displayMode, 
    fontFamily, 
    preferredReadingFormat,
    resetPreferences, 
    triggerWords,
    readSummaries,
    removedSummaries,
    setPreference,
  } = React.useContext(SessionContext);
  
  const [loading, setLoading] = React.useState(false);
  const [cacheSize, setCacheSize] = React.useState('');

  const clearCache = React.useCallback(async () => {
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
        header="System">
        <TableViewCell
          bold
          cellStyle="RightDetail"
          title={ strings.settings_colorScheme }
          detail={ displayMode === 'light' ? strings.settings_light : displayMode === 'dark' ? strings.settings_dark : strings.settings_system }
          accessory="DisclosureIndicator"
          cellIcon="theme-light-dark"
          onPress={ () => navigate('generic', { component: <DisplayModePicker /> }) } />
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
        header="Summary Display">
        <TableViewCell
          cellContentView={ (
            <ScrollView scrollEnabled={ false }>
              <Summary mt={ 12 } disableInteractions /> 
            </ScrollView>
          ) } />
        <TableViewCell
          bold
          title={ strings.settings_compactMode }
          cellIcon="view-headline"
          cellAccessoryView={ <PrefSwitch prefKey='compactMode' /> } />
        <TableViewCell
          bold
          title={ compactMode ? strings.settings_shortSummariesInsteadOfTitles : strings.settings_shortSummaries }
          cellIcon="text-short"
          cellAccessoryView={ <PrefSwitch prefKey='showShortSummary' /> } />
        <TableViewCell
          bold
          title={ strings.walkthroughs_sentiment_enable }
          cellIcon="speedometer"
          cellAccessoryView={ <PrefSwitch prefKey='sentimentEnabled' /> } />
        <TableViewCell
          bold
          cellStyle="RightDetail"
          title={ strings.settings_preferredReadingFormat }
          detail={ preferredReadingFormat === ReadingFormat.Bullets ? strings.summary_bullets : strings.summary_summary }
          accessory="DisclosureIndicator"
          cellIcon="view-list"
          onPress={ () => navigate('generic', {
            component: (
              <ScrollView>
                <Summary
                  hideCard
                  hideAnalytics
                  initialFormat={ preferredReadingFormat ?? ReadingFormat.Summary }
                  onFormatChange={ (format) => setPreference('preferredReadingFormat', format) } />
              </ScrollView>
            ), 
          }) } />
      </TableViewSection>
      <TableViewSection
        header="Customization">
        <TableViewCell
          bold
          cellStyle="RightDetail"
          title={ strings.settings_triggerWords ?? 'Trigger Words' }
          detail={ Object.keys({ ...triggerWords }).length }
          accessory="DisclosureIndicator"
          cellIcon="alphabetical-off"
          onPress={ () => navigate('generic', {
            component: (
              <View p={ 12 }>
                <TriggerWordPicker />
              </View>
            ),
          }) } />
      </TableViewSection>
      <TableViewSection
        header="General">
        <TableViewCell
          bold
          title={ `Reset read summaries (${Object.keys({ ...readSummaries }).length})` }
          onPress={ () => setPreference('readSummaries', {}) } />
        <TableViewCell
          bold
          title={ `Reset hidden summaries (${Object.keys({ ...removedSummaries }).length})` }
          onPress={ () => setPreference('removedSummaries', {}) } />
        <TableViewCell
          bold
          title={ loading ? strings.action_loading : `Clear Cache (${cacheSize})` }
          onPress={ () => {
            clearCache(); 
          } } />
        <TableViewCell
          bold
          title={ 'Reset All Settings' }
          onPress={ () => resetPreferences() } />
      </TableViewSection>
    </TableView>
  );
}

