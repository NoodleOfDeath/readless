import React from 'react';

import RNFS from 'react-native-fs';
import { Switch } from 'react-native-paper';

import { ReadingFormat } from '~/api';
import {
  Button,
  Divider,
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

type OptionProps = React.PropsWithChildren<{
  id: string;
  label?: string;
  onPress?: () => void;
  visible?: boolean;
}>;

const displayModes = ['light', 'system', 'dark'];
const textScales = [0.8, 0.9, 1.0, 1.1, 1.2].map((s) => ({
  label: `${(s).toFixed(1)}x`,
  value: s,
}));
const fonts = [
  'Alegreya', 
  'DM Sans',
  'Faustina',
  'Lato',
  'Manuale',
  'Roboto',
];

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
  
  const options: OptionProps[] = React.useMemo(() => {
    return [
      {
        children: (
          <View justifyCenter>
            <TabSwitcher
              rounded
              activeTab={ activeDisplayMode }
              onTabChange={ handleDisplayModeChange }
              titles={ [ 'Light', 'System', 'Dark'] } />
          </View>
        ),
        id: 'display-mode',
        label: 'Color Scheme',
      },
      {
        children: (
          <Switch 
            color={ theme.colors.primary } 
            value={ showShortSummary }
            onValueChange={ (value) => {
              setPreference('showShortSummary', value);
            } } />
        ),
        id: 'short-summaries',
        label: 'Short Summaries under titles',
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
          <View justifyCenter>
            <TabSwitcher
              rounded
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
          <ScrollView horizontal style={ { overflow:'visible' } }>
            <View row alignCenter>
              {fonts.map((font) => (
                <Button 
                  row
                  alignCenter
                  gap={ 4 }
                  key={ font }
                  elevated
                  rounded
                  p={ 8 }
                  mh={ 4 }
                  startIcon={ fontFamily === font ? 'check' : undefined } 
                  fontFamily={ font }
                  onPress={ () => setPreference('fontFamily', font) }>
                  {font}
                </Button>
              ))}
            </View>
          </ScrollView>
        ),
        id: 'font-family',
        label: 'Font',
      },
      {
        children: (
          <Button
            elevated
            rounded
            p={ 8 }
            onPress={ () => setPreference('readSummaries', {}) }>
            Reset Read Summaries to Unread (
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
            elevated
            rounded
            p={ 8 }
            onPress={ () => setPreference('summaryHistory', {}) }>
            Clear History (
            {Object.values(summaryHistory ?? {}).length}
            )
          </Button>
        ),
        id: 'clear-history',
        label: 'Clear History',
      },
      {
        children: (
          <Button
            elevated
            rounded
            p={ 8 }
            onPress={ () => setPreference('removedSummaries', {}) }>
            Reset Hidden Summaries (
            {Object.values(removedSummaries ?? {}).length}
            )
          </Button>
        ),
        id: 'reset-removed-summaries',
        label: 'Reset Removed Content',
      },
      {
        children: (
          <Button
            elevated
            rounded
            p={ 8 }
            onPress={ () => handleClearCache() }>
            Clear Cache (
            {cacheSize}
            )
          </Button>
        ),
        id: 'clear-cache',
        label: 'Clear Cache',
      },
    ];
  }, [activeDisplayMode, handleDisplayModeChange, theme.colors.primary, showShortSummary, preferredReadingFormat, handleReadingFormatChange, activeTextScale, handleTextScaleChange, readSummaries, removedSummaries, summaryHistory, cacheSize, setPreference, fontFamily, handleClearCache]);

  return (
    <Menu
      width={ 300 }
      autoAnchor={
        <Icon name="cog" size={ 24 } />
      }>
      <View gap={ 6 } overflow="hidden">
        <View row gap={ 6 } alignCenter>
          <View>
            <Text row gap={ 4 } startIcon="view-agenda" bold alignCenter>
              Expanded Mode
            </Text>
          </View>
          <Switch value={ compactMode } onValueChange={ () => setPreference('compactMode', (prev) => !prev) } color={ theme.colors.primary } />
          <View>
            <Text row gap={ 4 } startIcon="view-headline" bold alignCenter>
              Headline Mode
            </Text>
          </View>
        </View>
        <View>
          {options.filter((o) => o.visible !== false).map((option) => (
            <View col key={ option.id } p={ 4 } mv={ 4 }>
              {!option.onPress && option.label && (
                <Text mb={ 4 }>{option.label}</Text>
              )}
              {option.onPress && (
                <Button
                  p={ 8 }
                  elevated
                  rounded
                  onPress={ option.onPress }>
                  {option.label}
                </Button>
              )}
              {option.children}
            </View>
          ))}
        </View>
        {/* <View>
          <Button
            row
            alignCenter
            gap={ 4 }
            elevated
            rounded
            onPress={ () => handlePlayAll() }
            p={ 4 }
            startIcon="volume-high">
            Play All
          </Button>
          <View row />
        </View> */}
      </View>
    </Menu>
  );
}