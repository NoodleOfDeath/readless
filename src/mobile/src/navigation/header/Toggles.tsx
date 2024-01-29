
import React from 'react';

import { Button, View } from '~/components';
import { StorageContext } from '~/contexts';
import { useNavigation } from '~/hooks';
import { strings } from '~/locales';

export const SearchToggle = () => {
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

export const NotificationsToggle = () => {
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

export const SettingsToggle = () => {
  const { unreadBookmarkCount, hasViewedFeature } = React.useContext(StorageContext);
  const { navigate } = useNavigation();
  return (
    <Button
      accessible
      accessibilityLabel={ strings.menu }
      leftIcon="cog"
      iconSize={ 24 }
      indicator={
        (unreadBookmarkCount > 0 && !hasViewedFeature('bookmarks')) ||
        !hasViewedFeature('publishers') || 
        !hasViewedFeature('categories') || 
        !hasViewedFeature('display-preferences') ||
        !hasViewedFeature('notifications') || 
        !hasViewedFeature('app-review')
      } 
      onPress={ () => navigate('settings') } />
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