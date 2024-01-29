import React from 'react';
import { Linking } from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import { Screen, ScreenProps } from '~/components';
import { StorageContext } from '~/contexts';
import { useNavigation } from '~/hooks';

export type RoutedScreenProps = ScreenProps;

export function RoutedScreen({ ...props }: RoutedScreenProps) {

  const { router } = useNavigation();
  const { loadedInitialUrl, setLoadedInitialUrl } = React.useContext(StorageContext); 
  
  useFocusEffect(React.useCallback(() => {
    const subscriber = Linking.addEventListener('url', ({ url }) => {
      router({ url });
    });
    if (!loadedInitialUrl) {
      Linking.getInitialURL().then((url) => {
        if (url) {
          setLoadedInitialUrl(true);
          router({ url });
        }
      });
    }
    return () => subscriber.remove();
  }, [router, loadedInitialUrl, setLoadedInitialUrl]));
  
  return (
    <Screen { ...props } />
  );
}