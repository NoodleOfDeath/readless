export * from './discover/DiscoverScreen';
export * from './notifications/NotificationsScreen';
export * from './profile/ProfileScreen';
export * from './search/SearchScreen';
export * from './summary/SummaryScreen';
export * from './whats-new/WhatsNewScreen';

export * from './types';

import { DiscoverScreen } from './discover/DiscoverScreen';
import { NotificationsScreen } from './notifications/NotificationsScreen';
import { ProfileScreen } from './profile/ProfileScreen';
import { ScreenProps } from './types';

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
    icon: 'account',
    name: 'Profile',
  },
];