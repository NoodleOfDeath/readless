import React from 'react';
import { Switch } from 'react-native';

import { ReadingFormat } from '~/api';
import { 
  Button,
  ReadingFormatSelector,
  Screen, 
  TabSwitcher,
  Text,
  View,
} from '~/components';
import { ColorMode, SessionContext } from '~/contexts';
import { ScreenProps } from '~/screens';

type OptionProps = React.PropsWithChildren<{
  id: string;
  label?: string;
  onPress?: () => void;
  visible?: boolean;
}>;

export function SettingsScreen(_: ScreenProps<'default'>) {
  const {
    preferences: {
      compactMode, 
      displayMode,
      preferredReadingFormat,
    }, 
    setPreference,
  } = React.useContext(SessionContext);
  
  const handleDisplayModeChange = React.useCallback((newDisplayMode?: ColorMode) => {
    if (displayMode === newDisplayMode) {
      setPreference('displayMode', undefined);
      return;
    }
    setPreference('displayMode', newDisplayMode);
  }, [displayMode, setPreference]);
  
  const handleReadingFormatChange = React.useCallback((newFormat?: ReadingFormat) => {
    if (preferredReadingFormat === newFormat) {
      setPreference('preferredReadingFormat', undefined);
      return;
    }
    setPreference('preferredReadingFormat', newFormat);
  }, [preferredReadingFormat, setPreference]);

  const handleCompactModeChange = React.useCallback((newCompactMode?: boolean) => {
    if (compactMode === newCompactMode) {
      setPreference('compactMode', undefined);
      return;
    }
    setPreference('compactMode', newCompactMode);
  }, [compactMode, setPreference]);
  
  const options: OptionProps[] = React.useMemo(() => {
    return [
      {
        children: (
          <View justifyCenter row>
            <Button
              startIcon="weather-sunny"
              fontSize={ 40 }
              selectable
              outlined
              p={ 8 }
              selected={ displayMode === 'light' }
              onPress={ () => handleDisplayModeChange('light') } />
            <Button
              startIcon="theme-light-dark"
              fontSize={ 40 }
              selectable
              outlined
              p={ 8 }
              selected={ displayMode === undefined }
              onPress={ () => handleDisplayModeChange() } />
            <Button
              startIcon="weather-night"
              fontSize={ 40 }
              selectable
              outlined
              p={ 8 }
              selected={ displayMode === 'dark' }
              onPress={ () => handleDisplayModeChange('dark') } />
          </View>
        ),
        id: 'display-mode',
      },
      {
        children: (
          <ReadingFormatSelector 
            format={ preferredReadingFormat }
            preferredFormat={ preferredReadingFormat }
            compact={ compactMode === true }
            onChange={ handleReadingFormatChange } />
        ),
        id: 'reading-format',
        label: 'Preferred Reading Format on Open',
      },
      {
        children: (
          <View justifyCenter row>
            <Switch
              value={ compactMode === true }
              onValueChange={ handleCompactModeChange } />
          </View>
        ),
        id: 'compact-mode',
        label: 'Compact Mode',
      },
    ];
  }, [compactMode, displayMode, handleCompactModeChange, handleDisplayModeChange, handleReadingFormatChange, preferredReadingFormat]);
  
  return (
    <Screen>
      <View mh={ 16 }>
        <TabSwitcher titles={ ['Preferences'] }>
          <View>
            {options.filter((o) => o.visible !== false).map((option) => (
              <View col key={ option.id } p={ 8 } mv={ 4 }>
                {!option.onPress && (
                  <Text>{option.label}</Text>
                )}
                {option.onPress && (
                  <Button
                    p={ 8 }
                    rounded
                    selectable
                    outlined 
                    onPress={ option.onPress }>
                    {option.label}
                  </Button>
                )}
                {option.children}
              </View>
            ))}
          </View>
        </TabSwitcher>
      </View>
    </Screen>
  );
}
