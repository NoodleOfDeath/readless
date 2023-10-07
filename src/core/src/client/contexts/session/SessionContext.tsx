import React from 'react';

import {
  Bookmark,
  ColorScheme,
  DEFAULT_SESSION_CONTEXT,
  FunctionWithRequestParams,
  OrientationType,
  PREFERENCE_TYPES,
  Preferences,
  PushNotificationSettings,
} from './types';

import {
  PublicCategoryAttributes,
  PublicPublisherAttributes,
  PublicSummaryGroup,
  ReadingFormat,
  RecapAttributes,
} from '~/api';
import { Locale, getLocale } from '~/locales';
import { useLocalStorage, usePlatformTools } from '~/utils';

export const SessionContext = React.createContext(DEFAULT_SESSION_CONTEXT);

export function SessionContextProvider({ children }: React.PropsWithChildren) { 

  const {
    getItem, removeItem, removeAll, setItem, 
  } = useLocalStorage();
  const { emitEvent, getUserAgent } = usePlatformTools();
  
  // system state
  const [ready, setReady] = React.useState(false);

  const [latestVersion, setLatestVersion] = React.useState<string>();
  const [rotationLock, setRotationLock] = React.useState<OrientationType>();
  const [searchHistory, setSearchHistory] = React.useState<string[]>();
  const [viewedFeatures, setViewedFeatures] = React.useState<{ [key: string]: Bookmark<boolean>}>();
  const [hasReviewed, setHasReviewed] = React.useState<boolean>();
  const [lastRequestForReview, setLastRequestForReview] = React.useState(0);
  const [categories, setCategories] = React.useState<Record<string, PublicCategoryAttributes>>();
  const [publishers, setPublishers] = React.useState<Record<string, PublicPublisherAttributes>>();
  const [loadedInitialUrl, setLoadedInitialUrl] = React.useState(false);
  
  // user state
  const [uuid, setUuid] = React.useState<string>();
  const [pushNotificationsEnabled, setPushNotificationsEnabled] = React.useState<boolean>();
  const [pushNotifications, setPushNotifications] = React.useState<{[key: string]: PushNotificationSettings}>();
  const [fcmToken, setFcmToken] = React.useState<string>();
  
  // summary state
  const [bookmarkedSummaries, setBookmarkedSummaries] = React.useState<{ [key: number]: Bookmark<PublicSummaryGroup> }>();
  const [readSummaries, setReadSummaries] = React.useState<{ [key: number]: Bookmark<boolean> }>();
  const [removedSummaries, setRemovedSummaries] = React.useState<{ [key: number]: boolean }>();
  const [locale, setLocale] = React.useState<Locale>();
  const [summaryTranslations, setSummaryTranslations] = React.useState<{ [key: number]: { [key in keyof PublicSummaryGroup]?: string } }>();
  
  // bookmark state
  const bookmarkCount = React.useMemo(() => Object.keys({ ...bookmarkedSummaries }).length, [bookmarkedSummaries]);
  const unreadBookmarkCount = React.useMemo(() => Object.keys({ ...bookmarkedSummaries }).filter((k) => !(k in ({ ...readSummaries }))).length, [bookmarkedSummaries, readSummaries]);
  
  // recap state
  const [readRecaps, setReadRecaps] = React.useState<{ [key: number]: boolean }>();
  const [recapTranslations, setRecapTranslations] = React.useState<{ [key: number]: { [key in keyof RecapAttributes]?: string } }>();
  
  // publisher state
  const [followedPublishers, setFollowedPublishers] = React.useState<{ [key: string]: boolean }>();
  const [favoritedPublishers, setFavoritedPublishers] = React.useState<{ [key: string]: boolean }>();
  const [excludedPublishers, setExcludedPublishers] = React.useState<{ [key: string]: boolean }>();
  
  // category state
  const [followedCategories, setFollowedCategories] = React.useState<{ [key: string]: boolean }>();
  const [favoritedCategories, setFavoritedCategories] = React.useState<{ [key: string]: boolean }>();
  const [excludedCategories, setExcludedCategories] = React.useState<{ [key: string]: boolean }>();

  // following computed state
  const followCount = React.useMemo(() => Object.keys({ ...followedPublishers }).length + Object.keys({ ...followedCategories }).length, [followedPublishers, followedCategories]);

  const followFilter = React.useMemo(() => {
    const filters: string[] = [];
    if (Object.keys({ ...followedPublishers }).length > 0) {
      filters.push(['pub', Object.keys({ ...followedPublishers }).join(',')].join(':'));
    }
    if (Object.keys({ ...excludedPublishers }).length > 0) {
      filters.push(['-pub', Object.keys({ ...excludedPublishers }).join(',')].join(':'));
    }
    if (Object.keys({ ...followedCategories }).length > 0) {
      filters.push(['cat', Object.keys({ ...followedCategories }).join(',')].join(':'));
    }
    return filters.join(' ');
  }, [followedPublishers, excludedPublishers, followedCategories]);
  
  const excludeFilter = React.useMemo(() => {
    const filters: string[] = [];
    if (Object.keys({ ...excludedPublishers }).length > 0) {
      filters.push(['-pub', Object.keys({ ...excludedPublishers }).join(',')].join(':'));
    }
    if (Object.keys({ ...excludedCategories }).length > 0) {
      filters.push(['-cat', Object.keys({ ...excludedCategories }).join(',')].join(':'));
    }
    return filters.join(' ');
  }, [excludedPublishers, excludedCategories]);
  
  // system preferences
  const [colorScheme, setColorScheme] = React.useState<ColorScheme>();
  const [fontFamily, setFontFamily] = React.useState<string>();
  const [fontSizeOffset, setFontSizeOffset] = React.useState<number>();
  const [letterSpacing, setLetterSpacing] = React.useState<number>();
  const [lineHeightMultiplier, setLineHeightMultiplier] = React.useState<number>();
  
  // summary preferences
  const [compactSummaries, setCompactSummaries] = React.useState<boolean>();
  const [showShortSummary, setShowShortSummary] = React.useState<boolean>();
  const [preferredShortPressFormat, setPreferredShortPressFormat] = React.useState<ReadingFormat>();
  const [preferredReadingFormat, setPreferredReadingFormat] = React.useState<ReadingFormat>();
  const [sentimentEnabled, setSentimentEnabled] = React.useState<boolean>();
  const [triggerWords, setTriggerWords] = React.useState<{ [key: string]: string}>();
  
  // system functions
  
  const getPreference = async <K extends keyof Preferences>(key: K): Promise<Preferences[K] | undefined> => {

    const value = await getItem(key);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const serialize = (key: K, value: Preferences[K], type: 'boolean' | 'number' | 'string' | 'array' | 'object') => {
      const isCorrectType = type === 'array' ? Array.isArray(value) : typeof value === type;
      if (!isCorrectType) {
        setPreference(key, undefined, false);
        return undefined;
      }
      return value;
    };

    if (value) {
      try {
        return serialize(key, JSON.parse(value), PREFERENCE_TYPES[key]);
      } catch (e) {
        return undefined;
      }
    }
    return undefined;
  };

  const setPreference = async <K extends keyof Preferences, V extends Preferences[K] | ((value?: Preferences[K]) => (Preferences[K] | undefined))>(key: K, value?: V, emit = true) => {

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newValue = (value instanceof Function ? value(await getPreference(key)) : value) as any;

    switch (key) {
      
    // system state
    case 'latestVersion':
      setLatestVersion(newValue);
      break;
    case 'rotationLock':
      setRotationLock(newValue);
      break;
    case 'searchHistory':
      setSearchHistory(newValue);
      break;
    case 'viewedFeatures':
      setViewedFeatures(newValue);
      break;
    case 'hasReviewed':
      setHasReviewed(newValue);
      break;
    case 'lastRequestForReview':
      setLastRequestForReview(newValue);
      break;
    case 'loadedInitialUrl':
      setLoadedInitialUrl(newValue);
      break;
      
    // user state
    case 'uuid':
      setUuid(uuid);
      break;
    case 'pushNotificationsEnabled':
      setPushNotificationsEnabled(newValue);
      break;
    case 'pushNotifications':
      setPushNotifications(newValue);
      break;
    case 'fcmToken':
      setFcmToken(newValue);
      break;
      
    // summary state
    case 'bookmarkedSummaries':
      setBookmarkedSummaries(newValue);
      break;
    case 'readSummaries':
      setReadSummaries(newValue);
      break;
    case 'removedSummaries':
      setRemovedSummaries(newValue);
      break;
    case 'summaryTranslations':
      setSummaryTranslations(newValue);
      break;
      
    // recap state
    case 'readRecaps':
      setReadRecaps(newValue);
      break;
    case 'recapTranslations':
      setRecapTranslations(newValue);
      break;
      
    // publisher state
    case 'followedPublishers':
      setFollowedPublishers(newValue);
      break;
    case 'favoritedPublishers':
      setFavoritedPublishers(newValue);
      break;
    case 'excludedPublishers':
      setExcludedPublishers(newValue);
      break;
      
    // category state
    case 'followedCategories':
      setFollowedCategories(newValue);
      break;
    case 'favoritedCategories':
      setFavoritedCategories(newValue);
      break;
    case 'excludedCategories':
      setExcludedCategories(newValue);
      break;
      
    // system preferences
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
      
    // summary preferences
    case 'compactMode':
    case 'compactSummaries':
      setCompactSummaries(newValue);
      break;
    case 'showShortSummary':
      setShowShortSummary(newValue);
      break;
    case 'preferredShortPressFormat':
      setPreferredShortPressFormat(newValue);
      break;
    case 'preferredReadingFormat':
      setPreferredReadingFormat(newValue);
      break;
    case 'sentimentEnabled':
      setSentimentEnabled(newValue);
      break;
    case 'triggerWords':
      setTriggerWords(newValue);
      break;
      
    default:
      break;
    }
    if (newValue == null) {
      await removeItem(key);
    } else {
      await setItem(key, JSON.stringify(newValue));
    }
    if (emit) {
      emitEvent('set-preference');
    }
  };
  
  const storeTranslations = async <
    Target extends RecapAttributes | PublicSummaryGroup, 
    PrefKey extends Target extends RecapAttributes ? 'recapTranslations' : Target extends PublicSummaryGroup ? 'summaryTranslations' : never,
    State extends NonNullable<PrefKey extends 'recapTranslations' ? typeof recapTranslations : PrefKey extends 'summaryTranslations' ? typeof summaryTranslations : never>,
  >(item: Target, translations: { [key in keyof Target]?: string }, prefKey: PrefKey) => {
    await setPreference(prefKey, (prev) => {
      const state = { ...prev } as State;
      state[item.id] = translations;
      return (prev = state);
    }, false);
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const withHeaders = React.useCallback(<T extends any[], R>(fn: FunctionWithRequestParams<T, R>): ((...args: T) => R) => {
    const userAgent = getUserAgent();
    const headers: RequestInit['headers'] = { 
      'x-app-version': userAgent.currentVersion,
      'x-locale': userAgent.locale,
      'x-platform': userAgent.OS,
    };
    if (uuid) {
      headers['x-uuid'] = uuid;
    }
    return (...args: T) => {
      return fn(...args, { headers });
    };
  }, [uuid, getUserAgent]);

  const hasPushEnabled = React.useCallback((type: string) => {
    return type in ({ ...pushNotifications });
  }, [pushNotifications]);

  const enablePush = async (type: string, settings?: PushNotificationSettings) => {
    await setPreference('pushNotifications', (prev) => {
      const newState = { ...prev };
      if (settings) {
        newState[type] = settings;
      } else {
        delete newState[type];
      }
      return (prev = newState);
    }, false);
  };
  
  const hasViewedFeature = React.useCallback((...features: string[]) => {
    return features.every((f) => f in ({ ...viewedFeatures }));
  }, [viewedFeatures]);
  
  const viewFeature = async (feature: string, state = true) => {
    await setPreference('viewedFeatures', (prev) => {
      const newState = { ...prev };
      if (state) {
        newState[feature] = new Bookmark(true);
      } else {
        delete newState[feature];
      }
      return (prev = newState);
    }, false);
  };
  
  // summary functions
  
  const bookmarkSummary = async (summary: PublicSummaryGroup) => {
    await setPreference('bookmarkedSummaries', (prev) => {
      const state = { ...prev };
      if (summary.id in state) {
        delete state[summary.id];
        emitEvent('unbookmark-summary', summary, state);
      } else {
        state[summary.id] = new Bookmark(summary);
        viewFeature('unread-bookmarks', false);
        emitEvent('bookmark-summary', summary, state);
      }
      return (prev = state);
    }, false);
  };
  
  const readSummary = async (summary: PublicSummaryGroup, force = false) => {
    await setPreference('readSummaries', (prev) => {
      const state = { ...prev };
      if (force && summary.id in state) {
        delete state[summary.id];
        emitEvent('unread-summary', summary, state);
      } else {
        state[summary.id] = new Bookmark(true);
        emitEvent('read-summary', summary, state);
      }
      return (prev = state);
    }, false);
  };
  
  const removeSummary = async (summary: PublicSummaryGroup) => {
    await setPreference('removedSummaries', (prev) => {
      const state = { ...prev };
      if (summary.id in state) {
        delete state[summary.id];
        emitEvent('unhide-summary', summary, state);
      } else {
        state[summary.id] = true;
        emitEvent('hide-summary', summary, state);
      }
      return (prev = state);
    }, false);
  };
  
  // recap functions
  
  const readRecap = async (recap: RecapAttributes, force = false) => {
    await setPreference('readRecaps', (prev) => {
      const state = { ...prev };
      if (force && recap.id in state) {
        delete state[recap.id];
        emitEvent('unread-recap', recap, state);
      } else {
        state[recap.id] = true;
        emitEvent('read-recap', recap, state);
      }
      return (prev = state);
    }, false);
  };

  // publisher functions
  
  const followPublisher = async (publisher: PublicPublisherAttributes) => {
    await setPreference('followedPublishers', (prev) => {
      const state = { ...prev };
      if (publisher.name in state) {
        delete state[publisher.name];
        setPreference('favoritedPublishers', (prev) => {
          const state = { ...prev };
          delete state[publisher.name];
          return (prev = state);
        }, false);
        emitEvent('unfollow-publisher', publisher, state);
      } else {
        state[publisher.name] = true;
        setPreference('excludedPublishers', (prev) => {
          const state = { ...prev };
          delete state[publisher.name];
          return (prev = state);
        }, false);
        emitEvent('follow-publisher', publisher, state);
      }
      return (prev = state);
    }, false);
  };
  
  const isFollowingPublisher = React.useCallback((publisher: PublicPublisherAttributes) => publisher.name in ({ ...followedPublishers }), [followedPublishers]);
  
  const favoritePublisher = async (publisher: PublicPublisherAttributes) => {
    await setPreference('favoritedPublishers', (prev) => {
      const state = { ...prev };
      if (publisher.name in state) {
        delete state[publisher.name];
        emitEvent('unfavorite-publisher', publisher, state);
      } else {
        state[publisher.name] = true;
        emitEvent('favorite-publisher', publisher, state);
      }
      return (prev = state);
    }, false);
  };
  
  const publisherIsFavorited = React.useCallback((publisher: PublicPublisherAttributes) => publisher.name in ({ ...favoritedPublishers }), [favoritedPublishers]);
  
  const excludePublisher = async (publisher: PublicPublisherAttributes) => {
    await setPreference('excludedPublishers', (prev) => {
      const state = { ...prev };
      if (publisher.name in state) {
        delete state[publisher.name];
        emitEvent('unexclude-publisher', publisher, state);
      } else {
        state[publisher.name] = true;
        setPreference('followedPublishers', (prev) => {
          const state = { ...prev };
          delete state[publisher.name];
          return (prev = state);
        }, false);
        emitEvent('exclude-publisher', publisher, state);
      }
      return (prev = state);
    }, false);
  };
  
  const isExcludingPublisher = React.useCallback((publisher: PublicPublisherAttributes) => publisher.name in ({ ...excludedPublishers }), [excludedPublishers]);

  // category functions
  
  const followCategory = async (category: PublicCategoryAttributes) => {
    await setPreference('followedCategories', (prev) => {
      const state = { ...prev };
      if (category.name in state) {
        delete state[category.name];
        setPreference('followedCategories', (prev) => {
          const state = { ...prev };
          delete state[category.name];
          return (prev = state);
        }, false);
        emitEvent('unfollow-category', category, state);
      } else {
        state[category.name] = true;
        setPreference('excludedCategories', (prev) => {
          const state = { ...prev };
          delete state[category.name];
          return (prev = state);
        }, false);
        emitEvent('follow-category', category, state);
      }
      return (prev = state);
    }, false);
  };
  
  const isFollowingCategory = React.useCallback((category: PublicCategoryAttributes) => category.name in ({ ...followedCategories }), [followedCategories]);
  
  const favoriteCategory = async (category: PublicCategoryAttributes) => {
    await setPreference('favoritedCategories', (prev) => {
      const state = { ...prev };
      if (category.name in state) {
        delete state[category.name];
        emitEvent('unfavorite-category', category, state);
      } else {
        state[category.name] = true;
        emitEvent('favorite-category', category, state);
      }
      return (prev = state);
    }, false);
  };
  
  const categoryIsFavorited = React.useCallback((category: PublicCategoryAttributes) => category.name in ({ ...favoritedCategories }), [favoritedCategories]);

  const excludeCategory = async (category: PublicCategoryAttributes) => {
    await setPreference('excludedCategories', (prev) => {
      const state = { ...prev };
      if (category.name in state) {
        delete state[category.name];
        emitEvent('unexclude-category', category, state);
      } else {
        state[category.name] = true;
        setPreference('followedCategories', (prev) => {
          const state = { ...prev };
          delete state[category.name];
          return (prev = state);
        }, false);
        emitEvent('exclude-category', category, state);
      }
      return (prev = state);
    }, false);
  };
  
  const isExcludingCategory = React.useCallback((category: PublicCategoryAttributes) => category.name in ({ ...excludedCategories }), [excludedCategories]);

  // Load preferences on mount
  const load = async () => {
    // system state
    setLatestVersion(await getPreference('latestVersion'));
    setRotationLock(await getPreference('rotationLock'));
    setSearchHistory(await getPreference('searchHistory'));
    setViewedFeatures(await getPreference('viewedFeatures'));
    setHasReviewed(await getPreference('hasReviewed'));
    setLastRequestForReview(await getPreference('lastRequestForReview') ?? 0);
    setUuid(await getPreference('uuid'));
    setPushNotificationsEnabled(await getPreference('pushNotificationsEnabled'));
    setPushNotifications(await getPreference('pushNotifications'));
    setFcmToken(await getPreference('fcmToken'));
    
    // summary state
    setBookmarkedSummaries(await getPreference('bookmarkedSummaries'));
    setReadSummaries(await getPreference('readSummaries'));
    setRemovedSummaries(await getPreference('removedSummaries'));
    const locale = await getPreference('locale');
    setLocale(locale);
    setSummaryTranslations(locale !== getLocale() ? {} : await getPreference('summaryTranslations'));
    
    // recap state
    setReadRecaps(await getPreference('readRecaps'));
    setRecapTranslations(await getPreference('recapTranslations'));
    
    // publisher states
    setFollowedPublishers(await getPreference('followedPublishers'));
    setFavoritedPublishers(await getPreference('favoritedPublishers'));
    setExcludedPublishers(await getPreference('excludedPublishers'));

    // category states
    setFollowedCategories(await getPreference('followedCategories'));
    setFavoritedCategories(await getPreference('favoritedCategories'));
    setExcludedCategories(await getPreference('excludedCategories'));
    
    // system preferences
    setColorScheme(await getPreference('colorScheme')); 
    setFontFamily(await getPreference('fontFamily'));
    setFontSizeOffset(await getPreference('fontSizeOffset'));
    setLetterSpacing(await getPreference('letterSpacing'));
    setLineHeightMultiplier(await getPreference('lineHeightMultiplier'));
  
    // summary preferences
    setCompactSummaries(await getPreference('compactSummaries') ?? await getPreference('compactMode'));
    setShowShortSummary(await getPreference('showShortSummary'));
    setPreferredReadingFormat(await getPreference('preferredReadingFormat'));
    setPreferredShortPressFormat(await getPreference('preferredShortPressFormat'));
    setSentimentEnabled(await getPreference('sentimentEnabled'));
    setTriggerWords(await getPreference('triggerWords'));
    
    setReady(true);
  };
  
  const resetPreferences = async (hard = false) => {
    await removeAll(hard);
    load();
  };

  React.useEffect(() => {
    load();
  }, []);

  return (
    <SessionContext.Provider
      value={ {
        bookmarkCount,
        bookmarkSummary,
        bookmarkedSummaries,
        categories,
        categoryIsFavorited,
        colorScheme,
        compactSummaries,
        enablePush,
        excludeCategory,
        excludeFilter,
        excludePublisher,
        excludedCategories,
        excludedPublishers,
        favoriteCategory,
        favoritePublisher,
        favoritedCategories,
        favoritedPublishers,
        fcmToken,
        followCategory,
        followCount,
        followFilter,
        followPublisher,
        followedCategories,
        followedPublishers,
        fontFamily,
        fontSizeOffset,
        getPreference,
        hasPushEnabled,
        hasReviewed,
        hasViewedFeature,
        isExcludingCategory,
        isExcludingPublisher,
        isFollowingCategory,
        isFollowingPublisher,
        lastRequestForReview,
        latestVersion,
        letterSpacing,
        lineHeightMultiplier,
        loadedInitialUrl,
        preferredReadingFormat,
        preferredShortPressFormat,
        publisherIsFavorited,
        publishers,
        pushNotifications,
        pushNotificationsEnabled,
        readRecap,
        readRecaps,
        readSummaries,
        readSummary,
        ready,
        recapTranslations,
        removeSummary,
        removedSummaries,
        resetPreferences,
        rotationLock,
        searchHistory,
        sentimentEnabled,
        setCategories,
        setPreference,
        setPublishers,
        showShortSummary,
        storeTranslations,
        summaryTranslations,
        triggerWords,
        unreadBookmarkCount,
        uuid,
        viewFeature,
        viewedFeatures,
        withHeaders,
      } }>
      {children}
    </SessionContext.Provider>
  );
}
