import React from 'react';
import { Switch } from 'react-native';

import { ReadingFormat } from '~/api';
import { 
  Button,
  Icon,
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

const displayModes = ['light', 'system', 'dark'];
const textScales = [0.6, 0.7, 0.8, 0.9, 1.0, 1.1, 1.2].map((s) => ({
  label: `${(s).toFixed(1)}x`,
  value: s,
}));

export function SettingsScreen(_: ScreenProps<'default'>) {
  const {
    preferences: {
      textScale, 
      compactMode,
      displayMode,
      preferredReadingFormat,
      removedSummaries,
      readSummaries,
    }, 
    setPreference,
  } = React.useContext(SessionContext);
  
  const [activeDisplayMode, setActiveDisplayMode] = React.useState(displayModes.indexOf(displayMode ?? 'system'));
  const [activeTextScale, setActiveTextScale] = React.useState(textScales.findIndex((s) => s.value == (textScale ?? 1)));
  
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
  
  const options: OptionProps[] = React.useMemo(() => {
    return [
      {
        children: (
          <View justifyCenter>
            <TabSwitcher
              activeTab={ activeDisplayMode }
              tabHeight={ 100 * (textScale ?? 1) } 
              onTabChange={ handleDisplayModeChange }
              titles={ [
                <View
                  key="light"
                  alignCenter
                  justifyCenter>
                  <Icon name="weather-sunny" h1 />
                  <Text center body1>
                    Light
                  </Text>
                </View>,
                <View
                  key={ undefined }
                  alignCenter
                  justifyCenter>
                  <Icon name="theme-light-dark" h1 />
                  <Text center body1>
                    System
                  </Text>
                </View>,
                <View
                  key="dark"
                  alignCenter
                  justifyCenter>
                  <Icon name="weather-night" h1 />
                  <Text center body1>
                    Dark
                  </Text>
                </View>,
              ] } />
          </View>
        ),
        id: 'display-mode',
        label: 'Color Scheme',
      },
      {
        children: (
          <ReadingFormatSelector 
            format={ preferredReadingFormat }
            preferredFormat={ preferredReadingFormat }
            onChange={ handleReadingFormatChange } />
        ),
        id: 'reading-format',
        label: 'Preferred Reading Format on Open',
      },
      {
        children: (
          <Switch value={ compactMode } onValueChange={ (newValue) => setPreference('compactMode', newValue) } />
        ),
        id: 'compact-reading-format',
        label: 'Compact Reading Format Selector',
      },
      {
        children: (
          <View justifyCenter>
            <TabSwitcher
              activeTab={ activeTextScale }
              onTabChange={ handleTextScaleChange }
              titles={ textScales.map((s) => s.label) } />
          </View>
        ),
        id: 'text-scale',
        label: 'Text Scale',
      },
      {
        children: (
          <Button
            outlined
            rounded
            p={ 8 }
            onPress={ () => setPreference('readSummaries', {}) }
            h5>
            Reset Read Articles to Unread (
            {Object.values(readSummaries ?? {}).length}
            )
          </Button>
        ),
        id: 'reset-read-summaries',
        label: 'Reset Read Content',
      },
      {
        children: (
          <Button
            outlined
            rounded
            p={ 8 }
            onPress={ () => setPreference('removedSummaries', {}) }
            h5>
            Reset Content Marked Offensive/Spam (
            {Object.values(removedSummaries ?? {}).length}
            )
          </Button>
        ),
        id: 'reset-removed-summaries',
        label: 'Reset Removed Content',
      },
    ];
  }, [activeDisplayMode, textScale, handleDisplayModeChange, preferredReadingFormat, handleReadingFormatChange, compactMode, activeTextScale, handleTextScaleChange, readSummaries, removedSummaries, setPreference]);
  
  return (
    <Screen>
      <View mh={ 16 }>
        <TabSwitcher titles={ ['Preferences'] }>
          <View>
            {options.filter((o) => o.visible !== false).map((option) => (
              <View col key={ option.id } p={ 4 } mv={ 4 }>
                {!option.onPress && (
                  <Text mb={ 4 }>{option.label}</Text>
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
