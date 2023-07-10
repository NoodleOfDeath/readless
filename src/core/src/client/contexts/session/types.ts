import {
  PublicCategoryAttributes,
  PublicPublisherAttributes,
  PublicSummaryGroup,
  ReadingFormat,
  RequestParams,
} from '~/api';

export class Bookmark<T> {

  item: T;
  createdAt: Date;
  
  get serialized() {
    return {
      createdAt: this.createdAt,
      item: this.item,
    };
  }

  constructor(item: T, createdAt = new Date()) {
    this.item = item;
    this.createdAt = createdAt;
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
  // system settings
  colorScheme?: ColorScheme;
  fontFamily?: string;
  fontSizeOffset?: number;
  letterSpacing?: number;
  lineHeightMultiplier?: number;
  
  // display settings
  compactMode?: boolean; // legacy 1.11.0
  compactSummaries?: boolean;
  showShortSummary?: boolean;
  preferredReadingFormat?: ReadingFormat;
  sentimentEnabled?: boolean;
  triggerWords?: { [key: string]: string };
  
  // app state
  rotationLock?: OrientationType;  
  searchHistory?: string[];
  viewedFeatures?: { [key: string]: Bookmark<boolean> };
  hasReviewed?: boolean;
  lastRequestForReview: number;
  
  // summary state
  readSummaries?: { [key: number]: Bookmark<boolean> };
  bookmarkedSummaries?: { [key: number]: Bookmark<PublicSummaryGroup> };
  bookmarkCount: number;
  unreadBookmarkCount: number;
  removedSummaries?: { [key: number]: boolean };
  
  // followed publishers
  followedOutlets?: { [key: string]: boolean }; // legacy 1.10.0
  followedPublishers?: { [key: string]: boolean };
  excludedOutlets?: { [key: string]: boolean }; // legacy 1.10.0
  excludedPublishers?: { [key: string]: boolean };
  
  // followed categories
  followedCategories?: { [key: string]: boolean };
  excludedCategories?: { [key: string]: boolean };
  
  followCount: number;
  followFilter: string;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FunctionWithRequestParams<T extends any[], R> = ((...args: [...T, RequestParams]) => R);

const SESSION_EVENTS = [
  // summaries
  'bookmark-summary',
  'unbookmark-summary',
  'read-summary',
  'unread-summary',
  'hide-summary',
  'unhide-summary',
  // publishers
  'follow-publisher',
  'unfollow-publisher',
  'exclude-publisher',
  'unexclude-publisher',
  // categories
  'follow-category',
  'unfollow-category',
  'exclude-category',
  'unexclude-category',
] as const;

export type SessionEvent = typeof SESSION_EVENTS[number];

export type PreferenceMutation<E extends SessionEvent> =
  E extends `${string}-summary` ? PublicSummaryGroup :
  E extends `${string}-publisher` ? PublicPublisherAttributes :
  E extends `${string}-category` ? PublicCategoryAttributes :
  never;
  
export type PreferenceState<E extends SessionEvent> =
  E extends `${'unbookmark' | 'bookmark'}-summary` ? Preferences['bookmarkedSummaries'] :
  E extends `${string}-summary` ? Preferences['readSummaries'] :
  E extends `${string}-publisher` ? Preferences['followedPublishers'] :
  E extends `${string}-category` ? Preferences['folowedCategories'] :
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
  
  // summary convenience functions
  bookmarkSummary: (summary: PublicSummaryGroup) => Promise<void>;
  readSummary: (summary: PublicSummaryGroup) => Promise<void>;
  removeSummary: (summary: PublicSummaryGroup) => Promise<void>;
  
  // follow publisher/category convenience functions
  followPublisher: (publisher: PublicPublisherAttributes) => Promise<void>;
  excludePublisher: (publisher: PublicPublisherAttributes) => Promise<void>;
  followCategory: (category: PublicCategoryAttributes) => Promise<void>;
  excludeCategory: (category: PublicCategoryAttributes) => Promise<void>;
  
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
  lastRequestForReview: 0,
  readSummary: () => Promise.resolve(),
  removeSummary: () => Promise.resolve(),
  resetPreferences: () => Promise.resolve(),
  setCategories: () => Promise.resolve(),
  setPreference: () => Promise.resolve(),
  setPublishers: () => Promise.resolve(),
  unreadBookmarkCount: 0,
  withHeaders: (fn) => (...args) => fn(...args, {}),
};