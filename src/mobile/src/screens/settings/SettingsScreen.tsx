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
import {
  AppStateContext,
  ColorMode,
  SessionContext,
} from '~/contexts';
import { useLoginClient } from '~/hooks';
import { ScreenProps } from '~/screens';

type OptionProps = React.PropsWithChildren<{
  id: string;
  label?: string;
  onPress?: () => void;
  visible?: boolean;
}>;

export function SettingsScreen({ navigation }: ScreenProps<'default'>) {
  const {
    preferences: {
      compactMode, 
      displayMode,
      preferredReadingFormat,
    }, 
    setPreference,
    userData,
  } = React.useContext(SessionContext);
  const { setShowLoginDialog } = React.useContext(AppStateContext);
  const { logOut } = useLoginClient();
  
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
  
  const handleLogout = React.useCallback(async () => {
    await logOut();
    navigation.getParent()?.navigate('newsTab');
  }, [logOut, navigation]);
  
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
        label: 'Preferred Reading Format',
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
      // {
      //   id: 'login',
      //   label: 'Log In',
      //   onPress: () => setShowLoginDialog(true),
      //   visible: userData?.isLoggedIn !== true,
      // },
      // {
      //   id: 'logout',
      //   label: 'Log Out',
      //   onPress: () => handleLogout(),
      //   visible: userData?.isLoggedIn === true,
      // },
    ];
  }, [compactMode, displayMode, handleCompactModeChange, handleDisplayModeChange, handleLogout, handleReadingFormatChange, preferredReadingFormat, setShowLoginDialog, userData?.isLoggedIn]);
  
  return (
    <Screen>
      <View>
        <TabSwitcher>
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
