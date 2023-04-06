import { DiscoverTab } from './discover/DiscoverTab';
import { NewsTab } from './news/NewsTab';
import { ProfileTab } from './profile/ProfileTab';
import { SearchTab } from './search/SearchTab';
import { YourStuffTab } from './your-stuff/YourStuffTab';

import { ScreenProps } from '~/screens';

export const TABS: ScreenProps[] = [
  // {
  //   component: DiscoverTab,
  //   icon: 'fire',
  //   name: 'Discover',
  // },
  {
    component: NewsTab,
    icon: 'newspaper',
    name: 'News',
  },
  {
    component: YourStuffTab,
    icon: 'bookmark-multiple',
    name: 'Your Stuff',
  },
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