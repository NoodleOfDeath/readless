import React from 'react';
import { Linking } from 'react-native';

import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  createDrawerNavigator,
} from '@react-navigation/drawer';

import { LeftDrawerScreen } from './LeftDrawerScreen';

import {
  Button,
  DrawerItem,
  DrawerSection,
} from '~/components';
import { SessionContext } from '~/contexts';
import { useNavigation } from '~/hooks';
import { strings } from '~/locales';
import { usePlatformTools } from '~/utils';

function RightDrawerContent(props: DrawerContentComponentProps) {
  const { navigate } = useNavigation();
  const { getUserAgent } = usePlatformTools();
  const { viewFeature, hasViewedFeature } = React.useContext(SessionContext);
  return (
    <DrawerContentScrollView { ...props }>
      <DrawerSection>
        <DrawerItem 
          label={ getUserAgent().currentVersion } />
      </DrawerSection>
      <DrawerSection>
        <DrawerItem
          label={ strings.screens_notifications }
          icon={ (_props) => (
            <Button 
              iconSize={ 24 }
              leftIcon="bell"
              indicator={ !hasViewedFeature('first-view-notifs') } />
          ) }
          onPress={ () => {
            viewFeature('first-view-notifs');
            navigate('notifications');
          } } />
        <DrawerItem
          label={ strings.screens_settings }
          icon={ (_props) => (
            <Button 
              iconSize={ 24 }
              leftIcon="cog"
              indicator={ !hasViewedFeature('first-view-settings') } />
          ) }
          onPress= { () => {
            viewFeature('first-view-settings');
            navigate('settings');
          } } />
      </DrawerSection>
    </DrawerContentScrollView>
  );
}

const RightDrawer = createDrawerNavigator();

export function RightDrawerScreen() {
  
  const { router } = useNavigation();
  
  const [loadedInitialUrl, setLoadedInitialUrl] = React.useState(false);

  React.useEffect(() => {
    const subscriber = Linking.addEventListener('url', router);
    if (!loadedInitialUrl) {
      Linking.getInitialURL().then((url) => {
        if (url) {
          router({ url } );
          setLoadedInitialUrl(true);
        }
      });
    }
    return () => subscriber.remove();
  }, [router, loadedInitialUrl]);

  return (
    <RightDrawer.Navigator 
      id="RightDrawer"
      initialRouteName="LeftDrawer"
      screenOptions={ ({ route: _route }) => ({
        drawerPosition: 'right',
        headerShown: false,
        swipeEnabled: false,
      }) }
      drawerContent={ (props) => <RightDrawerContent { ...props } /> }>
      <RightDrawer.Screen
        name='LeftDrawer'
        component={ LeftDrawerScreen } />
    </RightDrawer.Navigator>
  );
}