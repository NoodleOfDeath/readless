import React from 'react';
import { Platform } from 'react-native';

import RNFS from 'react-native-fs';

import { ReadingFormat } from '~/api';
import {
  BASE_LETTER_SPACING,
  BASE_LINE_HEIGHT_MULTIPLIER,
  Button,
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
import { StorageContext } from '~/contexts';
import { useNavigation } from '~/hooks';
import { strings } from '~/locales';
import { usePlatformTools } from '~/utils';

export function SettingsTable() {
  
  const { navigate } = useNavigation();
  const { getUserAgent } = usePlatformTools();
  
  const {
    compactSummaries,
    colorScheme, 
    fontFamily, 
    preferredShortPressFormat,
    preferredReadingFormat,
    resetStorage, 
    triggerWords,
    readSummaries,
    removedSummaries,
    setStoredValue,
    hasViewedFeature,
    viewFeature,
  } = React.useContext(StorageContext);
  
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
      <TableViewSection header={ strings.pushNotifications }>
        <TableViewCell
          bold
          title={ strings.pushNotifications }
          cellIcon={ (
            <Button
              leftIcon="bell" 
              indicator={ !hasViewedFeature('first-view-notifs') } />
          ) }
          accessory="DisclosureIndicator"
          onPress={ () => {
            viewFeature('first-view-notifs');
            navigate('notifications');
          } } />
      </TableViewSection>
      <TableViewSection header={ strings.summaryDisplay }>
        <TableViewCell
          cellContentView={ (
            <ScrollView my={ 12 } scrollEnabled={ false }>
              <Summary 
                sample
                forceUnread
                disableInteractions 
                disableNavigation /> 
            </ScrollView>
          ) } />
        <TableViewCell
          bold
          title={ strings.compactSummaries }
          cellIcon="view-headline"
          cellAccessoryView={ <PrefSwitch prefKey='compactSummaries' /> } />
        <TableViewCell
          bold
          title={ compactSummaries ? strings.shortSummariesInsteadOfTitles : strings.shortSummariesUnderTitles }
          cellIcon="text-short"
          cellAccessoryView={ <PrefSwitch prefKey='showShortSummary' /> } />
        {Platform.OS === 'ios' && (
          <TableViewCell
            bold
            cellStyle="RightDetail"
            title={ strings.preferredShortPressFormat }
            sentenceCase
            detail={ preferredShortPressFormat === ReadingFormat.Bullets ? strings.bullets : strings.shortSummary }
            accessory="DisclosureIndicator"
            cellIcon="gesture-tap-hold"
            onPress={ () => navigate('shortPressFormatPicker') } />
        )}
        <TableViewCell
          bold
          cellStyle="RightDetail"
          title={ strings.preferredReadingFormat }
          detail={ preferredReadingFormat === ReadingFormat.Summary ? strings.summary : preferredReadingFormat === ReadingFormat.FullArticle ? strings.fullArticle : strings.bullets }
          accessory="DisclosureIndicator"
          cellIcon="gesture-tap"
          onPress={ () => navigate('readingFormatPicker') } />
      </TableViewSection>
      <TableViewSection header={ strings.customization }>
        <TableViewCell
          bold
          cellStyle="RightDetail"
          title={ strings.triggerWords }
          detail={ Object.keys({ ...triggerWords }).length }
          accessory="DisclosureIndicator"
          cellIcon="alphabetical-off"
          onPress={ () => navigate('triggerWordPicker') } />
      </TableViewSection>
      <TableViewSection header={ strings.system }>
        <TableViewCell
          bold
          cellStyle="RightDetail"
          title={ strings.colorScheme }
          detail={ colorScheme === 'light' ? strings.light : colorScheme === 'dark' ? strings.dark : strings.system }
          accessory="DisclosureIndicator"
          cellIcon="theme-light-dark"
          onPress={ () => navigate('colorSchemePicker') } />
        <TableViewCell
          bold
          cellStyle="RightDetail"
          title={ strings.font }
          detail={ fontFamily ?? SYSTEM_FONT }
          detailTextStyle={ { fontFamily: fontFamily ?? SYSTEM_FONT } }
          accessory="DisclosureIndicator"
          cellIcon="format-font"
          onPress={ () => navigate('fontPicker') } />
        <TableViewCell
          bold
          title={ strings.fontSize }
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
          title={ strings.letterSpacing }
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
          title={ strings.lineHeight }
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
      <TableViewSection header={ strings.general }>
        <TableViewCell
          bold
          title={ `${strings.resetReadSummaries} (${Object.keys({ ...readSummaries }).length})` }
          onPress={ () => {
            setStoredValue('readSummaries', {}); 
          } }
          onLongPress={ () => {
            navigate('test'); 
          } } />
        <TableViewCell
          bold
          title={ `${strings.resetHiddenSummaries} (${Object.keys({ ...removedSummaries }).length})` }
          onPress={ () => {
            setStoredValue('removedSummaries', {}); 
            setStoredValue('excludedCategories', {}); 
            setStoredValue('excludedPublishers', {}); 
          } } />
        <TableViewCell
          bold
          title={ loading ? strings.loading : `${strings.clearCache} (${cacheSize})` }
          onPress={ () => {
            clearCache(); 
          } } 
          onLongPress={ () => {
            navigate('stats'); 
          } } />
        <TableViewCell
          bold
          title={ strings.resetAllSettings }
          onPress={ () => {
            resetStorage(); 
          } }
          onLongPress={ () => {
            resetStorage(true);
          } } />
      </TableViewSection>
      <TableViewSection>
        <TableViewCell 
          title={ getUserAgent().currentVersion } />
      </TableViewSection>
    </TableView>
  );
}

