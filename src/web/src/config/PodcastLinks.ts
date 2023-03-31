import {
  mdiApple,
  mdiAws,
  mdiSpotify,
} from '@mdi/js';

import { NavigationItemProps } from '@/components/layout/header/NavigationItem';
import iheart from '@/icons/iheart';

export const PODCAST_LINKS: NavigationItemProps[] = [
  {
    icon: mdiApple,
    id: 'apple-podcast',
    label: 'Apple Podcasts',
    onClick: () =>
      window.open(
        'https://podcasts.apple.com/us/podcast/readless/id1671374300',
        '_blank'
      ),
    visible: true,
  },
  {
    icon: mdiAws,
    id: 'amazon-music',
    label: 'Amazon Music',
    onClick: () =>
      window.open(
        'https://music.amazon.com/podcasts/0a765ea8-0b43-4862-9b21-57af667298b0/readless',
        '_blank'
      ),
    visible: true,
  },
  {
    icon: mdiSpotify,
    id: 'spotify',
    label: 'Spotify',
    onClick: () =>
      window.open(
        'https://open.spotify.com/show/1FOOkjziA7J1Ly3a1z54jG?si=628702de0d85485e',
        '_blank'
      ),
    visible: true,
  },
  {
    icon: iheart,
    id: 'iheart',
    label: 'iHeartRadio',
    onClick: () =>
      window.open(
        'https://www.iheart.com/podcast/269-readless-108727878?&autoplay=true',
        '_blank'
      ),
    visible: true,
  },
];
