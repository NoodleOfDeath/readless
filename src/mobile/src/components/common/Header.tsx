import React from 'react';

import {
  Chip,
  ChipProps,
  View,
} from '~/components';
import { useNavigation } from '~/hooks';
import { strings } from '~/locales';

export function DrawerToggle(props: ChipProps) {
  const { navigation } = useNavigation();
  return (
    <View>
      <Chip
        haptic
        leftIcon='menu'
        iconSize={ 24 }
        accessible
        accessibilityLabel={ strings.axe_menu }
        onPress={ () => {
          navigation?.getParent('LeftDrawer')?.openDrawer?.(); 
        } }
        { ...props } />
    </View>
  );
}

export function SettingsToggle(props: ChipProps) {
  const { navigation } = useNavigation();
  return (
    <View>
      <Chip
        haptic
        leftIcon='cog' 
        accessible
        accessibilityLabel={ strings.axe_settings }
        iconSize={ 24 }
        onPress={ () => {
          navigation?.getParent('RightDrawer')?.openDrawer?.();
        } }
        { ...props } />
    </View>
  );
}