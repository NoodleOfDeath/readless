import ms from 'ms';

import {
  PublicCategoryAttributes,
  PublicPublisherAttributes,
  PublicSummaryGroup,
  ReadingFormat,
  RecapAttributes,
  RequestParams,
} from '~/api';

export type BookmarkConstructorProps = {
  createdAt: Date;
  expiresIn?: string;
};

export class Bookmark<T> {

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
  }: Partial<BookmarkConstructorProps> = {}) {
    this.item = item;
    this.createdAt = createdAt;
    if (expiresIn) {
      this.expiresAt = new Date(Date.now() + ms(expiresIn));
    }
  }

}

export type ColorScheme = 'light' | 'dark' | 'system';

export enum OrientationType {
  'PORTRAIT' = 'PORTRAIT',
  'PORTRAIT-UPSIDEDOWN' = 'PORTRAIT-UPSIDEDOWN',
  'LANDSCAPE-LEFT' = 'LANDSCAPE-LEFT',
  'LANDSCAPE-RIGHT' = 'LANDSCAPE-RIGHT',
  'FACE-UP' = 'FACE-UP',
  'FACE-DOWN' = 'FACE-DOWN',
  'UNKNOWN' = 'UNKNOWN',
}

export type PushNotificationSettings = { 
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

export const ACTIVITY_KEYS = [
  'in-app-review',
  'in-app-review-failed',
  'set-preference',
  'localize',
  'navigate',
] as const;

export type Activity = typeof ACTIVITY_KEYS[number];

export type ResourceActivity = 
 | 'read'
 | 'unread'
 | 'hide'
 | 'unhide'
 | 'bookmark' 
 | 'unbookmark' 
 | 'follow'
 | 'unfollow'
 | 'favorite'
 | 'unfavorite'
 | 'exclude'
 | 'unexclude'
 | 'copy-to-clipboard'
 | 'intent-to-share'
 | 'save-as-image'
 | 'share-standard'
 | 'share-social'
 | 'set-preference'
 | 'report'
 | 'expand'
 | 'preview'
 | 'view-sentiment'
 | 'open-article';

export type Resource =
 | 'category'
 | 'publisher'
 | 'recap'
 | 'summary';
 
export type SessionEvent = Activity | ResourceActivity | `${ResourceActivity}-${Resource}` | `${ResourceActivity}-${Resource}-${number}` | `poll-${string}`;

export type Preferences = {
  
  // system state
  latestVersion?: string;
  rotationLock?: OrientationType;  
  searchHistory?: string[];
  viewedFeatures?: { [key: string]: Bookmark<boolean> };
  hasReviewed?: boolean;
  lastRequestForReview: number;
  
  // user state
  uuid?: string;
  pushNotificationsEnabled?: boolean;
  pushNotifications?: { [key: string]: PushNotificationSettings };
  fcmToken?: string;
  
  // summary state
  readSummaries?: { [key: number]: Bookmark<boolean> };
  bookmarkedSummaries?: { [key: number]: Bookmark<PublicSummaryGroup> };
  bookmarkCount: number;
  unreadBookmarkCount: number;
  removedSummaries?: { [key: number]: boolean };
  summaryTranslations?: { [key: number]: { [key in keyof PublicSummaryGroup]?: string } };
  
  // recap state
  readRecaps?: { [key: number]: boolean };
  recapTranslations?: { [key: number]: { [key in keyof RecapAttributes]?: string } };
  
  // followed publishers
  followedPublishers?: { [key: string]: boolean };
  favoritedPublishers?: { [key: string]: boolean }; 
  excludedPublishers?: { [key: string]: boolean };
  
  // followed categories
  followedCategories?: { [key: string]: boolean };
  favoritedCategories?: { [key: string]: boolean };
  excludedCategories?: { [key: string]: boolean };
  
  followCount: number;
  followFilter?: string;
  excludeFilter?: string;
  
  // system preferences
  colorScheme?: ColorScheme;
  fontFamily?: string;
  fontSizeOffset?: number;
  letterSpacing?: number;
  lineHeightMultiplier?: number;
  
  // display preferences
  compactMode?: boolean; // legacy 1.11.0
  compactSummaries?: boolean;
  showShortSummary?: boolean;
  preferredShortPressFormat?: ReadingFormat;
  preferredReadingFormat?: ReadingFormat;
  sentimentEnabled?: boolean;
  triggerWords?: { [key: string]: string };
};

export const PREFERENCE_TYPES: { [key in keyof Preferences]: 'boolean' | 'number' | 'string' | 'object' | 'array' } = {
  bookmarkCount: 'number',
  bookmarkedSummaries: 'object',
  colorScheme: 'string',
  compactMode: 'boolean',
  compactSummaries: 'boolean',
  excludeFilter: 'string',
  excludedCategories: 'object',
  excludedPublishers: 'object',
  favoritedCategories: 'object',
  favoritedPublishers: 'object',
  fcmToken: 'string',
  followCount: 'number',
  followFilter: 'string',
  followedCategories: 'object',
  followedPublishers: 'object',
  fontFamily: 'string',
  fontSizeOffset: 'number',
  hasReviewed: 'boolean',
  lastRequestForReview: 'number',
  letterSpacing: 'number',
  lineHeightMultiplier: 'number',
  preferredReadingFormat: 'string',
  preferredShortPressFormat: 'string',
  pushNotifications: 'object',
  pushNotificationsEnabled: 'boolean',
  readRecaps: 'object',
  readSummaries: 'object',
  recapTranslations: 'object',
  removedSummaries: 'object',
  rotationLock: 'boolean',
  searchHistory: 'array',
  sentimentEnabled: 'boolean',
  showShortSummary: 'boolean',
  summaryTranslations: 'object',
  triggerWords: 'object',
  unreadBookmarkCount: 'number',
  uuid: 'string',
  viewedFeatures: 'object',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FunctionWithRequestParams<T extends any[], R> = ((...args: [...T, RequestParams]) => R);

export type PreferenceMutation<E extends SessionEvent> =
  E extends `${string}-summary` ? PublicSummaryGroup :
  E extends `${string}-recap` ? RecapAttributes :
  E extends `${string}-publisher` ? PublicPublisherAttributes :
  E extends `${string}-category` ? PublicCategoryAttributes :
  E extends `in-app-review-${string}` ? string :
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any;
  
export type PreferenceState<E extends SessionEvent> =
  E extends `${'unbookmark' | 'bookmark'}-summary` ? Preferences['bookmarkedSummaries'] :
  E extends `${'read' | 'unread'}-summary` ? Preferences['readSummaries'] :
  E extends `${'read' | 'unread'}-recap` ? Preferences['readRecaps'] :
  E extends `${string}-summary` ? Preferences['removedSummaries'] :
  E extends `${string}-publisher` ? Preferences['followedPublishers'] :
  E extends `${string}-category` ? Preferences['followedCategories'] :
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any;

export type SessionContextType = Preferences & {
  ready?: boolean;

  categories?: Record<string, PublicCategoryAttributes>;
  setCategories: React.Dispatch<React.SetStateAction<Record<string, PublicCategoryAttributes> | undefined>>;
  publishers?: Record<string, PublicPublisherAttributes>;
  setPublishers: React.Dispatch<React.SetStateAction<Record<string, PublicPublisherAttributes> | undefined>>;
  
  // state setters
  setPreference: <K extends keyof Preferences, V extends Preferences[K] | ((value?: Preferences[K]) => (Preferences[K] | undefined))>(key: K, value?: V, emit?: boolean) => Promise<void>;
  getPreference: <K extends keyof Preferences>(key: K) => Promise<Preferences[K] | undefined>;
  resetPreferences: (hard?: boolean) => Promise<void>;
  storeTranslations: <
    Target extends RecapAttributes | PublicSummaryGroup, 
    PrefKey extends Target extends RecapAttributes ? 'recapTranslations' : Target extends PublicSummaryGroup ? 'summaryTranslations' : never
  >(item: Target, translations: { [key in keyof Target]?: string }, prefKey: PrefKey) => Promise<void>;
  hasPushEnabled: (key: string) => boolean;
  enablePush: (key: string, settings?: PushNotificationSettings) => Promise<void>;
  hasViewedFeature: (...features: string[]) => boolean;
  viewFeature: (feature: string, state?: boolean) => Promise<void>;
  
  // summary convenience functions
  bookmarkSummary: (summary: PublicSummaryGroup) => Promise<void>;
  readSummary: (summary: PublicSummaryGroup, force?: boolean) => Promise<void>;
  removeSummary: (summary: PublicSummaryGroup) => Promise<void>;
  
  // recap convenience functions
  readRecap: (recap: RecapAttributes, force?: boolean) => Promise<void>;
  
  // follow publisher convenience functions
  followPublisher: (publisher: PublicPublisherAttributes) => Promise<void>;
  isFollowingPublisher: (publisher: PublicPublisherAttributes) => boolean;
  favoritePublisher: (publisher: PublicPublisherAttributes) => Promise<void>;
  publisherIsFavorited: (publisher: PublicPublisherAttributes) => boolean;
  excludePublisher: (publisher: PublicPublisherAttributes) => Promise<void>;
  isExcludingPublisher: (publisher: PublicPublisherAttributes) => boolean;

  // follow category convenience functions
  followCategory: (category: PublicCategoryAttributes) => Promise<void>;
  isFollowingCategory: (publisher: PublicCategoryAttributes) => boolean;
  favoriteCategory: (category: PublicCategoryAttributes) => Promise<void>;
  categoryIsFavorited: (category: PublicCategoryAttributes) => boolean;
  excludeCategory: (category: PublicCategoryAttributes) => Promise<void>;
  isExcludingCategory: (publisher: PublicCategoryAttributes) => boolean;
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  withHeaders: <T extends any[], R>(fn: FunctionWithRequestParams<T, R>) => ((...args: T) => R);
};

export const DEFAULT_SESSION_CONTEXT: SessionContextType = {
  bookmarkCount: 0,
  bookmarkSummary: () => Promise.resolve(),
  categoryIsFavorited: () => false,
  enablePush: () => Promise.resolve(),
  excludeCategory: () => Promise.resolve(),
  excludePublisher: () => Promise.resolve(),
  favoriteCategory: () => Promise.resolve(),
  favoritePublisher: () => Promise.resolve(),
  followCategory: () => Promise.resolve(),
  followCount: 0,
  followFilter: '',
  followPublisher: () => Promise.resolve(),
  getPreference: () => Promise.resolve(undefined),
  hasPushEnabled: () => false,
  hasViewedFeature: () => false,
  isExcludingCategory: () => false,
  isExcludingPublisher: () => false,
  isFollowingCategory: () => false,
  isFollowingPublisher: () => false,
  lastRequestForReview: 0,
  publisherIsFavorited: () => false,
  readRecap: () => Promise.resolve(),
  readSummary: () => Promise.resolve(),
  removeSummary: () => Promise.resolve(),
  resetPreferences: () => Promise.resolve(),
  setCategories: () => Promise.resolve(),
  setPreference: () => Promise.resolve(),
  setPublishers: () => Promise.resolve(),
  storeTranslations: () => Promise.resolve(undefined),
  unreadBookmarkCount: 0,
  viewFeature: () => Promise.resolve(),
  withHeaders: (fn) => (...args) => fn(...args, {}),
};