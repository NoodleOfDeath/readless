
import React from 'react';

import { DrawerActions } from '@react-navigation/native';

import { Button, View } from '~/components';
import { StorageContext } from '~/contexts';
import { useNavigation } from '~/hooks';
import { strings } from '~/locales';

export const BookmarksTabBarIcon = () => {
  const { navigate } = useNavigation();
  const {
    syncState,
    viewFeature, 
    hasViewedFeature, 
    unreadBookmarkCount, 
  } = React.useContext(StorageContext);
  return (
    <Button
      accessible
      accessibilityLabel={ strings.bookmarks }
      disabled={ syncState.bookmarks.isFetching }
      leftIcon="bookmark"
      badge={ unreadBookmarkCount > 0 && !hasViewedFeature('bookmarks') }
      iconSize={ 24 }
      onPress={ () => {
        viewFeature('bookmarks');
        navigate('bookmarks');
      } } />
  );
};

export const SearchTabBarIcon = () => {
  const { navigate } = useNavigation();
  return (
    <Button
      accessible
      accessibilityLabel={ strings.search }
      leftIcon="magnify"
      iconSize={ 24 }
      onPress={ () => {
        navigate('search', {}); 
      } } />
  );
};

export const NotificationsTabBarIcon = () => {
  const { navigate } = useNavigation();
  const { unreadNotificationCount } = React.useContext(StorageContext);
  return (
    <Button
      accessible
      accessibilityLabel={ strings.notifications }
      leftIcon="bell"
      badge={ unreadNotificationCount ?? undefined }
      iconSize={ 24 }
      onPress={ () => navigate('notifications') } />
  );
};

export const ToggleDrawerTabBarIcon = () => {
  const { navigation } = useNavigation();
  const { unreadBookmarkCount, hasViewedFeature } = React.useContext(StorageContext);
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
      onPress={ () => navigation.dispatch(DrawerActions.toggleDrawer()) } />
  );
};

export const SettingsTabBarIcon = () => {
  const { hasViewedFeature } = React.useContext(StorageContext);
  return (
    <Button
      accessible
      accessibilityLabel={ strings.menu }
      leftIcon="cog"
      iconSize={ 24 }
      indicator={
        !hasViewedFeature('publishers') || 
        !hasViewedFeature('categories') || 
        !hasViewedFeature('display-preferences') ||
        !hasViewedFeature('notifications') || 
        !hasViewedFeature('app-review')
      } />
  );
};

export const LeftTabBarIcons = () => {
  return (
    <View flexRow gap={ 12 } ml={ 12 }>
      <ToggleDrawerTabBarIcon />
    </View>
  );
};

export const RightTabBarIcons = () => {
  return (
    <View flexRow gap={ 12 } mr={ 12 }>
      <SearchTabBarIcon />
      <NotificationsTabBarIcon />
    </View>
  );
};