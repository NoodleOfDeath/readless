import React from 'react';

import {
  Button,
  ButtonProps,
  View,
} from '~/components';
import { useNavigation } from '~/hooks';
import { strings } from '~/locales';

export function DrawerToggle(props: ButtonProps) {
  const { navigation } = useNavigation();
  return (
    <View>
      <Button
        haptic
        leftIcon='menu'
        iconSize={ 24 }
        accessible
        accessibilityLabel={ strings.axe_menu }
        onPress={ () => {
          (navigation?.getParent('leftDrawerNav') as typeof navigation)?.openDrawer?.(); 
        } }
        { ...props } />
    </View>
  );
}

export function SettingsToggle(props: ButtonProps) {
  const { navigation } = useNavigation();
  return (
    <View>
      <Button
        haptic
        leftIcon='cog' 
        accessible
        accessibilityLabel={ strings.axe_settings }
        iconSize={ 24 }
        onPress={ () => navigation?.navigate('settings') } 
        { ...props } />
    </View>
  );
}