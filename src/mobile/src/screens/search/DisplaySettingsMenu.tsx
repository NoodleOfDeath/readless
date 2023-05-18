import React from 'react';

import RNFS from 'react-native-fs';
import { Switch } from 'react-native-paper';

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

const displayModes = ['light', 'system', 'dark'];
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
  const [activeDisplayMode, setActiveDisplayMode] = React.useState(displayModes.indexOf(displayMode ?? 'system'));
  const [activeTextScale, setActiveTextScale] = React.useState(textScales.findIndex((s) => s.value == (textScale ?? 1)));
  const [cacheSize, setCacheSize] = React.useState('');
  
  const handleDisplayModeChange = React.useCallback((index: number) => {
    const newDisplayMode = displayModes[index];
    if (displayMode === newDisplayMode) {
      setActiveDisplayMode(1);
      setPreference('displayMode', undefined);
      return;
    }
    setActiveDisplayMode(index);
    setPreference('displayMode', newDisplayMode === 'system' ? undefined : newDisplayMode as ColorMode);
  }, [displayMode, setPreference]);

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
            <Text caption>Display Mode</Text>
            <View row gap={ 6 } alignCenter>
              <View>
                <Button caption gap={ 4 } startIcon="view-agenda" iconSize={ 24 } bold alignCenter>
                  Expanded 
                </Button>
              </View>
              <Switch value={ compactMode } onValueChange={ () => setPreference('compactMode', (prev) => !prev) } color={ theme.colors.primary } />
              <View>
                <Button caption gap={ 4 } startIcon="view-headline" iconSize={ 24 } bold alignCenter>
                  Compact
                </Button>
              </View>
            </View>
          </View>
          <View justifyCenter gap={ 6 }>
            <Text caption textCenter>Color Scheme</Text>
            <TabSwitcher
              rounded
              activeTab={ activeDisplayMode }
              onTabChange={ handleDisplayModeChange }
              titles={ [ 'Light', 'System', 'Dark'] } />
          </View>
          <View justifyCenter alignCenter gap={ 6 }>
            <Text caption textCenter>Short summaries under titles</Text>
            <Switch 
              color={ theme.colors.primary } 
              value={ showShortSummary }
              onValueChange={ (value) => {
                setPreference('showShortSummary', value);
              } } />
          </View>
          <View justifyCenter gap={ 6 }>
            <Text caption textCenter>Default reading mode on open</Text>
            <ReadingFormatSelector 
              format={ preferredReadingFormat }
              preferredFormat={ preferredReadingFormat }
              onChange={ handleReadingFormatChange } />
          </View>
          <View justifyCenter gap={ 6 }>
            <Text caption textCenter>Text Scale</Text>
            <TabSwitcher
              rounded
              activeTab={ activeTextScale }
              onTabChange={ handleTextScaleChange }
              titles={ textScales.map((s) => s.label) } />
          </View>
          <View gap={ 6 }>
            <Text caption textCenter>Font</Text>
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
            onPress={ () => setPreference('readSummaries', {}) }>
            Reset Read Summaries to Unread (
            {Object.values(readSummaries ?? {}).length}
            )
          </Button>
          <Button
            elevated
            rounded
            caption
            p={ 8 }
            onPress={ () => setPreference('summaryHistory', {}) }>
            Clear History (
            {Object.values(summaryHistory ?? {}).length}
            )
          </Button>
          <Button
            elevated
            rounded
            caption
            p={ 8 }
            onPress={ () => setPreference('removedSummaries', {}) }>
            Reset Hidden Summaries (
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
              Clear Cache (
              {cacheSize}
              )
            </Button>
          )}
        </View>
      </View>
    </Menu>
  );
}