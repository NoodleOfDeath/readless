import {
  PublicCategoryAttributes,
  PublicOutletAttributes,
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
  
  // sunmary state
  readSummaries?: { [key: number]: Bookmark<boolean> };
  readSources?: { [key: number]: Bookmark<boolean> };
  bookmarkedSummaries?: { [key: number]: Bookmark<PublicSummaryGroup> };
  bookmarkCount: number;
  unreadBookmarkCount: number;
  removedSummaries?: { [key: number]: boolean };
  
  // outlet/category state
  followedOutlets?: { [key: string]: boolean };
  followedCategories?: { [key: string]: boolean };
  excludedOutlets?: { [key: string]: boolean };
  excludedCategories?: { [key: string]: boolean };
};

export const DEFAULT_PREFERENCES: Partial<Preferences> = { fontFamily: 'Faustina' };

export const OVERRIDDEN_INITIAL_PREFERENCES: Partial<Preferences> = { loadedInitialUrl: false };

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FunctionWithRequestParams<T extends any[], R> = ((...args: [...T, RequestParams]) => R);

export type SessionContextType = Preferences & {
  ready?: boolean;
  
  // state setters
  setPreference: <K extends keyof Preferences>(key: K, value?: Preferences[K] | ((value?: Preferences[K]) => Preferences[K])) => Promise<void>;
  getPreference: <K extends keyof Preferences>(key: K) => Promise<Preferences[K] | undefined>;
  resetPreferences: (hard?: boolean) => Promise<void>;
  
  // convenience functions
  bookmarkSummary: (summary: PublicSummaryGroup) => Promise<void>;
  readSummary: (summary: PublicSummaryGroup) => Promise<void>;
  readSource: (summary: PublicSummaryGroup) => Promise<void>;
  removeSummary: (summary: PublicSummaryGroup) => Promise<void>;
  followOutlet: (outlet: PublicOutletAttributes) => Promise<void>;
  excludeOutlet: (outlet: PublicOutletAttributes) => Promise<void>;
  followCategory: (category: PublicCategoryAttributes) => Promise<void>;
  excludeCategory: (category: PublicCategoryAttributes) => Promise<void>;
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  withHeaders: <T extends any[], R>(fn: FunctionWithRequestParams<T, R>) => ((...args: T) => R);
};

export const DEFAULT_SESSION_CONTEXT: SessionContextType = {
  bookmarkCount: 0,
  bookmarkSummary: () => Promise.resolve(),
  excludeCategory: () => Promise.resolve(),
  excludeOutlet: () => Promise.resolve(),
  followCategory: () => Promise.resolve(),
  followOutlet: () => Promise.resolve(),
  getPreference: () => Promise.resolve(undefined),
  readSource: () => Promise.resolve(),
  readSummary: () => Promise.resolve(),
  removeSummary: () => Promise.resolve(),
  resetPreferences: () => Promise.resolve(),
  setPreference: () => Promise.resolve(),
  unreadBookmarkCount: 0,
  withHeaders: (fn) => (...args) => fn(...args, {}),
};