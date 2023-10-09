import React from 'react';
import { Linking } from 'react-native';

import { useFocusEffect } from '@react-navigation/native';

import { Screen, ScreenProps } from '~/components';
import { SessionContext } from '~/contexts';
import { useNavigation } from '~/hooks';

export function RoutedScreen({ ...props }: ScreenProps) {

  const { navigation, router } = useNavigation();
  const { loadedInitialUrl, setLoadedInitialUrl } = React.useContext(SessionContext); 
  
  useFocusEffect(React.useCallback(() => {
    const subscriber = Linking.addEventListener('url', router);
    if (!loadedInitialUrl) {
      Linking.getInitialURL().then((url) => {
        if (url) {
          setLoadedInitialUrl(true);
          router({ stackNav: navigation?.getParent('stackNav'), url });
        }
      });
    }
    return () => subscriber.remove();
  }, [router, navigation, loadedInitialUrl, setLoadedInitialUrl]));
  
  return (
    <Screen { ...props } />
  );
}