import React from 'react';

import {
  Bookmark,
  ColorScheme,
  DEFAULT_PREFERENCES,
  DEFAULT_SESSION_CONTEXT,
  FunctionWithRequestParams,
  OVERRIDDEN_INITIAL_PREFERENCES,
  OrientationType,
  Preferences,
} from './types';

import {
  PublicCategoryAttributes,
  PublicOutletAttributes,
  PublicSummaryGroup,
  ReadingFormat,
} from '~/api';
import {
  getItem,
  getUserAgent,
  removeAll,
  removeItem,
  setItem,
} from '~/utils';

export const SessionContext = React.createContext(DEFAULT_SESSION_CONTEXT);

export function SessionContextProvider({ children }: React.PropsWithChildren) { 

  const [ready, setReady] = React.useState(false);

  const [colorScheme, setColorScheme] = React.useState<ColorScheme>();
  const [fontFamily, setFontFamily] = React.useState<string>();
  const [fontSizeOffset, setFontSizeOffset] = React.useState<number>();
  const [letterSpacing, setLetterSpacing] = React.useState<number>();
  const [lineHeightMultiplier, setLineHeightMultiplier] = React.useState<number>();
  
  const [compactMode, setCompactMode] = React.useState<boolean>();
  const [showShortSummary, setShowShortSummary] = React.useState<boolean>();
  const [preferredReadingFormat, setPreferredReadingFormat] = React.useState<ReadingFormat>();
  const [sourceLinks, setSourceLinks] = React.useState<boolean>();
  const [sentimentEnabled, setSentimentEnabled] = React.useState<boolean>();
  const [triggerWords, setTriggerWords] = React.useState<{ [key: string]: string}>();
  
  const [loadedInitialUrl, setLoadedInitialUrl] = React.useState<boolean>();
  const [rotationLock, setRotationLock] = React.useState<OrientationType>();
  const [searchHistory, setSearchHistory] = React.useState<string[]>();
  const [showOnlyCustomNews, setShowOnlyCustomNews] = React.useState<boolean>();
  const [viewedFeatures, setViewedFeatures] = React.useState<{ [key: string]: Bookmark<boolean>}>();
  
  const [bookmarkedSummaries, setBookmarkedSummaries] = React.useState<{ [key: number]: Bookmark<PublicSummaryGroup> }>();
  const [readSummaries, setReadSummaries] = React.useState<{ [key: number]: Bookmark<boolean> }>();
  const [readSources, setReadSources] = React.useState<{ [key: number]: Bookmark<boolean> }>();
  const [removedSummaries, setRemovedSummaries] = React.useState<{ [key: number]: boolean }>();
  
  const [followedOutlets, setFollowedOutlets] = React.useState<{ [key: string]: boolean }>();
  const [excludedOutlets, setExcludedOutlets] = React.useState<{ [key: string]: boolean }>();
  const [followedCategories, setFollowedCategories] = React.useState<{ [key: string]: boolean }>();
  const [excludedCategories, setExcludedCategories] = React.useState<{ [key: string]: boolean }>();
  
  const bookmarkCount = React.useMemo(() => Object.keys({ ...bookmarkedSummaries }).length, [bookmarkedSummaries]);
  const unreadBookmarkCount = React.useMemo(() => Object.keys({ ...bookmarkedSummaries }).filter((k) => !(k in ({ ...readSummaries }))).length, [bookmarkedSummaries, readSummaries]);

  const getPreference = async <K extends keyof Preferences>(key: K): Promise<Preferences[K] | undefined> => {
    const value = await getItem(key);
    if (value) {
      try {
        return JSON.parse(value) as Preferences[K];
      } catch (e) {
        return undefined;
      }
    }
    return undefined;
  };

  const setPreference = async <K extends keyof Preferences>(key: K, value?: Preferences[K] | ((value?: Preferences[K]) => (Preferences[K] | undefined))) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newValue = (value instanceof Function ? value(await getPreference(key)) : value) as any;
    switch (key) {
      
    case 'colorScheme':
      setColorScheme(newValue);
      break;
    case 'fontFamily':
      setFontFamily(newValue);
      break;
    case 'fontSizeOffset':
      setFontSizeOffset(newValue);
      break;
    case 'letterSpacing':
      setLetterSpacing(newValue);
      break;
    case 'lineHeightMultiplier':
      setLineHeightMultiplier(newValue);
      break;
      
    case 'compactMode':
      setCompactMode(newValue);
      break;
    case 'showShortSummary':
      setShowShortSummary(newValue);
      break;
    case 'preferredReadingFormat':
      setPreferredReadingFormat(newValue);
      break;
    case 'sourceLinks':
      setSourceLinks(newValue);
      break;
    case 'sentimentEnabled':
      setSentimentEnabled(newValue);
      break;
    case 'triggerWords':
      setTriggerWords(newValue);
      break;
    
    case 'loadedInitialUrl':
      setLoadedInitialUrl(newValue);
      break;
    case 'rotationLock':
      setRotationLock(newValue);
      break;
    case 'searchHistory':
      setSearchHistory(newValue);
      break;
    case 'showOnlyCustomNews':
      setShowOnlyCustomNews(newValue);
      break;
    case 'viewedFeatures':
      setViewedFeatures(newValue);
      break;
      
    case 'bookmarkedSummaries':
      setBookmarkedSummaries(newValue);
      break;
    case 'readSummaries':
      setReadSummaries(newValue);
      break;
    case 'readSources':
      setReadSources(newValue);
      break;
    case 'removedSummaries':
      setRemovedSummaries(newValue);
      break;
      
    case 'followedOutlets':
      setFollowedOutlets(newValue);
      break;
    case 'excludedOutlets':
      setExcludedOutlets(newValue);
      break;
    case 'followedCategories':
      setFollowedCategories(newValue);
      break;
    case 'excludedCategories':
      setExcludedCategories(newValue);
      break;
      
    default:
      break;
    }
    if (newValue == null) {
      await removeItem(key);
    } else {
      await setItem(key, JSON.stringify(newValue));
    }
  };
  
  const bookmarkSummary = async (summary: PublicSummaryGroup) => {
    await setPreference('bookmarkedSummaries', (prev) => {
      const state = { ...prev };
      if (summary.id in state) {
        delete state[summary.id];
      } else {
        state[summary.id] = new Bookmark(summary);
      }
      return (prev = state);
    });
  };
  
  const readSummary = async (summary: PublicSummaryGroup) => {
    await setPreference('readSummaries', (prev) => {
      const state = { ...prev };
      if (summary.id in state) {
        delete state[summary.id];
      } else {
        state[summary.id] = new Bookmark(true);
      }
      return (prev = state);
    });
  };
  
  const readSource = async (summary: PublicSummaryGroup) => {
    await setPreference('readSources', (prev) => {
      const state = { ...prev };
      if (summary.id in state) {
        delete state[summary.id];
      } else {
        state[summary.id] = new Bookmark(true);
      }
      return (prev = state);
    });
  };
  
  const removeSummary = async (summary: PublicSummaryGroup) => {
    await setPreference('removedSummaries', (prev) => {
      const state = { ...prev };
      if (summary.id in state) {
        delete state[summary.id];
      } else {
        state[summary.id] = true;
      }
      return (prev = state);
    });
  };

  const followOutlet = async (outlet: PublicOutletAttributes) => {
    await setPreference('followedOutlets', (prev) => {
      const state = { ...prev };
      if (outlet.name in state) {
        delete state[outlet.name];
      } else {
        state[outlet.name] = true;
      }
      return (prev = state);
    });
  };
  
  const excludeOutlet = async (outlet: PublicOutletAttributes) => {
    await setPreference('excludedOutlets', (prev) => {
      const state = { ...prev };
      if (outlet.name in state) {
        delete state[outlet.name];
      } else {
        state[outlet.name] = true;
      }
      return (prev = state);
    });
  };

  const followCategory = async (category: PublicCategoryAttributes) => {
    await setPreference('followedCategories', (prev) => {
      const state = { ...prev };
      if (category.name in state) {
        delete state[category.name];
      } else {
        state[category.name] = true;
      }
      return (prev = state);
    });
  };
  
  const excludeCategory = async (category: PublicCategoryAttributes) => {
    await setPreference('excludedCategories', (prev) => {
      const state = { ...prev };
      if (category.name in state) {
        delete state[category.name];
      } else {
        state[category.name] = true;
      }
      return (prev = state);
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const withHeaders = <T extends any[], R>(fn: FunctionWithRequestParams<T, R>): ((...args: T) => R) => {
    const userAgent = getUserAgent();
    const headers: RequestInit['headers'] = { 
      'X-App-Version': userAgent.currentVersion,
      'X-Locale': userAgent.locale,
      'X-Platform': userAgent.OS,
    };
    return (...args: T) => {
      return fn(...args, { headers });
    };
  };

  // Load preferences on mount
  const load = async () => {
    // system
    setColorScheme(await getPreference('colorScheme')); 
    setFontFamily(await getPreference('fontFamily') ?? DEFAULT_PREFERENCES.fontFamily);
    setFontSizeOffset(await getPreference('fontSizeOffset'));
    setLetterSpacing(await getPreference('letterSpacing'));
    setLineHeightMultiplier(await getPreference('lineHeightMultiplier'));
    
    // summary display
    setCompactMode(await getPreference('compactMode'));
    setShowShortSummary(await getPreference('showShortSummary'));
    setPreferredReadingFormat(await getPreference('preferredReadingFormat'));
    setSourceLinks(await getPreference('sourceLinks'));
    setSentimentEnabled(await getPreference('sentimentEnabled'));
    setTriggerWords(await getPreference('triggerWords'));
    
    // app state
    setLoadedInitialUrl(OVERRIDDEN_INITIAL_PREFERENCES.loadedInitialUrl);
    setRotationLock(await getPreference('rotationLock'));
    setSearchHistory(await getPreference('searchHistory'));
    setShowOnlyCustomNews(await getPreference('showOnlyCustomNews'));
    setViewedFeatures(await getPreference('viewedFeatures'));
    
    // summary state
    setBookmarkedSummaries(await getPreference('bookmarkedSummaries'));
    setReadSummaries(await getPreference('readSummaries'));
    setReadSources(await getPreference('readSources'));
    setRemovedSummaries(await getPreference('removedSummaries'));
    
    // outlet/category statet
    setFollowedOutlets(await getPreference('followedOutlets'));
    setFollowedCategories(await getPreference('followedCategories'));
    setExcludedOutlets(await getPreference('excludedOutlets'));
    setExcludedCategories(await getPreference('excludedCategories'));
    
    setReady(true);
  };

  React.useEffect(() => {
    load();
  }, []);
  
  const resetPreferences = async (hard = false) => {
    await removeAll(hard);
    load();
  };

  return (
    <SessionContext.Provider
      value={ {
        bookmarkCount,
        bookmarkSummary,
        bookmarkedSummaries,
        colorScheme,
        compactMode,
        excludeCategory,
        excludeOutlet,
        excludedCategories,
        excludedOutlets,
        followCategory,
        followOutlet,
        followedCategories,
        followedOutlets,
        fontFamily,
        fontSizeOffset,
        getPreference,
        letterSpacing,
        lineHeightMultiplier,
        loadedInitialUrl,
        preferredReadingFormat,
        readSource,
        readSources,
        readSummaries,
        readSummary,
        ready,
        removeSummary,
        removedSummaries,
        resetPreferences,
        rotationLock,
        searchHistory,
        sentimentEnabled,
        setPreference,
        showOnlyCustomNews,
        showShortSummary,
        sourceLinks,
        triggerWords,
        unreadBookmarkCount,
        viewedFeatures,
        withHeaders,
      } }>
      {children}
    </SessionContext.Provider>
  );
}
