import React from 'react';
import { Linking } from 'react-native';

import { LeftDrawerNavigator } from './LeftDrawerNavigator';

import { MediaPlayer } from '~/components';
import { MediaContext, StorageContext } from '~/contexts';
import { useNavigation } from '~/hooks';

export function StackContainer() {

  const { router } = useNavigation();
  const { 
    loadedInitialUrl, 
    setLoadedInitialUrl,
  } = React.useContext(StorageContext); 
  const { currentTrack } = React.useContext(MediaContext);
  
  React.useEffect(() => {
    const subscriber = Linking.addEventListener('url', ({ url }) => {
      router({ url });
    });
    if (!loadedInitialUrl) {
      Linking.getInitialURL().then((url) => {
        setLoadedInitialUrl(true);
        if (url) {
          router({ url });
        }
      });
    }
    return () => subscriber.remove();
  }, [router, loadedInitialUrl, setLoadedInitialUrl]);

  return (
    <React.Fragment>
      <LeftDrawerNavigator />
      <MediaPlayer visible={ Boolean(currentTrack) } />
    </React.Fragment>
  );

}