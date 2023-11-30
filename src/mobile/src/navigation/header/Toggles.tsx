
import React from 'react';

import { Button, View } from '~/components';
import { StorageContext } from '~/contexts';
import { useNavigation } from '~/hooks';
import { strings } from '~/locales';

export const SearchToggle = () => {
  const { navigation } = useNavigation();
  return (
    <Button
      accessible
      accessibilityLabel={ strings.search }
      leftIcon="magnify"
      iconSize={ 24 }
      onPress={ () => {
        navigation?.navigate('search', {}); 
      } } />
  );
};

export const NotificationsToggle = () => {
  const { navigation } = useNavigation();
  return (
    <Button
      accessible
      accessibilityLabel={ strings.notifications }
      leftIcon="bell"
      iconSize={ 24 }
      onPress={ () => navigation?.navigate('notifications') } />
  );
};

export const DrawerToggle = () => {
  const { unreadBookmarkCount, hasViewedFeature } = React.useContext(StorageContext);
  const { navigation } = useNavigation();
  return (
    <Button
      accessible
      accessibilityLabel={ strings.menu }
      leftIcon="menu"
      iconSize={ 24 }
      indicator={
        (unreadBookmarkCount > 0 && !hasViewedFeature('bookmarks')) ||
        !hasViewedFeature('publishers') || 
        !hasViewedFeature('categories') || 
        !hasViewedFeature('display-preferences') ||
        !hasViewedFeature('notifications') || 
        !hasViewedFeature('app-review')
      } 
      onPress={ () => (navigation?.getParent('LeftDrawerNav'))?.toggleDrawer() } />
  );
};
export const RightToggles = () => {
  return (
    <View flexRow gap={ 12 }>
      <SearchToggle />
      <NotificationsToggle />
    </View>
  );
};