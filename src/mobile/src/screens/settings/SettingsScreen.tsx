import React from 'react';

import { RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import { ReadingFormat } from '~/api';
import { 
  Button,
  ReadingFormatSelector,
  SafeScrollView, 
  Text,
  View,
} from '~/components';
import { AppStateContext, SessionContext } from '~/contexts';
import { useLoginClient } from '~/hooks';
import { RootParamList } from '~/screens';

type Props = {
  route: RouteProp<RootParamList['account'], 'default'>;
  navigation: NativeStackNavigationProp<RootParamList['account'], 'default'>;
};

type OptionProps = React.PropsWithChildren<{
  id: string;
  label?: string;
  onPress?: () => void;
  visible?: boolean;
}>;

export function SettingsScreen({ navigation }: Props) {
  const {
    preferences: { 
      displayMode,
      preferredReadingFormat,
    }, 
    setPreference,
    userData,
  } = React.useContext(SessionContext);
  const { setShowLoginDialog } = React.useContext(AppStateContext);
  const { logOut } = useLoginClient();
  
  const handleDisplayModeChange = React.useCallback((newDisplayMode) => {
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
  
  const handleLogout = React.useCallback(async () => {
    await logOut();
    navigation.getParent()?.navigate('News');
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
        children: 
  <ReadingFormatSelector 
    format={ preferredReadingFormat }
    onChange={ handleReadingFormatChange } />,
        id: 'reading-format',
        label: 'Preferred Reading Format',
      },
      {
        id: 'login',
        label: 'Log In',
        onPress: () => setShowLoginDialog(true),
        visible: userData?.isLoggedIn !== true,
      },
      {
        id: 'logout',
        label: 'Log Out',
        onPress: () => handleLogout(),
        visible: userData?.isLoggedIn === true,
      },
    ];
  }, [
    handleLogout,
    handleReadingFormatChange,
    userData,
  ]);
  
  return (
    <SafeScrollView>
      <View p={ 32 }>
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
    </SafeScrollView>
  );
}
