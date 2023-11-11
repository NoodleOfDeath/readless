import React from 'react';

import { UserData } from './UserData';
import {
  DEFAULT_STORAGE_CONTEXT,
  DatedEvent,
  FunctionWithRequestParams,
  Methods,
  PushNotificationSettings,
  STORAGE_TYPES,
  SYNCABLE_SETTINGS,
  Storage,
  SyncableIoIn,
  SyncableIoOut,
} from './types';

import {
  API,
  PublicCategoryAttributes,
  PublicPublisherAttributes,
  PublicSummaryGroup,
  RecapAttributes,
  RequestParams,
} from '~/api';
import { getLocale } from '~/locales';
import { useLocalStorage, usePlatformTools } from '~/utils';

export const StorageContext = React.createContext(DEFAULT_STORAGE_CONTEXT);

export function StorageContextProvider({ children }: React.PropsWithChildren) { 

  const {
    getItem, removeItem, removeAll, setItem, 
  } = useLocalStorage();
  const { emitEvent, getUserAgent } = usePlatformTools();
  
  // system state
  const [storage, setStorage] = React.useState<Storage>(DEFAULT_STORAGE_CONTEXT);
  const [hasLoadedLocalState, setHasLoadedLocalState] = React.useState<boolean>();
  const [isSyncingWithRemote, setIsSyncingWithRemote] = React.useState<boolean>();
  const [hasSyncedWithRemote, setHasSyncedWithRemote] = React.useState<boolean>();
  
  const ready = React.useMemo(() => hasLoadedLocalState && hasSyncedWithRemote, [hasLoadedLocalState, hasSyncedWithRemote]);
  
  const [loadedInitialUrl, setLoadedInitialUrl] = React.useState<boolean>();
  const [categories, setCategories] = React.useState<Record<string, PublicCategoryAttributes>>();
  const [publishers, setPublishers] = React.useState<Record<string, PublicPublisherAttributes>>();
  
  const bookmarkCount = React.useMemo(() => {
    return Object.keys({ ...storage.bookmarkedSummaries }).length;
  }, [storage.bookmarkedSummaries]);

  const unreadBookmarkCount = React.useMemo(() => {
    return Object.keys({ ...storage.bookmarkedSummaries }).filter((id) => !(id in ({ ...storage.readSummaries }))).length;
  }, [storage.bookmarkedSummaries, storage.readSummaries]);
  
  // following computed state
  const followCount = React.useMemo(() => Object.keys({ ...storage.followedPublishers }).length + Object.keys({ ...storage.followedCategories }).length, [storage.followedPublishers, storage.followedCategories]);

  const followFilter = React.useMemo(() => {
    const filters: string[] = [];
    if (Object.keys({ ...storage.followedPublishers }).length > 0) {
      filters.push(['pub', Object.keys({ ...storage.followedPublishers }).join(',')].join(':'));
    }
    if (Object.keys({ ...storage.excludedPublishers }).length > 0) {
      filters.push(['-pub', Object.keys({ ...storage.excludedPublishers }).join(',')].join(':'));
    }
    if (Object.keys({ ...storage.followedCategories }).length > 0) {
      filters.push(['cat', Object.keys({ ...storage.followedCategories }).join(',')].join(':'));
    }
    return filters.join(' ');
  }, [storage.followedPublishers, storage.excludedPublishers, storage.followedCategories]);
  
  const excludeFilter = React.useMemo(() => {
    const filters: string[] = [];
    if (Object.keys({ ...storage.excludedPublishers }).length > 0) {
      filters.push(['-pub', Object.keys({ ...storage.excludedPublishers }).join(',')].join(':'));
    }
    if (Object.keys({ ...storage.excludedCategories }).length > 0) {
      filters.push(['-cat', Object.keys({ ...storage.excludedCategories }).join(',')].join(':'));
    }
    return filters.join(' ');
  }, [storage.excludedPublishers, storage.excludedCategories]);
    
  // system functions
  
  const getStoredValue = async <K extends keyof Storage>(key: K): Promise<Storage[K] | undefined> => {

    const value = await getItem(key);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const serialize = (key: K, value: Storage[K], type: 'boolean' | 'number' | 'string' | 'array' | 'object') => {
      const isCorrectType = type === 'array' ? Array.isArray(value) : typeof value === type;
      if (!isCorrectType) {
        setStoredValue(key, undefined);
        return undefined;
      }
      return value;
    };

    if (value) {
      try {
        if (key === 'userData') {
          return new UserData(JSON.parse(value)) as Storage[K];
        }
        return serialize(key, JSON.parse(value), STORAGE_TYPES[key]);
      } catch (e) {
        return undefined;
      }
    }
    return undefined;
  };

  const setStoredValue = async <K extends keyof Storage, V extends Storage[K] | ((value?: Storage[K]) => (Storage[K] | undefined))>(key: K, value?: V, emit = true) => {
    const newValue = (value instanceof Function ? value(await getStoredValue(key)) : value) as Storage[K];
    setStorage((prev) => {
      const state = { ...prev };
      if (newValue == null) {
        delete state[key];
        removeItem(key);
      } else {
        state[key] = newValue;
        setItem(key, JSON.stringify(newValue));
      }
      if (key === 'userData') {
        for (const [key, value] of Object.entries((newValue as UserData)?.profile?.preferences ?? {})) {
          state[key as K] = value;
          setItem(key, JSON.stringify(value));
        }
      }
      if (SYNCABLE_SETTINGS.includes(key)) {
        updateRemotePref(key, newValue);
      }
      if (emit) {
        emitEvent('set-preference', key);
      }
      return state;
    });
  };
  
  const storeTranslations = async <
    Target extends RecapAttributes | PublicSummaryGroup, 
    StoredValueKey extends Target extends RecapAttributes ? 'recapTranslations' : Target extends PublicSummaryGroup ? 'summaryTranslations' : never,
    State extends NonNullable<StoredValueKey extends 'recapTranslations' ? typeof storage.recapTranslations : StoredValueKey extends 'summaryTranslations' ? typeof storage.summaryTranslations : never>,
  >(item: Target, translations: { [key in keyof Target]?: string }, prefKey: StoredValueKey) => {
    await setStoredValue(prefKey, (prev) => {
      const state = { ...prev } as State;
      state[item.id] = translations;
      return state;
    });
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const withHeaders = React.useCallback(<T extends any[], R>(fn: FunctionWithRequestParams<T, R>): ((...args: T) => R) => {
    const userAgent = getUserAgent();
    const headers: RequestInit['headers'] = { 
      'x-app-version': userAgent.currentVersion,
      'x-locale': userAgent.locale,
      'x-platform': userAgent.OS,
    };
    if (storage.uuid) {
      headers['x-uuid'] = storage.uuid;
    }
    if (storage.userData?.token) {
      headers.authorization = `Bearer ${storage.userData.token?.signed}`;
    }
    return (...args: T) => {
      return fn(...args, { headers });
    };
  }, [storage.uuid, storage.userData?.token, getUserAgent]);

  const api: Methods = React.useMemo(() => {
    const guts = Object.fromEntries(Object.entries(API)
      .filter(([, f]) => f instanceof Function)
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      .map(([k, f]) => [k, withHeaders(f as (...args: [...Parameters<typeof f>, RequestParams | undefined]) => ReturnType<typeof f>)])) as unknown as Methods;
    return {
      ...guts,
      getSummary: (id: number) => guts.getSummaries({ ids: [id] }),
    };
  }, [withHeaders]);
  
  const updateRemotePref = React.useCallback(async <K extends keyof Storage>(key: K, newState?: Storage[K]) => {
    if (!SYNCABLE_SETTINGS.includes(key)) {
      return;
    }
    try {
      const trans = SyncableIoOut(key);
      const value = trans(newState);
      await api.updateMetadata({
        key, 
        value: value as unknown as object,
      });
    } catch (e) {
      console.error(e);
    }
  }, [api]);
  
  const loadBookmarks = React.useCallback(async (ids: number) => {
    const { data, error } = await api.getSummaries({ ids });
    if (error) {
      console.error(error);
      return;
    }
    const { rows: summaries } = data;
    if (!summaries) {
      return;
    }
    await setStoredValue('bookmarkedSummaries', Object.fromEntries(summaries.map((s) => [s.id, new DatedEvent(s)])), false);
  }, [api]);

  const syncWithRemotePrefs = React.useCallback(async () => {
    if (!hasLoadedLocalState) {
      return;
    }
    if (!storage.userData) {
      setHasSyncedWithRemote(true);
      return;
    }
    const { data, error } = await api.getProfile();
    if (error) {
      console.error(error);
      return;
    }
    const { profile } = data;
    if (!profile) {
      return;
    }
    console.log('syncing prefs');
    for (const key of SYNCABLE_SETTINGS) {
      const remoteValue = profile.preferences?.[key];
      console.log('updating', key, remoteValue);
      if (key === 'bookmarkedSummaries') {
        loadBookmarks(Object.keys(remoteValue ?? {}).map((v) => parseInt(v)));
      } else {
        try {
          if (remoteValue) {
            const trans = SyncableIoIn(key);
            const value = trans(remoteValue);
            await setStoredValue(key, value, false);
          }
        } catch (e) {
          console.error(e);
        }
      }
    }
    await setStoredValue('lastRemoteSync', new Date());
    setHasSyncedWithRemote(true);
    setIsSyncingWithRemote(false);
  }, [hasLoadedLocalState, api, storage.userData, loadBookmarks]);
  
  // Load preferences on mount
  const load = async () => {
    const state = { ...DEFAULT_STORAGE_CONTEXT };
    
    // system state
    state.rotationLock = await getStoredValue('rotationLock');
    state.searchHistory = await getStoredValue('searchHistory');
    state.viewedFeatures = await getStoredValue('viewedFeatures');
    state.hasReviewed = await getStoredValue('hasReviewed');
    state.lastRequestForReview = await getStoredValue('lastRequestForReview') ?? 0;
    state.uuid = await getStoredValue('uuid');
    state.pushNotificationsEnabled = await getStoredValue('pushNotificationsEnabled');
    state.pushNotifications = await getStoredValue('pushNotifications');
    state.fcmToken = await getStoredValue('fcmToken');
    state.userData = await getStoredValue('userData');
    state.userStats = await getStoredValue('userStats');
    
    // summary state
    state.bookmarkedSummaries = await getStoredValue('bookmarkedSummaries');
    state.readSummaries = await getStoredValue('readSummaries');
    state.removedSummaries = await getStoredValue('removedSummaries');

    const locale = await getStoredValue('locale');
    state.summaryTranslations = (locale !== getLocale() ? {} : await getStoredValue('summaryTranslations'));
    
    // recap state
    state.readRecaps = await getStoredValue('readRecaps');
    state.recapTranslations = (locale !== getLocale() ? {} : await getStoredValue('recapTranslations'));

    state.locale = getLocale();
    
    // publisher states
    state.followedPublishers = await getStoredValue('followedPublishers');
    state.favoritedPublishers = await getStoredValue('favoritedPublishers');
    state.excludedPublishers = await getStoredValue('excludedPublishers');

    // category states
    state.followedCategories = await getStoredValue('followedCategories');
    state.favoritedCategories = await getStoredValue('favoritedCategories');
    state.excludedCategories = await getStoredValue('excludedCategories');
    
    // system preferences
    state.colorScheme = await getStoredValue('colorScheme'); 
    state.fontFamily = await getStoredValue('fontFamily');
    state.fontSizeOffset = await getStoredValue('fontSizeOffset');
    state.letterSpacing = await getStoredValue('letterSpacing');
    state.lineHeightMultiplier = await getStoredValue('lineHeightMultiplier');
  
    // summary preferences
    state.compactSummaries = await getStoredValue('compactSummaries');
    state.showShortSummary = await getStoredValue('showShortSummary');
    state.preferredReadingFormat = await getStoredValue('preferredReadingFormat');
    state.preferredShortPressFormat = await getStoredValue('preferredShortPressFormat');
    state.sentimentEnabled = await getStoredValue('sentimentEnabled');
    state.triggerWords = await getStoredValue('triggerWords');
    
    setStorage(state);
    setHasLoadedLocalState(true);
  };

  React.useEffect(() => {
    if (!isSyncingWithRemote && !hasSyncedWithRemote && hasLoadedLocalState) {
      syncWithRemotePrefs();
      setIsSyncingWithRemote(true);
    }
  }, [hasLoadedLocalState, isSyncingWithRemote, hasSyncedWithRemote, syncWithRemotePrefs]);
  
  const resetStorage = async (hard = false) => {
    await removeAll(hard);
    await load();
  };
  
  // push notification functions

  const hasPushEnabled = React.useCallback((type: string) => {
    return type in ({ ...storage.pushNotifications });
  }, [storage.pushNotifications]);

  const enablePush = async (type: string, settings?: PushNotificationSettings) => {
    await setStoredValue('pushNotifications', (prev) => {
      const newState = { ...prev };
      if (settings) {
        newState[type] = settings;
      } else {
        delete newState[type];
      }
      return (prev = newState);
    });
  };
  
  const hasViewedFeature = React.useCallback((...features: string[]) => {
    return features.every((f) => f in ({ ...storage.viewedFeatures }));
  }, [storage.viewedFeatures]);
  
  const viewFeature = async (feature: string, state = true) => {
    await setStoredValue('viewedFeatures', (prev) => {
      const newState = { ...prev };
      if (state) {
        newState[feature] = new DatedEvent(true);
      } else {
        delete newState[feature];
      }
      return (prev = newState);
    });
  };
  
  // summary functions
  
  const bookmarkSummary = async (summary: PublicSummaryGroup) => {
    await setStoredValue('bookmarkedSummaries', (prev) => {
      const state = { ...prev };
      if (summary.id in state) {
        delete state[summary.id];
        emitEvent('unbookmark-summary', summary, state);
      } else {
        state[summary.id] = new DatedEvent(summary);
        viewFeature('unread-bookmarks');
        emitEvent('bookmark-summary', summary, state);
      }
      return state;
    });
  };
  
  const readSummary = async (summary: PublicSummaryGroup, force = false) => {
    await setStoredValue('readSummaries', (prev) => {
      const state = { ...prev };
      if (force && summary.id in state) {
        delete state[summary.id];
        emitEvent('unread-summary', summary, state);
      } else {
        state[summary.id] = new DatedEvent(true);
        emitEvent('read-summary', summary, state);
      }
      return state;
    });
  };
  
  const removeSummary = async (summary: PublicSummaryGroup) => {
    await setStoredValue('removedSummaries', (prev) => {
      const state = { ...prev };
      if (summary.id in state) {
        delete state[summary.id];
        emitEvent('unhide-summary', summary, state);
      } else {
        state[summary.id] = true;
        emitEvent('hide-summary', summary, state);
      }
      return state;
    });
  };
  
  // recap functions
  
  const readRecap = async (recap: RecapAttributes, force = false) => {
    await setStoredValue('readRecaps', (prev) => {
      const state = { ...prev };
      if (force && recap.id in state) {
        delete state[recap.id];
        emitEvent('unread-recap', recap, state);
      } else {
        state[recap.id] = true;
        emitEvent('read-recap', recap, state);
      }
      return state;
    });
  };

  // publisher functions
  
  const followPublisher = async (publisher: PublicPublisherAttributes) => {
    await setStoredValue('followedPublishers', (prev) => {
      const state = { ...prev };
      if (publisher.name in state) {
        delete state[publisher.name];
        setStoredValue('favoritedPublishers', (prev) => {
          const state = { ...prev };
          delete state[publisher.name];
          return state;
        });
        emitEvent('unfollow-publisher', publisher, state);
      } else {
        state[publisher.name] = true;
        setStoredValue('excludedPublishers', (prev) => {
          const state = { ...prev };
          delete state[publisher.name];
          return state;
        });
        emitEvent('follow-publisher', publisher, state);
      }
      return state;
    });
  };
  
  const isFollowingPublisher = React.useCallback((publisher: PublicPublisherAttributes) => publisher.name in ({ ...storage.followedPublishers }), [storage.followedPublishers]);
  
  const favoritePublisher = async (publisher: PublicPublisherAttributes) => {
    await setStoredValue('favoritedPublishers', (prev) => {
      const state = { ...prev };
      if (publisher.name in state) {
        delete state[publisher.name];
        emitEvent('unfavorite-publisher', publisher, state);
      } else {
        state[publisher.name] = true;
        emitEvent('favorite-publisher', publisher, state);
      }
      return state;
    });
  };
  
  const publisherIsFavorited = React.useCallback((publisher: PublicPublisherAttributes) => publisher.name in ({ ...storage.favoritedPublishers }), [storage.favoritedPublishers]);
  
  const excludePublisher = async (publisher: PublicPublisherAttributes) => {
    await setStoredValue('excludedPublishers', (prev) => {
      const state = { ...prev };
      if (publisher.name in state) {
        delete state[publisher.name];
        emitEvent('unexclude-publisher', publisher, state);
      } else {
        state[publisher.name] = true;
        setStoredValue('followedPublishers', (prev) => {
          const state = { ...prev };
          delete state[publisher.name];
          return state;
        });
        emitEvent('exclude-publisher', publisher, state);
      }
      return state;
    });
  };
  
  const isExcludingPublisher = React.useCallback((publisher: PublicPublisherAttributes) => publisher.name in ({ ...storage.excludedPublishers }), [storage.excludedPublishers]);

  // category functions
  
  const followCategory = async (category: PublicCategoryAttributes) => {
    await setStoredValue('followedCategories', (prev) => {
      const state = { ...prev };
      if (category.name in state) {
        delete state[category.name];
        setStoredValue('followedCategories', (prev) => {
          const state = { ...prev };
          delete state[category.name];
          return state;
        });
        emitEvent('unfollow-category', category, state);
      } else {
        state[category.name] = true;
        setStoredValue('excludedCategories', (prev) => {
          const state = { ...prev };
          delete state[category.name];
          return state;
        });
        emitEvent('follow-category', category, state);
      }
      return state;
    });
  };
  
  const isFollowingCategory = React.useCallback((category: PublicCategoryAttributes) => category.name in ({ ...storage.followedCategories }), [storage.followedCategories]);
  
  const favoriteCategory = async (category: PublicCategoryAttributes) => {
    await setStoredValue('favoritedCategories', (prev) => {
      const state = { ...prev };
      if (category.name in state) {
        delete state[category.name];
        emitEvent('unfavorite-category', category, state);
      } else {
        state[category.name] = true;
        emitEvent('favorite-category', category, state);
      }
      return state;
    });
  };
  
  const categoryIsFavorited = React.useCallback((category: PublicCategoryAttributes) => category.name in ({ ...storage.favoritedCategories }), [storage.favoritedCategories]);

  const excludeCategory = async (category: PublicCategoryAttributes) => {
    await setStoredValue('excludedCategories', (prev) => {
      const state = { ...prev };
      if (category.name in state) {
        delete state[category.name];
        emitEvent('unexclude-category', category, state);
      } else {
        state[category.name] = true;
        setStoredValue('followedCategories', (prev) => {
          const state = { ...prev };
          delete state[category.name];
          return state;
        });
        emitEvent('exclude-category', category, state);
      }
      return state;
    });
  };
  
  const isExcludingCategory = React.useCallback((category: PublicCategoryAttributes) => category.name in ({ ...storage.excludedCategories }), [storage.excludedCategories]);

  React.useEffect(() => {
    load();
  }, []);

  return (
    <StorageContext.Provider
      value={ {
        ...storage,
        api,
        bookmarkCount,
        bookmarkSummary,
        categories,
        categoryIsFavorited,
        enablePush,
        excludeCategory,
        excludeFilter,
        excludePublisher,
        favoriteCategory,
        favoritePublisher,
        followCategory,
        followCount,
        followFilter,
        followPublisher,
        getStoredValue,
        hasPushEnabled,
        hasSyncedWithRemote,
        hasViewedFeature,
        isExcludingCategory,
        isExcludingPublisher,
        isFollowingCategory,
        isFollowingPublisher,
        isSyncingWithRemote,
        loadedInitialUrl,
        publisherIsFavorited,
        publishers,
        readRecap,
        readSummary,
        ready,
        removeSummary,
        resetStorage,
        setCategories,
        setLoadedInitialUrl,
        setPublishers,
        setStoredValue,
        storeTranslations,
        unreadBookmarkCount,
        viewFeature,
        withHeaders,
      } }>
      {children}
    </StorageContext.Provider>
  );
}
