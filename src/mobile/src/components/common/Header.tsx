import React from 'react';

import {
  Button,
  ButtonProps,
  View,
} from '~/components';

export function DrawerToggle(props: ButtonProps) {
  return (
    <View>
      <Button
        haptic
        leftIcon='menu'
        iconSize={ 24 }
        { ...props } />
    </View>
  );
}

export function SettingsToggle(props: ButtonProps) {
  return (
    <View>
      <Button
        haptic
        leftIcon='cog' 
        iconSize={ 24 }
        { ...props } />
    </View>
  );
}