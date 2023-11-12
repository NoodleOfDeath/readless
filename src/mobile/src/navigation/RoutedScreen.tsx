import React from 'react';
import { Linking } from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import { Screen, ScreenProps } from '~/components';
import { StorageContext } from '~/contexts';
import { useNavigation } from '~/hooks';
import { NavigationID } from '~/screens';

export type RoutedScreenProps = ScreenProps & {
  navigationID: NavigationID;
};

export function RoutedScreen({ navigationID, ...props }: RoutedScreenProps) {

  const { navigation, router } = useNavigation();
  const { loadedInitialUrl, setLoadedInitialUrl } = React.useContext(StorageContext); 
  
  useFocusEffect(React.useCallback(() => {
    const subscriber = Linking.addEventListener('url', ({ url }) => {
      router({ stackNav: navigation?.getParent(navigationID), url });
    });
    if (!loadedInitialUrl) {
      Linking.getInitialURL().then((url) => {
        if (url) {
          setLoadedInitialUrl(true);
          router({ stackNav: navigation?.getParent(navigationID), url });
        }
      });
    }
    return () => subscriber.remove();
  }, [router, loadedInitialUrl, setLoadedInitialUrl, navigation, navigationID]));
  
  return (
    <Screen { ...props } />
  );
}