import {
  InteractionType,
  PublicCategoryAttributes,
  PublicOutletAttributes,
  PublicSummaryAttributes,
  ReadingFormat,
  RequestParams,
} from '~/api';

export type ColorMode = 'light' | 'dark';

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

export type Preferences = {
  displayMode?: ColorMode;
  alwaysShowReadingFormatSelector?: boolean;
  preferredReadingFormat?: ReadingFormat;
  compactMode?: boolean;
  textScale?: number;
  fontFamily?: string;
  letterSpacing?: number;
  sortOrder?: string[];
  searchHistory?: string[];
  searchCanMatchAny?: boolean;
  showShortSummary?: boolean;
  loadedInitialUrl?: boolean;
  bookmarkedSummaries?: { [key: number]: Bookmark<PublicSummaryAttributes> };
  favoritedSummaries?: { [key: number]: Bookmark<boolean> };
  bookmarkedOutlets?: { [key: string]: Bookmark<PublicOutletAttributes> };
  bookmarkedCategories?: { [key: string]: Bookmark<PublicCategoryAttributes> };
  excludedOutlets?: { [key: string]: Bookmark<boolean> };
  excludedCategories?: { [key: string]: Bookmark<boolean> };
  removedSummaries?: { [key: number]: Bookmark<boolean> };
  readSummaries?: { [key: number]: Bookmark<boolean> };
  readSources?: { [key: number]: Bookmark<boolean> };
  summaryHistory?: { [key: number]: Bookmark<InteractionType> };
  showOnlyCustomNews?: boolean;
};

export const DEFAULT_PREFERENCES: Partial<Preferences> = { fontFamily: 'Faustina' };

export const OVERRIDDEN_INITIAL_PREFERENCES: Partial<Preferences> = { loadedInitialUrl: false };

// Headers

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type FunctionWithRequestParams<T extends any[], R> = ((...args: [...T, RequestParams]) => R);

// Context

export type SessionSetOptions = {
  updateCookie?: boolean;
};

export type SessionContextType = {
  ready?: boolean;
  displayMode?: ColorMode;
  alwaysShowReadingFormatSelector?: boolean;
  preferredReadingFormat?: ReadingFormat;
  compactMode?: boolean;
  textScale?: number;
  fontFamily?: string;
  letterSpacing?: number;
  searchHistory?: string[];
  showShortSummary?: boolean;
  loadedInitialUrl?: boolean;
  bookmarkedSummaries?: { [key: number]: Bookmark<PublicSummaryAttributes> };
  bookmarkedOutlets?: { [key: string]: Bookmark<PublicOutletAttributes> };
  bookmarkedCategories?: { [key: string]: Bookmark<PublicCategoryAttributes> };
  excludedOutlets?: { [key: string]: Bookmark<boolean> };
  excludedCategories?: { [key: string]: Bookmark<boolean> };
  removedSummaries?: { [key: number]: Bookmark<boolean> };
  readSummaries?: { [key: number]: Bookmark<boolean> };
  readSources?: { [key: number]: Bookmark<boolean> };
  showOnlyCustomNews?: boolean;
  // state setters
  setPreference<K extends keyof Preferences>(key: K, value?: Preferences[K] | ((value?: Preferences[K]) => Preferences[K])): void;
  // convenience functions
  followOutlet: (outlet: PublicOutletAttributes) => void;
  followCategory: (category: PublicCategoryAttributes) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  withHeaders: <T extends any[], R>(fn: FunctionWithRequestParams<T, R>) => ((...args: T) => R);
};

export const DEFAULT_SESSION_CONTEXT: SessionContextType = {
  followCategory: () => {
    /* placeholder function */
  },
  followOutlet: () => {
    /* placeholder function */
  },
  setPreference: () => {
    /* placeholder function */
  },
  withHeaders: (fn) => (...args) => fn(...args, {}),
};