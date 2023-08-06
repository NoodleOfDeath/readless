import React from 'react';
import { Linking } from 'react-native';

import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  createDrawerNavigator,
} from '@react-navigation/drawer';

import { LeftDrawerScreen } from './LeftDrawerScreen';

import {
  Chip,
  ContextMenu,
  DrawerItem,
  DrawerSection,
  Icon,
} from '~/components';
import { SessionContext } from '~/contexts';
import { useNavigation } from '~/hooks';
import { strings } from '~/locales';
import { getUserAgent } from '~/utils';

export function LeftDrawerContent(props: DrawerContentComponentProps) {
  
  const {
    router,
    navigate,
  } = useNavigation();

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
    <DrawerContentScrollView { ...props }>
      <DrawerSection>
        <DrawerItem 
          label={ getUserAgent().currentVersion } />
      </DrawerSection>
      <DrawerSection>
        <DrawerItem
          label={ strings.misc_notifications || 'Notifications' }
          icon={ (props) => <Icon { ...props } name="bell" /> }
          onPress={ () => navigate('notifications') } />
        <DrawerItem
          label={ strings.screens_settings }
          icon={ (props) => <Icon { ...props } name="cog" /> }
          onPress= { () => navigate('settings') } />
      </DrawerSection>
    </DrawerContentScrollView>
  );
}

const RightDrawer = createDrawerNavigator();

export function RightDrawerScreen() {
  return (
    <RightDrawer.Navigator 
      id="RightDrawer"
      initialRouteName="LeftDrawer"
      screenOptions={ ({ route: _route }) => ({
        drawerPosition: 'right',
        headerShown: false,
        swipeEnabled: false,
      }) }
      drawerContent={ (props) => <LeftDrawerContent { ...props } /> }>
      <RightDrawer.Screen
        name='LeftDrawer'
        component={ LeftDrawerScreen } />
    </RightDrawer.Navigator>
  );
}