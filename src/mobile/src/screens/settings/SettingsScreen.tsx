import React from 'react';

import { SheetManager } from 'react-native-actions-sheet';
import RNFS from 'react-native-fs';

import { ReadingFormat } from '~/api';
import {
  AVAILABLE_FONTS,
  ActivityIndicator,
  Button,
  ReadingFormatSelector,
  Screen,
  ScrollView,
  SegmentedButtons,
  Switch,
  Text,
  View,
} from '~/components';
import { ColorMode, SessionContext } from '~/contexts';
import { useTheme } from '~/hooks';
import { strings } from '~/locales';
import { ScreenProps } from '~/screens';

const textScales = [0.8, 0.9, 1.0, 1.1, 1.2].map((s) => ({
  label: `${(s).toFixed(1)}x`,
  value: s,
}));

export function SettingsScreen({ navigation }: ScreenProps<'settings'>) {

  const theme = useTheme();
  
  const {
    compactMode,
    textScale, 
    fontFamily,
    preferredReadingFormat,
    showShortSummary,
    displayMode,
    removedSummaries,
    readSummaries,
    setPreference,
  } = React.useContext(SessionContext);
  
  const [loading, setLoading] = React.useState(false);
  const [cacheSize, setCacheSize] = React.useState('');

  const handleReadingFormatChange = React.useCallback((newFormat?: ReadingFormat) => {
    if (preferredReadingFormat === newFormat) {
      setPreference('preferredReadingFormat', undefined);
      return;
    }
    setPreference('preferredReadingFormat', newFormat);
  }, [preferredReadingFormat, setPreference]);

  const handleClearCache = React.useCallback(async () => {
    const files = await RNFS.readDir(RNFS.CachesDirectoryPath);
    files.forEach((file) => {
      RNFS.unlink(file.path);
    });
    setCacheSize('0MB');
  }, []);
  
  const onMount = React.useCallback(async () => {
    navigation?.setOptions({ headerRight: () => undefined });
    setLoading(true);
    const files = await RNFS.readDir(RNFS.CachesDirectoryPath);
    const size = files.reduce((acc, file) => acc + file.size, 0);
    setCacheSize(`${(size / 1000000).toFixed(1)}MB`);
    setLoading(false);
  }, [navigation]);

  React.useEffect(() => {
    SheetManager.hide('mainMenu');
    onMount();
  }, [onMount]);

  return (
    <Screen>
      <ScrollView>
        <View p={ 16 } gap={ 16 }>
          <View row justifyCenter flexWrap="wrap" gap={ 16 }>
            <View alignCenter gap={ 6 }>
              <Text caption numberOfLines={ 2 }>
                {strings.settings.displayMode}
              </Text>
              <Switch 
                leftLabel={ (
                  <View>
                    <Button caption gap={ 4 } startIcon="view-agenda" iconSize={ 24 } bold alignCenter>
                      {strings.settings.expanded} 
                    </Button>
                  </View>
                ) }
                rightLabel={ (
                  <View>
                    <Button caption gap={ 4 } startIcon="view-headline" iconSize={ 24 } bold alignCenter>
                      {strings.settings.compact}
                    </Button>
                  </View>
                ) }
                value={ compactMode } 
                onValueChange={ () => setPreference('compactMode', (prev) => !prev) } />
            </View>
            <View alignCenter gap={ 6 }>
              <Text caption numberOfLines={ 2 }>
                {compactMode ? strings.settings.shortSummariesInsteadOfTitles : strings.settings.shortSummaries}
              </Text>
              <Switch 
                color={ theme.colors.primary } 
                value={ showShortSummary }
                onValueChange={ (value) => {
                  setPreference('showShortSummary', value);
                } } />
            </View>
          </View>
          <View justifyCenter gap={ 6 }>
            <Text caption textCenter>{strings.settings.colorScheme}</Text>
            <SegmentedButtons
              value={ displayMode ?? 'system' }
              onValueChange={ (value) => setPreference('displayMode', value as ColorMode) }
              buttons={ [
                { label: strings.settings.light, value: 'light' },
                { label: strings.settings.system, value: 'system' },
                { label: strings.settings.dark, value: 'dark' },
              ] } />
          </View>
          <View justifyCenter gap={ 6 }>
            <Text caption textCenter>{strings.settings.defaultReadingMode}</Text>
            <ReadingFormatSelector 
              format={ preferredReadingFormat }
              preferredFormat={ preferredReadingFormat }
              onChange={ handleReadingFormatChange } />
          </View>
          <View justifyCenter gap={ 6 }>
            <Text caption textCenter>{strings.settings.textScale}</Text>
            <SegmentedButtons
              value={ textScale ?? 1 }
              onValueChange={ (value) => setPreference('textScale', value) }
              buttons={ textScales } />
          </View>
          <View gap={ 6 }>
            <Text caption textCenter>{strings.settings.font}</Text>
            <ScrollView horizontal style={ { overflow: 'visible' } }>
              <View>
                <View row alignCenter gap={ 8 } mh={ 8 }>
                  {AVAILABLE_FONTS.map((font) => (
                    <Button 
                      row
                      caption
                      alignCenter
                      gap={ 4 }
                      key={ font }
                      elevated
                      p={ 8 }
                      startIcon={ fontFamily === font ? 'check' : undefined } 
                      fontFamily={ font }
                      onPress={ () => setPreference('fontFamily', font) }>
                      {font}
                    </Button>
                  ))}
                </View>
              </View>
            </ScrollView>
          </View>
          <Button
            elevated
            caption
            p={ 8 }
            onPress={ () => {
              setPreference('readSummaries', {}); 
              setPreference('readSources', {}); 
            } }>
            {strings.settings.resetReadSummaries}
            {' '}
            (
            {Object.values(readSummaries ?? {}).length}
            )
          </Button>
          <Button
            elevated
            caption
            p={ 8 }
            onPress={ () => setPreference('removedSummaries', {}) }>
            {strings.settings.resetHiddenSummaries}
            {' '}
            (
            {Object.values(removedSummaries ?? {}).length}
            )
          </Button>
          {loading ? (<ActivityIndicator animating />) : (
            <Button
              elevated
              caption
              p={ 8 }
              onPress={ () => handleClearCache() }>
              {strings.settings.clearCache}
              {' '}
              (
              {cacheSize}
              )
            </Button>
          )}
        </View>
      </ScrollView>
    </Screen>
  );
}