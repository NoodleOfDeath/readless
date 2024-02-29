import ms from 'ms';

import { UserData } from './UserData';
export { UserData };

import {
  PublicSummaryGroup,
  ReadingFormat,
  RecapAttributes,
  SupportedLocale,
} from '~/api';

type DatedEventProps = {
  createdAt: Date;
  expiresIn?: string;
};

export class DatedEvent<T> {

  item: T;
  createdAt: Date;
  expiresAt?: Date;
  
  get expired() {
    if (!this.expiresAt) {
      return false;
    }
    return new Date(this.expiresAt).valueOf() < Date.now();
  }

  constructor(item: T, {
    createdAt = new Date(), 
    expiresIn,
  }: Partial<DatedEventProps> = {}) {
    this.item = item;
    this.createdAt = createdAt;
    if (expiresIn) {
      this.expiresAt = new Date(Date.now() + ms(expiresIn));
    }
  }

}

type ColorScheme = 'dark' | 'light' | 'system';

export enum OrientationType {
  'PORTRAIT' = 'PORTRAIT',
  'PORTRAIT-UPSIDEDOWN' = 'PORTRAIT-UPSIDEDOWN',
  'LANDSCAPE-LEFT' = 'LANDSCAPE-LEFT',
  'LANDSCAPE-RIGHT' = 'LANDSCAPE-RIGHT',
  'FACE-UP' = 'FACE-UP',
  'FACE-DOWN' = 'FACE-DOWN',
  'UNKNOWN' = 'UNKNOWN',
}

type PushNotificationSettings = { 
  title?: string;
  body?: string;
  sound?: string;
  category?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  userInfo?: { [key: string]: any };
  repeat?: string; 
  delay?: string;
  fireTime?: string; 
  scheduled?: number[];
};

type ViewableFeature = 
  'app-review' | 'bookmarks' | 'categories' | 'display-preferences' | 'notifications' | 'publishers';

export type StoreState = {
  
  // system state
  lastLocalSync: number | null;
  lastRemoteSync: number | null;
  rotationLock: OrientationType | null;
  searchHistory: string[] | null;
  viewedFeatures: { [key in ViewableFeature]?: DatedEvent<boolean> } | null;
  hasReviewed: boolean | null;
  lastRequestForReview: number | null;
  readNotifications: { [key: number]: DatedEvent<boolean> } | null;
  
  // user state
  uuid: string | null;
  pushNotificationsEnabled: boolean | null;
  pushNotifications: { [key: string]: PushNotificationSettings } | null;
  fcmToken: string | null;
  userData: UserData | null;
  
  // summary state
  readSummaries: { [key: number]: DatedEvent<boolean> } | null;
  bookmarkedSummaries: { [key: number]: DatedEvent<PublicSummaryGroup> } | null;
  saveBookmarksOffline: boolean | null;
  removedSummaries: { [key: number]: boolean } | null;
  locale: SupportedLocale | null;
  summaryTranslations: { [key: number]: { [key in keyof PublicSummaryGroup]?: string } } | null;
  
  // recap state
  readRecaps: { [key: number]: boolean } | null;
  recapTranslations: { [key: number]: { [key in keyof RecapAttributes]?: string } } | null;
  
  // followed publishers
  followedPublishers: { [key: string]: boolean } | null;
  favoritedPublishers: { [key: string]: boolean } | null; 
  excludedPublishers: { [key: string]: boolean } | null;
  
  // followed categories
  followedCategories: { [key: string]: boolean } | null;
  favoritedCategories: { [key: string]: boolean } | null;
  excludedCategories: { [key: string]: boolean } | null;
  
  // system preferences
  colorScheme: ColorScheme | null;
  fontFamily: string | null;
  fontSizeOffset: number | null;
  letterSpacing: number | null;
  lineHeightMultiplier: number | null;
  
  // display preferences
  compactSummaries: boolean | null;
  showShortSummary: boolean | null;
  preferredShortPressFormat: ReadingFormat | null;
  preferredReadingFormat: ReadingFormat | null;
  sentimentEnabled: boolean | null;
};