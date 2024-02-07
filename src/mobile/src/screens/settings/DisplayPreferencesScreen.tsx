import React from 'react';
import { Platform } from 'react-native';

import { ReadingFormat } from '~/api';
import {
  BASE_LETTER_SPACING,
  BASE_LINE_HEIGHT_MULTIPLIER,
  FONT_SIZES,
  NumericPrefPicker,
  PrefSwitch,
  SYSTEM_FONT,
  Screen,
  ScrollView,
  Summary,
  TableView,
  TableViewCell,
  TableViewSection,
} from '~/components';
import { StorageContext } from '~/contexts';
import { useNavigation } from '~/hooks';
import { strings } from '~/locales';

export function DisplayPreferencesScreen() {
  
  const { navigate } = useNavigation();
  
  const {
    colorScheme, 
    fontFamily, 
    preferredShortPressFormat,
    preferredReadingFormat,
  } = React.useContext(StorageContext);
  return (
    <Screen>
      <ScrollView>
        <TableView 
          flexGrow={ 1 }>
          <TableViewSection
            grouped
            header={ strings.system }>
            <TableViewCell
              cellStyle="RightDetail"
              title={ strings.colorScheme }
              detail={ colorScheme === 'light' ? strings.light : colorScheme === 'dark' ? strings.dark : strings.system }
              accessory="DisclosureIndicator"
              cellIcon="theme-light-dark"
              onPress={ () => navigate('colorSchemePicker') } />
            <TableViewCell
              cellStyle="RightDetail"
              title={ strings.font }
              detail={ fontFamily ?? SYSTEM_FONT }
              detailTextStyle={ { fontFamily: fontFamily ?? SYSTEM_FONT } }
              accessory="DisclosureIndicator"
              cellIcon="format-font"
              onPress={ () => navigate('fontPicker') } />
            <TableViewCell
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
          <TableViewSection
            grouped
            header={ strings.summaryDisplay }>
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
              title={ strings.compactSummaries }
              cellIcon="view-headline"
              cellAccessoryView={ <PrefSwitch prefKey='compactSummaries' /> } />
            <TableViewCell
              cellStyle="RightDetail"
              title={ strings.preferredReadingFormat }
              detail={ preferredReadingFormat === ReadingFormat.Summary ? strings.summary : preferredReadingFormat === ReadingFormat.FullArticle ? strings.fullArticle : strings.bullets }
              accessory="DisclosureIndicator"
              cellIcon="gesture-tap"
              onPress={ () => navigate('readingFormatPicker') } />
            {Platform.OS === 'ios' && (
              <TableViewCell
                title={ strings.preferredShortPressFormat }
                sentenceCase
                detail={ preferredShortPressFormat === ReadingFormat.Bullets ? strings.bullets : strings.shortSummary }
                accessory="DisclosureIndicator"
                cellIcon="gesture-tap-hold"
                onPress={ () => navigate('shortPressFormatPicker') } />
            )}
          </TableViewSection>
          {/*<TableViewSection
grouped
header={ strings.customization }>
            <TableViewCell
              cellStyle="RightDetail"
              title={ strings.triggerWords }
              detail={ Object.keys({ ...triggerWords }).length }
              accessory="DisclosureIndicator"
              cellIcon="alphabetical-off"
              onPress={ () => navigate('triggerWordPicker') } />
            </TableViewSection>*/}
        </TableView>
      </ScrollView>
    </Screen>
  );
}

