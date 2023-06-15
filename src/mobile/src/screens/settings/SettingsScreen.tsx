import React from 'react';

import RNFS from 'react-native-fs';

import { ReadingFormat } from '~/api';
import {
  AVAILABLE_FONTS,
  ActivityIndicator,
  Button,
  CompactModeSelector,
  DisplayModeSelector,
  Divider,
  FontSelector,
  FontSizeSelector,
  ReadingFormatSelector,
  Screen,
  ScrollView,
  SegmentedButtons,
  Switch,
  Text,
  View,
} from '~/components';
import { 
  ColorMode, 
  MediaContext,
  SessionContext,
} from '~/contexts';
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
    resetPreferences,
  } = React.useContext(SessionContext);
  
  const {
    selectedVoice,
    setSelectedVoice,
    voices,
  } = React.useContext(MediaContext);
  
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
    onMount();
  }, [onMount]);

  return (
    <Screen>
      <ScrollView>
        <View p={ 16 } gap={ 16 }>
          <DisplayModeSelector />
          <Divider />
          <CompactModeSelector />
          <Divider />
          <View justifyCenter gap={ 6 }>
            <Text caption textCenter>
              {strings.settings_preferredReadingFormat}
            </Text>
            <ReadingFormatSelector 
              format={ preferredReadingFormat }
              preferredFormat={ preferredReadingFormat }
              onChange={ handleReadingFormatChange } />
          </View>
          <Divider />
          <View justifyCenter gap={ 6 }>
            <Text caption textCenter>
              {strings.settings_textScale}
            </Text>
            <FontSizeSelector />
          </View>
          <View justifyCenter gap={ 6 }>
            <Text caption textCenter>
              {strings.settings_fontFamily}
            </Text>
            <FontSelector />
          </View>
          <Divider />
          {voices && (
            <React.Fragment>
              <Text caption textCenter>{strings.settings_voice}</Text>
              <ScrollView horizontal style={ { overflow: 'visible' } }>
                <View>
                  <View row alignCenter gap={ 8 } mh={ 8 }>
                    {voices?.map((voice) => (
                      <Button
                        row
                        caption
                        alignCenter
                        gap={ 4 }
                        key={ voice.id }
                        elevated
                        p={ 8 }
                        startIcon={ voice.id === selectedVoice?.id ? 'check' : undefined }
                        onPress={
                          () => {
                            setSelectedVoice(voice);
                          }
                        }>
                        {voice.name}
                      </Button>
                    ))}
                  </View>
                </View>
              </ScrollView>
            </React.Fragment>
          )}
          <Divider />
          <Button
            elevated
            caption
            p={ 8 }
            onPress={ () => {
              setPreference('readSummaries', {}); 
              setPreference('readSources', {}); 
            } }>
            {strings.settings_resetReadSummaries}
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
            {strings.settings_resetHiddenSummaries}
            {' '}
            (
            {Object.values(removedSummaries ?? {}).length}
            )
          </Button>
          <Button onPress={ () => resetPreferences() }>
            Reset All Settings
          </Button>
          {loading ? (<ActivityIndicator animating />) : (
            <Button
              elevated
              caption
              p={ 8 }
              onPress={ () => handleClearCache() }>
              {strings.settings_clearCache}
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