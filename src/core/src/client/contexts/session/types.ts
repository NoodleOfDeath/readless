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
  
export type Preferences = {
  
  // system state
  rotationLock?: OrientationType;  
  searchHistory?: string[];
  viewedFeatures?: { [key: string]: Bookmark<boolean> };
  hasReviewed?: boolean;
  lastRequestForReview: number;
  
  // user state
  uuid?: string;
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
  followedOutlets?: { [key: string]: boolean }; // legacy 1.10.0
  followedPublishers?: { [key: string]: boolean };
  excludedOutlets?: { [key: string]: boolean }; // legacy 1.10.0
  excludedPublishers?: { [key: string]: boolean };
  
  // followed categories
  followedCategories?: { [key: string]: boolean };
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

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FunctionWithRequestParams<T extends any[], R> = ((...args: [...T, RequestParams]) => R);

const SESSION_EVENTS = [
  // summary state
  'bookmark-summary',
  'unbookmark-summary',
  'read-summary',
  'unread-summary',
  'hide-summary',
  'unhide-summary',
  // recap state
  'read-recap',
  'unread-recap',
  // publisher state
  'follow-publisher',
  'unfollow-publisher',
  'exclude-publisher',
  'unexclude-publisher',
  // category state
  'follow-category',
  'unfollow-category',
  'exclude-category',
  'unexclude-category',
] as const;

export type SessionEvent = typeof SESSION_EVENTS[number];

export type PreferenceMutation<E extends SessionEvent> =
  E extends `${string}-summary` ? PublicSummaryGroup :
  E extends `${string}-recap` ? RecapAttributes :
  E extends `${string}-publisher` ? PublicPublisherAttributes :
  E extends `${string}-category` ? PublicCategoryAttributes :
  never;
  
export type PreferenceState<E extends SessionEvent> =
  E extends `${'unbookmark' | 'bookmark'}-summary` ? Preferences['bookmarkedSummaries'] :
  E extends `${'read' | 'unread'}-summary` ? Preferences['readSummaries'] :
  E extends `${'read' | 'unread'}-recap` ? Preferences['readRecaps'] :
  E extends `${string}-summary` ? Preferences['removedSummaries'] :
  E extends `${string}-publisher` ? Preferences['followedPublishers'] :
  E extends `${string}-category` ? Preferences['followedCategories'] :
  never;

export type SessionContextType = Preferences & {
  ready?: boolean;

  categories?: Record<string, PublicCategoryAttributes>;
  setCategories: React.Dispatch<React.SetStateAction<Record<string, PublicCategoryAttributes> | undefined>>;
  publishers?: Record<string, PublicPublisherAttributes>;
  setPublishers: React.Dispatch<React.SetStateAction<Record<string, PublicPublisherAttributes> | undefined>>;
  
  // state setters
  setPreference: <K extends keyof Preferences>(key: K, value?: Preferences[K] | ((value?: Preferences[K]) => Preferences[K])) => Promise<void>;
  getPreference: <K extends keyof Preferences>(key: K) => Promise<Preferences[K] | undefined>;
  resetPreferences: (hard?: boolean) => Promise<void>;
  storeTranslations: <
    Target extends RecapAttributes | PublicSummaryGroup, 
    PrefKey extends Target extends RecapAttributes ? 'recapTranslations' : Target extends PublicSummaryGroup ? 'summaryTranslations' : never
  >(item: Target, translations: { [key in keyof Target]?: string }, prefKey: PrefKey) => Promise<void>;
  hasViewedFeature: (feature: string) => boolean;
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
  excludePublisher: (publisher: PublicPublisherAttributes) => Promise<void>;
  isExcludingPublisher: (publisher: PublicPublisherAttributes) => boolean;

  // follow category convenience functions
  followCategory: (category: PublicCategoryAttributes) => Promise<void>;
  isFollowingCategory: (publisher: PublicCategoryAttributes) => boolean;
  excludeCategory: (category: PublicCategoryAttributes) => Promise<void>;
  isExcludingCategory: (publisher: PublicCategoryAttributes) => boolean;
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  withHeaders: <T extends any[], R>(fn: FunctionWithRequestParams<T, R>) => ((...args: T) => R);
};

export const DEFAULT_SESSION_CONTEXT: SessionContextType = {
  bookmarkCount: 0,
  bookmarkSummary: () => Promise.resolve(),
  excludeCategory: () => Promise.resolve(),
  excludePublisher: () => Promise.resolve(),
  followCategory: () => Promise.resolve(),
  followCount: 0,
  followFilter: '',
  followPublisher: () => Promise.resolve(),
  getPreference: () => Promise.resolve(undefined),
  isExcludingCategory: () => false,
  isExcludingPublisher: () => false,
  isFollowingCategory: () => false,
  isFollowingPublisher: () => false,
  lastRequestForReview: 0,
  readRecap: () => Promise.resolve(),
  readSummary: () => Promise.resolve(),
  removeSummary: () => Promise.resolve(),
  resetPreferences: () => Promise.resolve(),
  setCategories: () => Promise.resolve(),
  setPreference: () => Promise.resolve(),
  setPublishers: () => Promise.resolve(),
  storeTranslations: () => Promise.resolve(undefined),
  unreadBookmarkCount: 0,
  withHeaders: (fn) => (...args) => fn(...args, {}),
};