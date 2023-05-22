import React from 'react';

import RNFS from 'react-native-fs';
import { SegmentedButtons, Switch } from 'react-native-paper';

import { ReadingFormat } from '~/api';
import {
  AVAILABLE_FONTS,
  ActivityIndicator,
  Button,
  Icon,
  Menu,
  ReadingFormatSelector,
  ScrollView,
  TabSwitcher,
  Text,
  View,
} from '~/components';
import { ColorMode, SessionContext } from '~/contexts';
import { useTheme } from '~/hooks';
import { strings } from '~/locales';

const textScales = [0.8, 0.9, 1.0, 1.1, 1.2].map((s) => ({
  label: `${(s).toFixed(1)}x`,
  value: s,
}));

export function DisplaySettingsMenu() {

  const theme = useTheme();

  const {
    preferences: {
      compactMode,
      textScale, 
      fontFamily,
      preferredReadingFormat,
      showShortSummary,
      displayMode,
      removedSummaries,
      readSummaries,
      summaryHistory,
    }, 
    setPreference,
  } = React.useContext(SessionContext);
  
  const [loading, setLoading] = React.useState(false);
  const [activeTextScale, setActiveTextScale] = React.useState(textScales.findIndex((s) => s.value == (textScale ?? 1)));
  const [cacheSize, setCacheSize] = React.useState('');

  const handleReadingFormatChange = React.useCallback((newFormat?: ReadingFormat) => {
    if (preferredReadingFormat === newFormat) {
      setPreference('preferredReadingFormat', undefined);
      return;
    }
    setPreference('preferredReadingFormat', newFormat);
  }, [preferredReadingFormat, setPreference]);
  
  const handleTextScaleChange = React.useCallback((index: number) => {
    const newTextScale = textScales[index];
    if (textScale === newTextScale.value) {
      setActiveTextScale(textScales.findIndex((s) => s.value == 1));
      setPreference('textScale', undefined);
      return;
    }
    setActiveTextScale(index);
    setPreference('textScale', newTextScale.value);
  }, [textScale, setPreference]);

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
    <Menu
      width={ 300 }
      autoAnchor={
        <Icon name="menu" size={ 24 } />
      }>
      <View gap={ 6 } overflow="hidden">
        <View gap={ 16 }>
          <View justifyCenter alignCenter gap={ 6 }>
            <Text caption>{strings.settings.displayMode}</Text>
            <View row gap={ 6 } alignCenter>
              <View>
                <Button caption gap={ 4 } startIcon="view-agenda" iconSize={ 24 } bold alignCenter>
                  {strings.settings.expanded} 
                </Button>
              </View>
              <Switch value={ compactMode } onValueChange={ () => setPreference('compactMode', (prev) => !prev) } color={ theme.colors.primary } />
              <View>
                <Button caption gap={ 4 } startIcon="view-headline" iconSize={ 24 } bold alignCenter>
                  {strings.settings.compact}
                </Button>
              </View>
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
          <View justifyCenter alignCenter gap={ 6 }>
            <Text caption textCenter>{strings.settings.shortSummaries}</Text>
            <Switch 
              color={ theme.colors.primary } 
              value={ showShortSummary }
              onValueChange={ (value) => {
                setPreference('showShortSummary', value);
              } } />
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
            <TabSwitcher
              rounded
              activeTab={ activeTextScale }
              onTabChange={ handleTextScaleChange }
              titles={ textScales.map((s) => s.label) } />
          </View>
          <View gap={ 6 }>
            <Text caption textCenter>{strings.settings.font}</Text>
            <ScrollView horizontal style={ { overflow:'visible' } }>
              <View row alignCenter gap={ 8 } mh={ 8 }>
                {AVAILABLE_FONTS.map((font) => (
                  <Button 
                    row
                    caption
                    alignCenter
                    gap={ 4 }
                    key={ font }
                    elevated
                    rounded
                    p={ 8 }
                    startIcon={ fontFamily === font ? 'check' : undefined } 
                    fontFamily={ font }
                    onPress={ () => setPreference('fontFamily', font) }>
                    {font}
                  </Button>
                ))}
              </View>
            </ScrollView>
          </View>
          <Button
            elevated
            rounded
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
            rounded
            caption
            p={ 8 }
            onPress={ () => setPreference('summaryHistory', {}) }>
            {strings.settings.clearHistory}
            {' '}
            (
            {Object.values(summaryHistory ?? {}).length}
            )
          </Button>
          <Button
            elevated
            rounded
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
              rounded
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
      </View>
    </Menu>
  );
}