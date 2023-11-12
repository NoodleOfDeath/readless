import ms from 'ms';

import { UserData } from './UserData';

import {
  API,
  ProfileResponse,
  PublicCategoryAttributes,
  PublicPublisherAttributes,
  PublicSummaryGroup,
  ReadingFormat,
  RecapAttributes,
  RequestParams,
  SupportedLocale,
} from '~/api';

export type DatedEventProps = {
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
 
export type StorageEventName = Activity | ResourceActivity | `${ResourceActivity}-${Resource}` | `${ResourceActivity}-${Resource}-${number}` | `poll-${string}`;

export type Storage = {
  
  // system state
  lastRemoteSync?: Date;
  rotationLock?: OrientationType;  
  searchHistory?: string[];
  viewedFeatures?: { [key: string]: DatedEvent<boolean> };
  hasReviewed?: boolean;
  lastRequestForReview: number;
  
  // user state
  uuid?: string;
  pushNotificationsEnabled?: boolean;
  pushNotifications?: { [key: string]: PushNotificationSettings };
  fcmToken?: string;
  userData?: UserData;
  userStats?: UserStats;
  
  // summary state
  readSummaries?: { [key: number]: DatedEvent<boolean> };
  bookmarkedSummaries?: { [key: number]: DatedEvent<PublicSummaryGroup> };
  removedSummaries?: { [key: number]: boolean };
  locale?: SupportedLocale;
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
  
  // system preferences
  colorScheme?: ColorScheme;
  fontFamily?: string;
  fontSizeOffset?: number;
  letterSpacing?: number;
  lineHeightMultiplier?: number;
  
  // display preferences
  compactSummaries?: boolean;
  showShortSummary?: boolean;
  preferredShortPressFormat?: ReadingFormat;
  preferredReadingFormat?: ReadingFormat;
  sentimentEnabled?: boolean;
  triggerWords?: { [key: string]: string };
};

export const STORAGE_TYPES: { [key in keyof Storage]: 'boolean' | 'number' | 'string' | 'object' | 'array' } = {
  bookmarkedSummaries: 'object',
  colorScheme: 'string',
  compactSummaries: 'boolean',
  excludedCategories: 'object',
  excludedPublishers: 'object',
  favoritedCategories: 'object',
  favoritedPublishers: 'object',
  fcmToken: 'string',
  followedCategories: 'object',
  followedPublishers: 'object',
  fontFamily: 'string',
  fontSizeOffset: 'number',
  hasReviewed: 'boolean',
  lastRequestForReview: 'number',
  letterSpacing: 'number',
  lineHeightMultiplier: 'number',
  locale: 'string',
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
  userData: 'object',
  userStats: 'object',
  uuid: 'string',
  viewedFeatures: 'object',
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FunctionWithRequestParams<T extends any[], R> = ((...args: [...T, RequestParams]) => R);

export type StorageMutation<E extends StorageEventName> =
  E extends `${string}-summary` ? PublicSummaryGroup :
  E extends `${string}-recap` ? RecapAttributes :
  E extends `${string}-publisher` ? PublicPublisherAttributes :
  E extends `${string}-category` ? PublicCategoryAttributes :
  E extends `in-app-review-${string}` ? string :
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any;
  
export type StorageState<E extends StorageEventName> =
  E extends `${'unbookmark' | 'bookmark'}-summary` ? Storage['bookmarkedSummaries'] :
  E extends `${'read' | 'unread'}-summary` ? Storage['readSummaries'] :
  E extends `${'read' | 'unread'}-recap` ? Storage['readRecaps'] :
  E extends `${string}-summary` ? Storage['removedSummaries'] :
  E extends `${string}-publisher` ? Storage['followedPublishers'] :
  E extends `${string}-category` ? Storage['followedCategories'] :
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any;

export type Streak = {
  start: Date;
  length: number;
};

export type UserStats = {
  lastSeen?: Date;
  streak?: Streak;
  longestStreak?: Streak;
};

export const SYNCABLE_SETTINGS: (keyof Storage)[] = [
  'colorScheme',
  'compactSummaries',
  'showShortSummary',
  'preferredReadingFormat',
  'preferredShortPressFormat',
  'fontFamily',
  'fontSizeOffset',
  'letterSpacing',
  'lineHeightMultiplier',
  'pushNotifications',
  'pushNotificationsEnabled',
  'bookmarkedSummaries',
  'readSummaries',
  'removedSummaries',
  'followedPublishers',
  'favoritedPublishers',
  'excludedPublishers',
  'followedCategories',
  'favoritedCategories',
  'excludedCategories',
  'userStats',
] as const;

export type SyncableSetting = typeof SYNCABLE_SETTINGS[number];

export const SYNCABLE_IO_IN_DEFAULT = <K extends SyncableSetting>(value?: object) => value as Storage[K];
export const SYNCABLE_IO_OUT_DEFAULT = <K extends SyncableSetting>(value?: Storage[K]) => JSON.stringify(value);

export const SYNCABLE_IO_IN_BOOLEAN_MAP = <K extends SyncableSetting>(value?: object): Storage[K] => {
  if (value) {
    if (Array.isArray(value)) {
      return value.reduce((acc, key) => ({ ...acc, [key]: true }), {}) as Storage[K];
    }
  }
  return {} as Storage[K];
};

export const SYNCABLE_IO_OUT_DATED_MAP = <K extends SyncableSetting>(value?: Storage[K]) => {
  if (value) {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const remap = Object.fromEntries(Object.keys(value || {}).map((key) => [key, (value as any)[key].createdAt ?? new Date()]));
    return JSON.stringify(remap);
  }
  return '{}';
};

export const SYNCABLE_IO_IN: { [K in SyncableSetting]?: ((value?: object) => Storage[K]) } = {
  excludedCategories: SYNCABLE_IO_IN_BOOLEAN_MAP<'excludedCategories'>,
  excludedPublishers: SYNCABLE_IO_IN_BOOLEAN_MAP<'excludedPublishers'>,
  favoritedCategories: SYNCABLE_IO_IN_BOOLEAN_MAP<'favoritedCategories'>,
  favoritedPublishers: SYNCABLE_IO_IN_BOOLEAN_MAP<'favoritedPublishers'>,
  followedCategories: SYNCABLE_IO_IN_BOOLEAN_MAP<'followedCategories'>,
  followedPublishers: SYNCABLE_IO_IN_BOOLEAN_MAP<'followedPublishers'>,
  removedSummaries: SYNCABLE_IO_IN_BOOLEAN_MAP<'removedSummaries'>,
};

export const SYNCABLE_IO_OUT: { [K in SyncableSetting]?: ((value?: Storage[K]) => string) } = {
  bookmarkedSummaries: SYNCABLE_IO_OUT_DATED_MAP,
  excludedCategories: (value) => JSON.stringify(Object.keys(value || {})),
  excludedPublishers: (value) => JSON.stringify(Object.keys(value || {})),
  favoritedCategories: (value) => JSON.stringify(Object.keys(value || {})),
  favoritedPublishers: (value) => JSON.stringify(Object.keys(value || {})),
  followedCategories: (value) => JSON.stringify(Object.keys(value || {})),
  followedPublishers: (value) => JSON.stringify(Object.keys(value || {})),
  removedSummaries: (value) => JSON.stringify(Object.keys(value || {})),
};

export const SyncableIoIn = <K extends SyncableSetting>(key?: K) => key ? SYNCABLE_IO_IN[key] || SYNCABLE_IO_IN_DEFAULT : SYNCABLE_IO_IN_DEFAULT;
export const SyncableIoOut = <K extends SyncableSetting>(key?: K) => key ? SYNCABLE_IO_OUT[key] || SYNCABLE_IO_OUT_DEFAULT : SYNCABLE_IO_OUT_DEFAULT;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Methods = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [k in keyof typeof API]: typeof API[k] extends (...args: [...Parameters<typeof API[k]>, RequestParams | undefined]) => infer R ? 
  (...args: Parameters<typeof API[k]>) => R : never;
} & {
  getSummary: (id: number) => ReturnType<typeof API['getSummaries']>;
};

export type SyncState = {
  hasLoadedLocalState?: boolean;
  
  isSyncingWithRemote?: boolean;
  hasSyncedWithRemote?: boolean;
  
  isFetchingProfile?: boolean;
  hasFetchedProfile?: boolean;
  
  isSyncingBookmarks?: boolean;
  hasSyncedBookmarks?: boolean;
};

export type StorageContextType = Storage & SyncState & {
  
  ready?: boolean;
  
  loadedInitialUrl?: boolean;
  setLoadedInitialUrl: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  
  categories?: Record<string, PublicCategoryAttributes>;
  setCategories: React.Dispatch<React.SetStateAction<Record<string, PublicCategoryAttributes> | undefined>>;
  publishers?: Record<string, PublicPublisherAttributes>;
  setPublishers: React.Dispatch<React.SetStateAction<Record<string, PublicPublisherAttributes> | undefined>>;

  bookmarkCount: number;
  unreadBookmarkCount: number;
  
  followCount: number;
  followFilter?: string;
  excludeFilter?: string;

  // state setters
  setStoredValue: <K extends keyof Storage, V extends Storage[K] | ((value?: Storage[K]) => (Storage[K] | undefined))>(key: K, value?: V, emit?: boolean) => Promise<void>;
  getStoredValue: <K extends keyof Storage>(key: K) => Promise<Storage[K] | undefined>;
  resetStorage: (hard?: boolean) => Promise<void>;
  storeTranslations: <
    Target extends RecapAttributes | PublicSummaryGroup, 
    StoredValueKey extends Target extends RecapAttributes ? 'recapTranslations' : Target extends PublicSummaryGroup ? 'summaryTranslations' : never
  >(item: Target, translations: { [key in keyof Target]?: string }, prefKey: StoredValueKey) => Promise<void>;
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
  syncWithRemotePrefs: (pref?: ProfileResponse) => Promise<void>;
  api: Methods;
};

export const DEFAULT_STORAGE_CONTEXT: StorageContextType = {
  api: API as Methods,
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
  getStoredValue: () => Promise.resolve(undefined),
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
  resetStorage: () => Promise.resolve(),
  setCategories: () => Promise.resolve(),
  setLoadedInitialUrl: () => Promise.resolve(),
  setPublishers: () => Promise.resolve(),
  setStoredValue: () => Promise.resolve(),
  storeTranslations: () => Promise.resolve(undefined),
  syncWithRemotePrefs: () => Promise.resolve(),
  unreadBookmarkCount: 0,
  viewFeature: () => Promise.resolve(),
  withHeaders: (fn) => (...args) => fn(...args, {}),
};