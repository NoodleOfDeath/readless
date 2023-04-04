export * from './discover/DiscoverTab';
export * from './profile/ProfileTab';
export * from './search/SearchTab';

import { DiscoverTab } from './discover/DiscoverTab';
import { ProfileTab } from './profile/ProfileTab';
import { SearchTab } from './search/SearchTab';

import { ScreenProps } from '~/screens';

export const TABS: ScreenProps[] = [
  // {
  //   component: DiscoverTab,
  //   icon: 'fire',
  //   name: 'Discover',
  // },
  {
    component: SearchTab,
    icon: 'magnify',
    name: 'Search',
  },
  // {
  //   component: ProfileTab,
  //   icon: 'account',
  //   name: 'Profile',
  // },
];