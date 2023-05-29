import React from 'react';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { decode } from 'js-base64';

import {
  Bookmark,
  ColorMode,
  DEFAULT_PREFERENCES,
  DEFAULT_SESSION_CONTEXT,
  FunctionWithRequestParams,
  OVERRIDDEN_INITIAL_PREFERENCES,
  Preferences,
} from './types';

import {
  PublicCategoryAttributes,
  PublicOutletAttributes,
  PublicSummaryAttributes,
  ReadingFormat,
} from '~/api';
import {
  getLocale,
  getUserAgent,
  lengthOf,
} from '~/utils';

type Props = React.PropsWithChildren;

export const SessionContext = React.createContext(DEFAULT_SESSION_CONTEXT);

export function SessionContextProvider({ children }: Props) {

  const [ready, setReady] = React.useState(false);

  const [displayMode, setDisplayMode] = React.useState<ColorMode>();
  const [alwaysShowReadingFormatSelector, setAlwaysShowReadingFormatSelector] = React.useState<boolean>();
  const [preferredReadingFormat, setPreferredReadingFormat] = React.useState<ReadingFormat>();
  const [compactMode, setCompactMode] = React.useState<boolean>();
  const [textScale, setTextScale] = React.useState<number>();
  const [fontFamily, setFontFamily] = React.useState<string>();
  const [letterSpacing, setLetterSpacing] = React.useState<number>();
  const [searchHistory, setSearchHistory] = React.useState<string[]>();
  const [showShortSummary, setShowShortSummary] = React.useState<boolean>();
  const [loadedInitialUrl, setLoadedInitialUrl] = React.useState<boolean>();
  const [bookmarkedSummaries, setBookmarkedSummaries] = React.useState<{ [key: number]: Bookmark<PublicSummaryAttributes> }>();
  const [bookmarkedOutlets, setBookmarkedOutlets] = React.useState<{ [key: string]: Bookmark<PublicOutletAttributes> }>();
  const [bookmarkedCategories, setBookmarkedCategories] = React.useState<{ [key: string]: Bookmark<PublicCategoryAttributes> }>();
  const [excludedOutlets, setExcludedOutlets] = React.useState<{ [key: string]: Bookmark<boolean> }>();
  const [excludedCategories, setExcludedCategories] = React.useState<{ [key: string]: Bookmark<boolean> }>();
  const [removedSummaries, setRemovedSummaries] = React.useState<{ [key: number]: Bookmark<boolean> }>();
  const [readSummaries, setReadSummaries] = React.useState<{ [key: number]: Bookmark<boolean> }>();
  const [readSources, setReadSources] = React.useState<{ [key: number]: Bookmark<boolean> }>();
  const [showOnlyCustomNews, setShowOnlyCustomNews] = React.useState<boolean>();

  const getPreference = React.useCallback(async <K extends keyof Preferences>(key: K): Promise<Preferences[K] | undefined> => {
    const value = await AsyncStorage.getItem(key);
    if (value) {
      return JSON.parse(value) as Preferences[K];
    }
    return undefined;
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const setPreference = React.useCallback(async (key: keyof Preferences, value: any) => {
    value = value instanceof Function ? value(await getPreference(key)) : value;
    switch (key) {
    case 'displayMode':
      setDisplayMode(value);
      break;
    case 'alwaysShowReadingFormatSelector':
      setAlwaysShowReadingFormatSelector(value);
      break;
    case 'preferredReadingFormat':
      setPreferredReadingFormat(value);
      break;
    case 'compactMode':
      setCompactMode(value);
      break;
    case 'textScale':
      setTextScale(value);
      break;
    case 'fontFamily':
      setFontFamily(value);
      break;
    case 'letterSpacing':
      setLetterSpacing(value);
      break;
    case 'searchHistory':
      setSearchHistory(value);
      break;
    case 'showShortSummary':
      setShowShortSummary(value);
      break;
    case 'loadedInitialUrl':
      setLoadedInitialUrl(value);
      break;
    case 'bookmarkedSummaries':
      setBookmarkedSummaries(value);
      break;
    case 'bookmarkedOutlets':
      setBookmarkedOutlets(value);
      break;
    case 'bookmarkedCategories':
      setBookmarkedCategories(value);
      break;
    case 'excludedOutlets':
      setExcludedOutlets(value);
      break;
    case 'excludedCategories':
      setExcludedCategories(value);
      break;
    case 'removedSummaries':
      setRemovedSummaries(value);
      break;
    case 'readSummaries':
      setReadSummaries(value);
      break;
    case 'readSources':
      setReadSources(value);
      break;
    case 'showOnlyCustomNews':
      setShowOnlyCustomNews(value);
      break;
    default:
      break;
    }
    await AsyncStorage.setItem(key, JSON.stringify(value));
  }, [getPreference]);

  const followOutlet = React.useCallback((outlet: PublicOutletAttributes) => {
    setBookmarkedOutlets((prev) => {
      const state = { ...prev };
      if (state[outlet.name]) {
        delete state[outlet.name];
      } else {
        state[outlet.name] = new Bookmark(outlet);
      }
      if (lengthOf(bookmarkedCategories, state) > 0) {
        setShowOnlyCustomNews(true);
      }
      return (prev = state);
    });
  }, [bookmarkedCategories]);

  const followCategory = React.useCallback((category: PublicCategoryAttributes) => {
    setBookmarkedCategories((prev) => {
      const state = { ...prev };
      if (state[category.name]) {
        delete state[category.name];
      } else {
        state[category.name] = new Bookmark(category);
      }
      if (lengthOf(bookmarkedOutlets, state) > 0) {
        setShowOnlyCustomNews(true);
      }
      return (prev = state);
    });
  }, [bookmarkedOutlets]);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const withHeaders = React.useCallback(<T extends any[], R>(fn: FunctionWithRequestParams<T, R>): ((...args: T) => R) => {
    const headers: RequestInit['headers'] = { 
      'X-App-Version': getUserAgent().currentVersion,
      'X-Locale': getLocale(),
    };
    return (...args: T) => {
      return fn(...args, { headers });
    };
  }, []);

  // Load preferences on mount
  const load = React.useCallback(async () => {
    const rawPrefs = await AsyncStorage.getItem('preferences');
    let prefs: Preferences;
    try {
      prefs = { ...JSON.parse(decode(rawPrefs)), ...OVERRIDDEN_INITIAL_PREFERENCES };
    } catch (e) {
      console.error(e);
      try {
        prefs = { ...JSON.parse(rawPrefs), ...OVERRIDDEN_INITIAL_PREFERENCES };
      } catch (e) {
        console.error(e);
        prefs = { ...DEFAULT_PREFERENCES, ...OVERRIDDEN_INITIAL_PREFERENCES };
      }
    }
    setDisplayMode(prefs.displayMode ?? await getPreference('displayMode')); 
    setAlwaysShowReadingFormatSelector(prefs.alwaysShowReadingFormatSelector ?? await getPreference('alwaysShowReadingFormatSelector'));
    setPreferredReadingFormat(prefs.preferredReadingFormat ?? await getPreference('preferredReadingFormat'));
    setCompactMode(prefs.compactMode ?? await getPreference('compactMode'));
    setTextScale(prefs.textScale ?? await getPreference('textScale'));
    setFontFamily(prefs.fontFamily ?? await getPreference('fontFamily'));
    setLetterSpacing(prefs.letterSpacing ?? await getPreference('letterSpacing'));
    setSearchHistory(prefs.searchHistory ?? await getPreference('searchHistory'));
    setShowShortSummary(prefs.showShortSummary ?? await getPreference('showShortSummary'));
    setLoadedInitialUrl(prefs.loadedInitialUrl ?? await getPreference('loadedInitialUrl'));
    setBookmarkedSummaries(prefs.bookmarkedSummaries ?? await getPreference('bookmarkedSummaries'));
    setBookmarkedOutlets(prefs.bookmarkedOutlets ?? await getPreference('bookmarkedOutlets'));
    setBookmarkedCategories(prefs.bookmarkedCategories ?? await getPreference('bookmarkedCategories'));
    setExcludedOutlets(prefs.excludedOutlets ?? await getPreference('excludedOutlets'));
    setExcludedCategories(prefs.excludedCategories ?? await getPreference('excludedCategories'));
    setRemovedSummaries(prefs.removedSummaries ?? await getPreference('removedSummaries'));
    setReadSummaries(prefs.readSummaries ?? await getPreference('readSummaries'));
    setReadSources(prefs.readSources ?? await getPreference('readSources'));
    setShowOnlyCustomNews(prefs.showOnlyCustomNews ?? await getPreference('showOnlyCustomNews'));
    setReady(true);
  }, [getPreference]);

  React.useEffect(() => {
    load();
  }, [load]);

  return (
    <SessionContext.Provider
      value={ {
        alwaysShowReadingFormatSelector,
        bookmarkedCategories,
        bookmarkedOutlets,
        bookmarkedSummaries,
        compactMode,
        displayMode,
        excludedCategories,
        excludedOutlets,
        followCategory,
        followOutlet,
        fontFamily,
        letterSpacing,
        loadedInitialUrl,
        preferredReadingFormat,
        readSources,
        readSummaries,
        ready,
        removedSummaries,
        searchHistory,
        setPreference,
        showOnlyCustomNews,
        showShortSummary,
        textScale,
        withHeaders,
      } }>
      {children}
    </SessionContext.Provider>
  );
}
