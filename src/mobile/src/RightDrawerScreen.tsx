import React from 'react';
import { Linking } from 'react-native';

import {
  DrawerContentComponentProps,
  DrawerContentScrollView,
  createDrawerNavigator,
} from '@react-navigation/drawer';

import { LeftDrawerScreen } from './LeftDrawerScreen';

import {
  Badge,
  DrawerItem,
  DrawerSection,
  Icon,
} from '~/components';
import { SessionContext } from '~/contexts';
import { useNavigation } from '~/hooks';
import { strings } from '~/locales';

export function LeftDrawerContent(props: DrawerContentComponentProps) {
  
  const {
    router,
    navigate,
  } = useNavigation();

  const {
    bookmarkCount,
    unreadBookmarkCount,
  } = React.useContext(SessionContext);

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
      <DrawerSection
        title={ strings.misc_system }>
        <DrawerItem
          label={ `${strings.screens_bookmarks} (${bookmarkCount})` }
          icon={ (props) => (
            <React.Fragment>
              {unreadBookmarkCount > 0 && (
                <Badge topLeft small>
                  {unreadBookmarkCount}
                </Badge>
              )}
              <Icon { ...props } name="bookmark" />
            </React.Fragment>
          ) }
          onPress= { () => navigate('bookmarks') } />
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