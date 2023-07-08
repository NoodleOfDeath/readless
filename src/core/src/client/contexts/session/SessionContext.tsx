import React from 'react';

import {
  Bookmark,
  ColorScheme,
  DEFAULT_PREFERENCES,
  DEFAULT_SESSION_CONTEXT,
  FunctionWithRequestParams,
  OrientationType,
  Preferences,
} from './types';

import {
  PublicCategoryAttributes,
  PublicPublisherAttributes,
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

  const [categories, setCategories] = React.useState<Record<string, PublicCategoryAttributes>>();
  const [publishers, setPublishers] = React.useState<Record<string, PublicPublisherAttributes>>();

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
  const [hasReviewed, setHasReviewed] = React.useState<boolean>();
  const [lastRequestForReview, setLastRequestForReview] = React.useState(0);
  
  const [bookmarkedSummaries, setBookmarkedSummaries] = React.useState<{ [key: number]: Bookmark<PublicSummaryGroup> }>();
  const [readSummaries, setReadSummaries] = React.useState<{ [key: number]: Bookmark<boolean> }>();
  const [readSources, setReadSources] = React.useState<{ [key: number]: Bookmark<boolean> }>();
  const [removedSummaries, setRemovedSummaries] = React.useState<{ [key: number]: boolean }>();
  
  const [followedPublishers, setFollowedPublishers] = React.useState<{ [key: string]: boolean }>();
  const [excludedPublishers, setExcludedPublishers] = React.useState<{ [key: string]: boolean }>();
  const [followedCategories, setFollowedCategories] = React.useState<{ [key: string]: boolean }>();
  const [excludedCategories, setExcludedCategories] = React.useState<{ [key: string]: boolean }>();

  const followCount = React.useMemo(() => Object.keys({ ...followedPublishers }).length + Object.keys({ ...followedCategories }).length, [followedPublishers, followedCategories]);

  const followFilter = React.useMemo(() => {
    const filters: string[] = [];
    if (Object.keys({ ...followedCategories }).length > 0) {
      filters.push(['cat', Object.keys({ ...followedCategories }).join(',')].join(':'));
    }
    if (Object.keys({ ...followedPublishers }).length > 0) {
      filters.push(['src', Object.keys({ ...followedPublishers }).join(',')].join(':'));
    }
    return filters.join(' ');
  }, [followedCategories, followedPublishers]);
  
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
    case 'hasReviewed':
      setHasReviewed(value);
      break;
    case 'lastRequestForReview':
      setLastRequestForReview(value);
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
    case 'followedPublishers':
      setFollowedPublishers(newValue);
      break;
    case 'excludedOutlets':
    case 'excludedPublishers':
      setExcludedPublishers(newValue);
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

  const followPublisher = async (publisher: PublicPublisherAttributes) => {
    await setPreference('followedPublishers', (prev) => {
      const state = { ...prev };
      if (publisher.name in state) {
        delete state[publisher.name];
      } else {
        state[publisher.name] = true;
      }
      return (prev = state);
    });
  };
  
  const excludePublisher = async (publisher: PublicPublisherAttributes) => {
    await setPreference('excludedPublishers', (prev) => {
      const state = { ...prev };
      if (publisher.name in state) {
        delete state[publisher.name];
      } else {
        state[publisher.name] = true;
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
    setFontFamily(await getPreference('fontFamily'));
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
    setLoadedInitialUrl(DEFAULT_PREFERENCES.loadedInitialUrl);
    setRotationLock(await getPreference('rotationLock'));
    setSearchHistory(await getPreference('searchHistory'));
    setShowOnlyCustomNews(await getPreference('showOnlyCustomNews'));
    setViewedFeatures(await getPreference('viewedFeatures'));
    setHasReviewed(await getPreference('hasReviewed'));
    setLastRequestForReview(await getPreference('lastRequestForReview'));
    
    // summary state
    setBookmarkedSummaries(await getPreference('bookmarkedSummaries'));
    setReadSummaries(await getPreference('readSummaries'));
    setReadSources(await getPreference('readSources'));
    setRemovedSummaries(await getPreference('removedSummaries'));
    
    // publisher/category statet
    setFollowedPublishers(await getPreference('followedOutlets') ?? await getPreference('followedPublishers'));
    setFollowedCategories(await getPreference('followedCategories'));
    setExcludedPublishers(await getPreference('excludedOutlets') ?? await getPreference('excludedPublishers'));
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
        categories,
        colorScheme,
        compactMode,
        excludeCategory,
        excludePublisher,
        excludedCategories,
        excludedPublishers,
        followCategory,
        followCount,
        followFilter,
        followPublisher,
        followedCategories,
        followedPublishers,
        fontFamily,
        fontSizeOffset,
        getPreference,
        hasReviewed,
        lastRequestForReview,
        letterSpacing,
        lineHeightMultiplier,
        loadedInitialUrl,
        preferredReadingFormat,
        publishers,
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
        setCategories,
        setPreference,
        setPublishers,
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
