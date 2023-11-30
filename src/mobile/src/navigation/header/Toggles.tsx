
import React from 'react';

import { Button, View } from '~/components';
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

export const RightToggles = () => {
  return (
    <View flexRow gap={ 12 }>
      <SearchToggle />
      <NotificationsToggle />
    </View>
  );
};