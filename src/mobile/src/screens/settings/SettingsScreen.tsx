import React from 'react';

import RNFS from 'react-native-fs';

import { ReadingFormat } from '~/api';
import {
  ActivityIndicator,
  Button,
  CompactModePicker,
  DisplayModePicker,
  Divider,
  FontPicker,
  FontSizePicker,
  ReadingFormatPicker,
  Screen,
  ScrollView,
  Text,
  View,
  VoicePicker,
} from '~/components';
import { SessionContext } from '~/contexts';
import { strings } from '~/locales';
import { ScreenProps } from '~/screens';

export function SettingsScreen({ navigation }: ScreenProps<'settings'>) {

  const {
    preferredReadingFormat,
    removedSummaries,
    readSummaries,
    setPreference,
    resetPreferences,
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
    onMount();
  }, [onMount]);

  return (
    <Screen>
      <ScrollView>
        <View p={ 16 } gap={ 16 }>
          <DisplayModePicker />
          <Divider />
          <CompactModePicker />
          <Divider />
          <View justifyCenter gap={ 6 }>
            <Text caption textCenter>
              {strings.settings_preferredReadingFormat}
            </Text>
            <ReadingFormatPicker 
              format={ preferredReadingFormat }
              preferredFormat={ preferredReadingFormat }
              onChange={ handleReadingFormatChange } />
          </View>
          <Divider />
          <View justifyCenter gap={ 6 }>
            <Text caption textCenter>
              {strings.settings_textScale}
            </Text>
            <FontSizePicker />
          </View>
          <View justifyCenter gap={ 6 }>
            <Text caption textCenter>
              {strings.settings_font}
            </Text>
            <FontPicker />
          </View>
          <Divider />
          <View justifyCenter gap={ 6 }>
            <Text caption textCenter>
              {strings.settings_voice}
            </Text>
            <VoicePicker />
          </View>
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