import React from 'react';
import { Pressable } from 'react-native';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

import DiscoverScreen from './discover/DiscoverScreen';
import NotificationsScreen from './notifications/NotificationsScreen';
import ProfileScreen from './profile/ProfileScreen';
import { useTheme } from '../components/theme';

type ScreenProps = {
  name: string;
  component: React.ComponentType;
  icon: string;
  headerRight?:
    | ((props: {
        tintColor?: string;
        pressColor?: string;
        pressOpacity?: number;
      }) => React.ReactNode)
    ;
};

export const SCREENS: ScreenProps[] = [
  {
    component: DiscoverScreen,
    icon: 'fire',
    name: 'Discover',
  },
  {
    component: NotificationsScreen,
    icon: 'bell',
    name: 'Notifications',
  },
  {
    component: ProfileScreen,
    headerRight: () => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const theme = useTheme();
      return (
        <Pressable style={ theme.components.buttonPadded }>
          <Icon name="menu" size={ 32 } color={ theme.components.button.color } />
        </Pressable>
      );
    },
    icon: 'account',
    name: 'Profile',
  },
];
