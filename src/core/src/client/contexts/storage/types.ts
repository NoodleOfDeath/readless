import ms from 'ms';

import { UserData } from './UserData';

import {
  API,
  AuthError,
  ProfileResponse,
  PublicCategoryAttributes,
  PublicPublisherAttributes,
  PublicSummaryGroup,
  PublicSystemNotificationAttributes,
  ReadingFormat,
  RecapAttributes,
  RequestParams,
  Streak,
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

export type ColorScheme = 'dark' | 'light' | 'system';

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
 'bookmark' | 'copy-to-clipboard' | 'exclude' | 'expand' | 'favorite' | 'follow' | 'hide' | 'intent-to-share' | 'open-article' | 'preview' | 'read' | 'report' | 'save-as-image' | 'set-preference' | 'share-social' | 'share-standard' | 'unbookmark' | 'unexclude' | 'unfavorite' | 'unfollow' | 'unhide' | 'unread' | 'view-sentiment';

export type Resource =
 | 'category'
 | 'publisher'
 | 'recap'
 | 'summary';
 
export type StorageEventName = Activity | ResourceActivity | `${ResourceActivity}-${Resource}-${number}` | `${ResourceActivity}-${Resource}` | `poll-${string}`;

export type Storage = {
  
  // system state
  lastLocalSync?: number;
  lastRemoteSync?: number;
  rotationLock?: OrientationType;  
  searchHistory?: string[];
  viewedFeatures?: { [key in ViewableFeature]?: DatedEvent<boolean> };
  hasReviewed?: boolean;
  lastRequestForReview: number;
  readNotifications?: { [key: number]: DatedEvent<boolean> };
  
  // user state
  uuid?: string;
  pushNotificationsEnabled?: boolean;
  pushNotifications?: { [key: string]: PushNotificationSettings };
  fcmToken?: string;
  userData?: UserData;
  
  // summary state
  readSummaries?: { [key: number]: DatedEvent<boolean> };
  bookmarkedSummaries?: { [key: number]: DatedEvent<PublicSummaryGroup> };
  saveBookmarksOffline?: boolean;
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

export const STORAGE_TYPES: { [key in keyof Storage]: 'array' | 'boolean' | 'number' | 'object' | 'string' } = {
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
  lastRemoteSync: 'number',
  lastRequestForReview: 'number',
  letterSpacing: 'number',
  lineHeightMultiplier: 'number',
  locale: 'string',
  preferredReadingFormat: 'string',
  preferredShortPressFormat: 'string',
  pushNotifications: 'object',
  pushNotificationsEnabled: 'boolean',
  readNotifications: 'object',
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
  E extends `${'bookmark' | 'unbookmark'}-summary` ? Storage['bookmarkedSummaries'] :
  E extends `${'read' | 'unread'}-summary` ? Storage['readSummaries'] :
  E extends `${'read' | 'unread'}-recap` ? Storage['readRecaps'] :
  E extends `${string}-summary` ? Storage['removedSummaries'] :
  E extends `${string}-publisher` ? Storage['followedPublishers'] :
  E extends `${string}-category` ? Storage['followedCategories'] :
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  any;

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
  'viewedFeatures',
  'searchHistory',
  'readNotifications',
];

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

export type SyncOptions = {
  syncBookmarks?: boolean;
};

export type FetchState = {
  isFetching?: boolean;
  lastFetch?: Date;
  lastFetchFailed?: Date;
  fetchError?: Error;
};

export class FetchJob implements FetchState {
  
  fn?: () => Promise<void>;
  interval = ms('3s');
  maxAttempts = 2;
  
  attemptCount = 0;
  isFetching?: boolean;
  lastFetch?: Date;
  lastFetchFailed?: Date;
  fetchError?: Error;
  
  static Success(): FetchState {
    return {
      fetchError: undefined,
      isFetching: false,
      lastFetch: new Date(),
      lastFetchFailed: undefined,
    };
  }
  
  static Fail(e?: Error): FetchState {
    return {
      fetchError: e,
      isFetching: false,
      lastFetch: undefined,
      lastFetchFailed: new Date,
    };
  }
  
  constructor(
    fn?: () => Promise<void>,
    interval = ms('3s'), 
    maxAttempts = 2,
    isFetching?: boolean,
    lastFetch?: Date,
    lastFetchFailed?: Date,
    fetchError?: Error
  ) {
    this.fn = fn;
    this.interval = interval;
    this.maxAttempts = maxAttempts;
    this.isFetching = isFetching;
    this.lastFetch = lastFetch;
    this.lastFetchFailed = lastFetchFailed;
    this.fetchError = fetchError;
  }

  prepare() {
    this.isFetching = true;
    this.lastFetch = undefined;
    this.lastFetchFailed = undefined;
    this.fetchError = undefined;
    return this;
  }
  
  async dispatch() {
    if (this.isFetching || this.lastFetch || this.lastFetchFailed) {
      if (this.lastFetchFailed && this.attemptCount >= this.maxAttempts) {
        throw new Error('Max attempts reached');
      } else
      if (this.fetchError) {
        throw this.fetchError;
      }
      return;
    }
    this.attemptCount++;
    this.prepare();
    try {
      await this.fn?.();
      this.lastFetch = new Date();
    } catch (e) {
      this.fetchError = e;
      this.lastFetchFailed = new Date();
    } finally {
      this.isFetching = false;
    }
    if (this.lastFetchFailed && this.attemptCount < this.maxAttempts) {
      await new Promise<void>((resolve) => setTimeout(resolve, this.interval));
      await this.dispatch();
    }
  }

  get clone() {
    return new FetchJob(this.fn, this.interval, this.maxAttempts, this.isFetching, this.lastFetch, this.lastFetchFailed, this.fetchError);
  }
  
  success() {
    this.fetchError = undefined;
    this.isFetching = false;
    this.lastFetch = new Date();
    this.lastFetchFailed = undefined;
    return this;
  }

  fail(e?: Error) {
    this.fetchError = e;
    this.isFetching = false;
    this.lastFetch = undefined;
    this.lastFetchFailed = new Date();
    return this;
  }

}

export class SyncState extends FetchJob {
  
  hasLoadedLocalState?: boolean;
  
  channels = new FetchJob();
  notifications = new FetchJob();  
  profile = new FetchJob();
  bookmarks = new FetchJob();
  
  get clone() {
    return new SyncState(this);
  }
  
  constructor(state?: SyncState) {
    super();
    this.hasLoadedLocalState = state?.hasLoadedLocalState;
    this.isFetching = state?.isFetching;
    this.lastFetch = state?.lastFetch;
    this.lastFetchFailed = state?.lastFetchFailed;
    this.fetchError = state?.fetchError;
    this.channels = state?.channels.clone ?? new FetchJob();
    this.notifications = state?.notifications.clone ?? new FetchJob();
    this.profile = state?.profile.clone ?? new FetchJob();
    this.bookmarks = state?.bookmarks.clone ?? new FetchJob();
  }

}

export type ViewableFeature = 
  'app-review' | 'bookmarks' | 'categories' | 'display-preferences' | 'notifications' | 'publishers';

export type StorageContextType = Storage & {
  
  ready?: boolean;
  syncState: SyncState;
  
  loadedInitialUrl?: boolean;
  setLoadedInitialUrl: React.Dispatch<React.SetStateAction<boolean | undefined>>;
  
  currentStreak?: Streak;
  longestStreak?: Streak;

  notifications?: PublicSystemNotificationAttributes[];
  setNotifications: React.Dispatch<React.SetStateAction<PublicSystemNotificationAttributes[] | undefined>>;
  notificationCount: number;
  unreadNotificationCount: number;

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
    Target extends PublicSummaryGroup | RecapAttributes, 
    StoredValueKey extends Target extends RecapAttributes ? 'recapTranslations' : Target extends PublicSummaryGroup ? 'summaryTranslations' : never
  >(item: Target, translations: { [key in keyof Target]?: string }, prefKey: StoredValueKey) => Promise<void>;
  hasPushEnabled: (key: string) => boolean;
  enablePush: (key: string, settings?: PushNotificationSettings) => Promise<void>;
  hasViewedFeature: (...features: ViewableFeature[]) => boolean;
  viewFeature: (feature: ViewableFeature, state?: boolean) => Promise<void>;
  hasReadNotification: (...notifications: (SystemNotificationAttributes | number)[]) => boolean;
  readNotification: (...notifications: (SystemNotificationAttributes | number)[]) => Promise<void>;
  
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
  syncWithRemote: (pref?: ProfileResponse, opts?: SyncOptions) => Promise<void>;
  api: Methods;
  setErrorHandler: React.Dispatch<React.SetStateAction<(error: AuthError | Error) => void>>;
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
  hasReadNotification: () => false,
  hasViewedFeature: () => false,
  isExcludingCategory: () => false,
  isExcludingPublisher: () => false,
  isFollowingCategory: () => false,
  isFollowingPublisher: () => false,
  lastRequestForReview: 0,
  notificationCount: 0,
  publisherIsFavorited: () => false,
  readNotification: () => Promise.resolve(),
  readRecap: () => Promise.resolve(),
  readSummary: () => Promise.resolve(),
  removeSummary: () => Promise.resolve(),
  resetStorage: () => Promise.resolve(),
  setCategories: () => Promise.resolve(),
  setErrorHandler: () => Promise.resolve(),
  setLoadedInitialUrl: () => Promise.resolve(),
  setPublishers: () => Promise.resolve(),
  setStoredValue: () => Promise.resolve(),
  storeTranslations: () => Promise.resolve(undefined),
  syncState: new SyncState(),
  syncWithRemote: () => Promise.resolve(),
  unreadBookmarkCount: 0,
  unreadNotificationCount: 0,
  viewFeature: () => Promise.resolve(),
  withHeaders: (fn) => (...args) => fn(...args, {}),
};