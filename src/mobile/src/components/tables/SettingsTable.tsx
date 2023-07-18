import React from 'react';

import RNFS from 'react-native-fs';

import { ReadingFormat } from '~/api';
import {
  BASE_LETTER_SPACING,
  BASE_LINE_HEIGHT_MULTIPLIER,
  FONT_SIZES,
  NumericPrefPicker,
  PrefSwitch,
  SYSTEM_FONT,
  ScrollView,
  Summary,
  TableView,
  TableViewCell,
  TableViewSection,
} from '~/components';
import { SessionContext } from '~/contexts';
import { useNavigation } from '~/hooks';
import { strings } from '~/locales';

export function SettingsTable() {
  
  const { navigate } = useNavigation();
  
  const {
    compactSummaries,
    colorScheme, 
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
    setCacheSize(`${(size / 1_000_000).toFixed(1)}MB`);
    setLoading(false);
  }, []);

  React.useEffect(() => {
    onMount();
  }, [onMount]);

  return (
    <TableView 
      flexGrow={ 1 }>
      <TableViewSection grouped header={ strings.settings_system }>
        <TableViewCell
          bold
          cellStyle="RightDetail"
          title={ strings.settings_colorScheme }
          detail={ colorScheme === 'light' ? strings.settings_light : colorScheme === 'dark' ? strings.settings_dark : strings.settings_system }
          accessory="DisclosureIndicator"
          cellIcon="theme-light-dark"
          onPress={ () => navigate('colorSchemePicker') } />
        <TableViewCell
          bold
          cellStyle="RightDetail"
          title={ strings.settings_font }
          detail={ fontFamily ?? SYSTEM_FONT }
          detailTextStyle={ { fontFamily: fontFamily ?? SYSTEM_FONT } }
          accessory="DisclosureIndicator"
          cellIcon="format-font"
          onPress={ () => navigate('fontPicker') } />
        <TableViewCell
          bold
          title={ strings.settings_fontSize }
          cellIcon="format-size"
          cellAccessoryView={ (
            <NumericPrefPicker
              prefKey='fontSizeOffset'
              offset={ FONT_SIZES.body1 }
              min={ -5 }
              max={ 5 }
              step={ 0.5 } />
          ) } />
        <TableViewCell
          bold
          title={ strings.settings_letterSpacing }
          cellIcon="format-letter-spacing"
          cellAccessoryView={ (
            <NumericPrefPicker
              prefKey='letterSpacing'
              offset={ BASE_LETTER_SPACING }
              min={ -0.1 }
              max={ 1 }
              step={ 0.1 } />
          ) } />
        <TableViewCell
          bold
          title={ strings.settings_lineHeight }
          cellIcon="format-line-spacing"
          cellAccessoryView={ (
            <NumericPrefPicker
              prefKey='lineHeightMultiplier'
              offset={ BASE_LINE_HEIGHT_MULTIPLIER }
              min={ -0.35 }
              max={ 0.65 }
              step={ 0.05 } />
          ) } />
      </TableViewSection>
      <TableViewSection grouped header={ strings.settings_summaryDisplay }>
        <TableViewCell
          cellContentView={ (
            <ScrollView scrollEnabled={ false }>
              <Summary 
                sample
                my={ 12 } 
                disableInteractions 
                disableNavigation /> 
            </ScrollView>
          ) } />
        <TableViewCell
          bold
          title={ strings.settings_compactSummaries }
          cellIcon="view-headline"
          cellAccessoryView={ <PrefSwitch prefKey='compactSummaries' /> } />
        <TableViewCell
          bold
          title={ compactSummaries ? strings.settings_shortSummariesInsteadOfTitles : strings.settings_shortSummaries }
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
          detail={ preferredReadingFormat === ReadingFormat.Bullets ? strings.summary_bullets : preferredReadingFormat === ReadingFormat.FullArticle ? strings.summary_fullArticle : strings.summary_summary }
          accessory="DisclosureIndicator"
          cellIcon="view-list"
          onPress={ () => navigate('readingFormatPicker') } />
      </TableViewSection>
      <TableViewSection grouped header={ strings.settings_customization }>
        <TableViewCell
          bold
          cellStyle="RightDetail"
          title={ strings.settings_triggerWords }
          detail={ Object.keys({ ...triggerWords }).length }
          accessory="DisclosureIndicator"
          cellIcon="alphabetical-off"
          onPress={ () => navigate('triggerWordPicker') } />
      </TableViewSection>
      <TableViewSection grouped header={ strings.settings_general }>
        <TableViewCell
          bold
          title={ `${strings.settings_resetReadSummaries} (${Object.keys({ ...readSummaries }).length})` }
          onPress={ () => {
            setPreference('readSummaries', {}); 
          } } />
        <TableViewCell
          bold
          title={ `${strings.settings_resetHiddenSummaries} (${Object.keys({ ...removedSummaries }).length})` }
          onPress={ () => {
            setPreference('removedSummaries', {}); 
          } } />
        <TableViewCell
          bold
          title={ loading ? strings.action_loading : `${strings.settings_clearCache} (${cacheSize})` }
          onPress={ () => {
            clearCache(); 
          } } 
          onLongPress={ () => navigate('stats') } />
        <TableViewCell
          bold
          title={ strings.settings_resetAllSettings }
          onPress={ () => {
            resetPreferences(); 
          } }
          onLongPress={ () => {
            resetPreferences(true);
          } } />
      </TableViewSection>
    </TableView>
  );
}

