import React from 'react';
import { Platform } from 'react-native';

import { MenuView } from '@react-native-menu/menu';

export function SearchOptionsMenu() {
  return (
    <MenuView
      title="Search Options"
      onPressAction={ ({ nativeEvent }) => {
        console.warn(JSON.stringify(nativeEvent));
      } }
      actions={ [
        {
          id: 'add',
          imageColor: '#2367A2',
          subactions: [
            {
              id: 'nested1',
              image: Platform.select({
                android: 'ic_menu_today',
                ios: 'heart.fill',
              }),
              imageColor: 'rgba(100,200,250,0.3)',
              state: 'mixed',
              subtitle: 'State is mixed',
              title: 'Nested action',
              titleColor: 'rgba(250,180,100,0.5)',
            },
            {
              attributes: { destructive: true },
              id: 'nestedDestructive',
              image: Platform.select({
                android: 'ic_menu_delete',
                ios: 'trash',
              }),
              title: 'Destructive Action',
            },
          ],
          title: '',
          titleColor: '#2367A2',
        },
        {
          id: 'share',
          image: Platform.select({
            android: 'ic_menu_share',
            ios: 'square.and.arrow.up',
          }),
          imageColor: '#46F289',
          state: 'on',
          subtitle: 'Share action on SNS',
          title: 'Share Action',
          titleColor: '#46F289',
        },
        {
          attributes: { destructive: true },
          id: 'destructive',
          image: Platform.select({
            android: 'ic_menu_delete',
            ios: 'trash',
          }),
          title: 'Destructive Action',
        },
      ] }>
    </MenuView>
  );
}