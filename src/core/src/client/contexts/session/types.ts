import {
  PublicCategoryAttributes,
  PublicPublisherAttributes,
  PublicSummaryAttributesConservative,
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
  compactMode?: boolean;
  showShortSummary?: boolean;
  preferredReadingFormat?: ReadingFormat;
  sourceLinks?: boolean;
  sentimentEnabled?: boolean;
  triggerWords?: { [key: string]: string };
  
  // app state
  loadedInitialUrl?: boolean;
  rotationLock?: OrientationType;  
  searchHistory?: string[];
  showOnlyCustomNews?: boolean;
  viewedFeatures?: { [key: string]: Bookmark<boolean> };
  hasReviewed?: boolean;
  lastRequestForReview: number;
  
  // summary state
  readSummaries?: { [key: number]: Bookmark<boolean> };
  readSources?: { [key: number]: Bookmark<boolean> };
  bookmarkedSummaries?: { [key: number]: Bookmark<PublicSummaryGroup> };
  bookmarkCount: number;
  unreadBookmarkCount: number;
  removedSummaries?: { [key: number]: boolean };
  
  // publisher/category state
  followedOutlets?: { [key: string]: boolean };
  followedPublishers?: { [key: string]: boolean };
  followedCategories?: { [key: string]: boolean };

  followCount: number;
  followFilter: string;

  excludedOutlets?: { [key: string]: boolean };
  excludedPublishers?: { [key: string]: boolean };
  excludedCategories?: { [key: string]: boolean };
};

export const DEFAULT_PREFERENCES: Partial<Preferences> = { loadedInitialUrl: false };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FunctionWithRequestParams<T extends any[], R> = ((...args: [...T, RequestParams]) => R);

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
  
  // convenience functions
  bookmarkSummary: (summary: PublicSummaryAttributesConservative) => Promise<void>;
  readSummary: (summary: PublicSummaryAttributesConservative) => Promise<void>;
  readSource: (summary: PublicSummaryAttributesConservative) => Promise<void>;
  removeSummary: (summary: PublicSummaryAttributesConservative) => Promise<void>;
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
  readSource: () => Promise.resolve(),
  readSummary: () => Promise.resolve(),
  removeSummary: () => Promise.resolve(),
  resetPreferences: () => Promise.resolve(),
  setCategories: () => Promise.resolve(),
  setPreference: () => Promise.resolve(),
  setPublishers: () => Promise.resolve(),
  unreadBookmarkCount: 0,
  withHeaders: (fn) => (...args) => fn(...args, {}),
};