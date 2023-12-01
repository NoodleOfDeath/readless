import React from 'react';

import { UserData } from './UserData';
import {
  DEFAULT_STORAGE_CONTEXT,
  DatedEvent,
  FetchJob,
  FunctionWithRequestParams,
  Methods,
  PushNotificationSettings,
  STORAGE_TYPES,
  SYNCABLE_SETTINGS,
  Storage,
  SyncOptions,
  SyncState,
  SyncableIoIn,
  SyncableIoOut,
  ViewableFeature,
} from './types';

import {
  API,
  AuthError,
  ProfileResponse,
  PublicCategoryAttributes,
  PublicPublisherAttributes,
  PublicSummaryGroup,
  RecapAttributes,
  RequestParams,
  SystemNotificationAttributes,
} from '~/api';
import { getLocale } from '~/locales';
import { useLocalStorage, usePlatformTools } from '~/utils';

export const LOGOUT_ERROR_KEYS: AuthError['errorKey'][] = [
  'EXPIRED_CREDENTIALS',
  'INVALID_CREDENTIALS',
  'ALIAS_UNVERIFIED',
  'UNKNOWN_ALIAS',
];

export const StorageContext = React.createContext(DEFAULT_STORAGE_CONTEXT);

export function StorageContextProvider({ children }: React.PropsWithChildren) { 

  const {
    getItem, removeItem, removeAll, setItem, 
  } = useLocalStorage();
  const { emitStorageEvent, getUserAgent } = usePlatformTools();

  // system state
  const [storage, setStorage] = React.useState<Storage>(DEFAULT_STORAGE_CONTEXT);
  const [syncState, setSyncState] = React.useState<SyncState>(new SyncState());
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const [errorHandler, setErrorHandler] = React.useState<((e?: any) => void)>();
  
  const ready = React.useMemo(() => Boolean(syncState.hasLoadedLocalState && syncState.lastFetch), [syncState.hasLoadedLocalState, syncState.lastFetch]);
  
  const [loadedInitialUrl, setLoadedInitialUrl] = React.useState<boolean>();

  const currentStreak = React.useMemo(() => storage.userData?.profile?.stats?.streak, [storage.userData?.profile?.stats?.streak]);
  const longestStreak = React.useMemo(() => storage.userData?.profile?.stats?.longestStreak, [storage.userData?.profile?.stats?.longestStreak]);

  const [notifications, setNotifications] = React.useState<SystemNotificationAttributes[]>();

  const notificationCount = React.useMemo(() => notifications?.length ?? 0, [notifications]);
  const unreadNotificationCount = React.useMemo(() => {
    return notifications?.filter((n) => !(n.id in ({ ...storage.readNotifications }))).length ?? 0;
  }, [notifications, storage.readNotifications]);

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

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleBadRequest = React.useCallback(async (e?: any) => {
    if (e) {
      console.error(e);
      errorHandler?.(e);
    }
    if (e?.errorKey) {
      const error = e as AuthError;
      if (LOGOUT_ERROR_KEYS.includes(error.errorKey)) {
        resetStorage(true);
        return;
      }
    }
    setSyncState((prev) => prev.clone.fail());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [errorHandler]);

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
    if (!storage.userData?.valid) {
      return; 
    }
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
      handleBadRequest(e);
    }
  }, [api, storage, handleBadRequest]);
  
  const getStoredValue = React.useCallback(async <K extends keyof Storage>(key: K): Promise<Storage[K] | undefined> => {

    const value = await getItem(key);

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const serialize = (key: K, value: Storage[K], type: 'array' | 'boolean' | 'number' | 'object' | 'string') => {
      const isCorrectType = type === 'array' ? Array.isArray(value) : typeof value === type;
      if (!isCorrectType) {
        setStorage((prev) => {
          const state = { ...prev };
          delete state[key];
          removeItem(key);
          return state;
        });
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
  }, [getItem, removeItem]);

  const setStoredValue = React.useCallback(async <K extends keyof Storage, V extends Storage[K] | ((value?: Storage[K]) => (Storage[K] | undefined))>(key: K, value?: V, emit = true) => {
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
      if (emit) {
        if (SYNCABLE_SETTINGS.includes(key)) {
          updateRemotePref(key, newValue);
        }
        emitStorageEvent('set-preference', key);
      }
      state.lastLocalSync = Date.now();
      return state;
    });
  }, [emitStorageEvent, getStoredValue, removeItem, setItem, updateRemotePref]);
  
  const forcePushLocalStateToRemote = React.useCallback(async () => {
    for (const key of SYNCABLE_SETTINGS) {
      const value = storage[key];
      if (value) {
        await updateRemotePref(key, value);
      }
    }
  }, [storage, updateRemotePref]);
  
  const storeTranslations = React.useCallback(async <
    Target extends PublicSummaryGroup | RecapAttributes, 
    StoredValueKey extends Target extends RecapAttributes ? 'recapTranslations' : Target extends PublicSummaryGroup ? 'summaryTranslations' : never,
    State extends NonNullable<StoredValueKey extends 'recapTranslations' ? Storage['recapTranslations'] : StoredValueKey extends 'summaryTranslations' ? Storage['summaryTranslations'] : never>,
  >(item: Target, translations: { [key in keyof Target]?: string }, prefKey: StoredValueKey) => {
    await setStoredValue(prefKey, (prev) => {
      const state = { ...prev } as State;
      state[item.id] = translations;
      return state;
    });
  }, [setStoredValue]);

  const syncChannels = React.useCallback(async () => {
    console.log('syncing channels');
    if (!categories) {
      const response = await api.getCategories();
      setCategories(Object.fromEntries(response.data.rows.map((row) => [row.name, row])));
    }
    if (!publishers) {
      const response = await api.getPublishers();
      setPublishers(Object.fromEntries(response.data.rows.map((row) => [row.name, row])));
    }
  }, [categories, publishers, api]);

  const syncNotifications = React.useCallback(async () => {
    console.log('syncing notifications');
    const { data, error } = await api.getSystemNotifications();
    if (error) {
      throw error;
    }
    setNotifications(data.rows);
  }, [api]);

  const syncBookmarks = React.useCallback(async (ids: number[]) => {
    console.log('syncing bookmarks');
    let offset = 0;
    let summaries: PublicSummaryGroup[] = [];
    while (offset < ids.length) {
      const { data, error } = await api.getSummaries({ ids, offset });
      if (error) {
        console.error(error);
        return;
      }
      const { rows, next } = data;
      if (!rows || !next) {
        break;
      }
      summaries = summaries.concat(rows);
      offset = next;
    }
    await setStoredValue(
      'bookmarkedSummaries', 
      Object.fromEntries(summaries.map((s) => [s.id, new DatedEvent(s)])), 
      false
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [api]);
  
  const syncProfile = React.useCallback(async (prefs?: ProfileResponse, opts?: SyncOptions) => {
    console.log('syncing profile');
    let data: ProfileResponse | undefined = prefs;
    if (!data?.profile?.preferences) {
      if (!storage.userData?.valid || storage.userData?.unlinked) {
        return;
      }
      // fetch profile
      const response = await api.getProfile();
      data = response.data;
      if (response.error) {
        throw response.error;
      }
    }
    if (!data?.profile?.preferences) {
      throw new Error('Bad Request');
    }
    const {
      profile: {
        preferences, stats, updatedAt, 
      }, 
    } = data;
    const remoteUpdatedAt = updatedAt && !Number.isNaN(new Date(updatedAt)) ? new Date(updatedAt).valueOf() : 0;
    if (storage.lastRemoteSync && remoteUpdatedAt < storage.lastRemoteSync) {
      console.log('remote data is stale');
      return;
    }
    if (storage.lastLocalSync && remoteUpdatedAt < storage.lastLocalSync) {
      console.log('local data is stale and needs update');
      await forcePushLocalStateToRemote();
      return;
    }
    if (!preferences) {
      throw new Error('Bad Request');
    }
    console.log('syncing prefs');
    for (const key of SYNCABLE_SETTINGS) {
      const remoteValue = preferences[key];
      if (opts?.syncBookmarks && key === 'bookmarkedSummaries') {
        try {
          setSyncState((prev) => {
            const state = prev.clone;
            state.bookmarks.prepare();
            return state;
          });
          const job = new FetchJob(async () => syncBookmarks(Object.keys(remoteValue ?? {}).map((v) => parseInt(v))));
          job.dispatch()
            .then(() => {
              setSyncState((prev) => {
                const state = prev.clone;
                state.bookmarks.success();
                return state;
              });
            })
            .catch((e) => {
              setSyncState((prev) => {
                const state = prev.clone;
                state.bookmarks.fail(e);
                return state;
              });
            });
        } catch (e) {
          console.error(e);
          handleBadRequest(e);
        }
      } else {
        if (remoteValue) {
          const trans = SyncableIoIn(key);
          const value = trans(remoteValue);
          await setStoredValue(key, value, false);
        }
      }
    }
    // syncing stats
    console.log('syncing stats');
    await setStoredValue('userData', (prev) => {
      const state = { ...prev };
      state.profile = {
        ...state.profile,
        stats,
      };
      return new UserData(state);
    }, false);
  }, [storage.lastRemoteSync, storage.lastLocalSync, storage.userData?.valid, storage.userData?.unlinked, setStoredValue, api, forcePushLocalStateToRemote, syncBookmarks, handleBadRequest]);

  const syncWithRemote = React.useCallback(async (prefs?: ProfileResponse, opts?: SyncOptions) => {
    if (!syncState.hasLoadedLocalState || syncState.isFetching || syncState.lastFetchFailed) {
      return;
    }
    // fetch channels
    try {
      setSyncState((prev) => {
        const state = prev.clone;
        state.channels.prepare();
        return state;
      });
      const job = new FetchJob(syncChannels);
      await job.dispatch();
      setSyncState((prev) => {
        const state = prev.clone;
        state.channels.success();
        return state;
      });
    } catch (e) {
      setSyncState((prev) => {
        const state = prev.clone;
        state.channels.fail();
        return state;
      });
      return handleBadRequest(e);
    } 
    // fetch notifications
    try {
      setSyncState((prev) => {
        const state = prev.clone;
        state.notifications.prepare();
        return state;
      });
      const job = new FetchJob(syncNotifications);
      await job.dispatch();
      setSyncState((prev) => {
        const state = prev.clone;
        state.notifications.success();
        return state;
      });
    } catch (e) {
      setSyncState((prev) => {
        const state = prev.clone;
        state.notifications.fail();
        return state;
      });
      return handleBadRequest(e);
    }
    try {
      setSyncState((prev) => {
        const state = prev.clone;
        state.profile.prepare();
        return state;
      });
      const job = new FetchJob(async () => syncProfile(prefs, opts));
      await job.dispatch();
      setSyncState((prev) => {
        const state = prev.clone;
        state.profile.success();
        return state;
      });
    } catch (e) {
      setSyncState((prev) => {
        const state = prev.clone;
        state.profile.fail();
        return state;
      });
      return handleBadRequest(e);
    }
    console.log('remote state synced');
    await setStoredValue('lastRemoteSync', Date.now());
    setSyncState((prev) => prev.clone.success());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [syncState, handleBadRequest, api, syncChannels, syncNotifications, syncProfile]);
  
  // Load preferences on mount
  const load = async () => {
    const state = { ...DEFAULT_STORAGE_CONTEXT };
    
    // system state
    state.lastLocalSync = await getStoredValue('lastLocalSync');
    state.lastRemoteSync = await getStoredValue('lastRemoteSync');
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
    state.readNotifications = await getStoredValue('readNotifications');
    
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
    setSyncState((prev) => {
      const state = prev.clone;
      state.hasLoadedLocalState = true;
      return state;
    });
  };

  React.useEffect(() => {
    if (!syncState.isFetching && !syncState.lastFetch && syncState.hasLoadedLocalState) {
      syncWithRemote(undefined, { syncBookmarks: true });
      setSyncState((prev) => {
        const state = prev.clone;
        state.isFetching = true;
        return state;
      });
    }
  }, [syncState.hasLoadedLocalState, syncState.isFetching, syncState.lastFetch, syncWithRemote]);
  
  const resetStorage = async (hard = false) => {
    await removeAll(hard);
    await load();
  };

  React.useEffect(() => {
    if (storage.lastRemoteSync && !storage.userData?.valid) {
      resetStorage();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storage.lastRemoteSync, storage.userData]);

  React.useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
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
  
  const hasViewedFeature = React.useCallback((...features: ViewableFeature[]) => {
    return features.every((f) => f in ({ ...storage.viewedFeatures }));
  }, [storage.viewedFeatures]);
  
  const viewFeature = async (feature: ViewableFeature, state = true) => {
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

  const hasReadNotification = React.useCallback((...notifications: (SystemNotificationAttributes | number)[]) => {
    return notifications.every((n) => (typeof n === 'number' ? n : n.id) in ({ ...storage.readNotifications }));
  }, [storage.readNotifications]);

  const readNotification = async (...notifications: (SystemNotificationAttributes | number)[]) => {
    await setStoredValue('readNotifications', (prev) => {
      const newState = { ...prev };
      for (const notification of notifications) {
        newState[typeof notification === 'number' ? notification : notification.id] = new DatedEvent(true);
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
        emitStorageEvent('unbookmark-summary', summary, state);
      } else {
        state[summary.id] = new DatedEvent(summary);
        viewFeature('bookmarks', false);
        emitStorageEvent('bookmark-summary', summary, state);
      }
      return state;
    });
  };
  
  const readSummary = async (summary: PublicSummaryGroup, force = false) => {
    await setStoredValue('readSummaries', (prev) => {
      const state = { ...prev };
      if (force && summary.id in state) {
        delete state[summary.id];
        emitStorageEvent('unread-summary', summary, state);
      } else {
        state[summary.id] = new DatedEvent(true);
        emitStorageEvent('read-summary', summary, state);
      }
      return state;
    });
  };
  
  const removeSummary = async (summary: PublicSummaryGroup) => {
    await setStoredValue('removedSummaries', (prev) => {
      const state = { ...prev };
      if (summary.id in state) {
        delete state[summary.id];
        emitStorageEvent('unhide-summary', summary, state);
      } else {
        state[summary.id] = true;
        emitStorageEvent('hide-summary', summary, state);
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
        emitStorageEvent('unread-recap', recap, state);
      } else {
        state[recap.id] = true;
        emitStorageEvent('read-recap', recap, state);
      }
      return state;
    });
  };

  // publisher functions
  
  const followPublisher = async (publisher: PublicPublisherAttributes, force?: boolean) => {
    await setStoredValue('followedPublishers', (prev) => {
      const state = { ...prev };
      if (force === false || (force === undefined && publisher.name in state)) {
        delete state[publisher.name];
        // also remove from favorited
        setStoredValue('favoritedPublishers', (prev) => {
          const state = { ...prev };
          delete state[publisher.name];
          return state;
        });
        emitStorageEvent('unfollow-publisher', publisher, state);
      } else
      if (force === true || (force === undefined && !(publisher.name in state))) {
        state[publisher.name] = true;
        // also remove from excluded
        setStoredValue('excludedPublishers', (prev) => {
          const state = { ...prev };
          delete state[publisher.name];
          return state;
        });
        emitStorageEvent('follow-publisher', publisher, state);
      }
      return state;
    }, force === undefined);
  };
  
  const isFollowingPublisher = React.useCallback((publisher: PublicPublisherAttributes) => publisher.name in ({ ...storage.followedPublishers }), [storage.followedPublishers]);
  
  const favoritePublisher = async (publisher: PublicPublisherAttributes, force?: boolean) => {
    await setStoredValue('favoritedPublishers', (prev) => {
      const state = { ...prev };
      if (force === false || (force === undefined && publisher.name in state)) {
        delete state[publisher.name];
        emitStorageEvent('unfavorite-publisher', publisher, state);
      } else
      if (force === true || (force === undefined && !(publisher.name in state))) {
        state[publisher.name] = true;
        // ensure publisher is also followed
        followPublisher(publisher, true);
        emitStorageEvent('favorite-publisher', publisher, state);
      }
      return state;
    }, force === undefined);
  };
  
  const publisherIsFavorited = React.useCallback((publisher: PublicPublisherAttributes) => publisher.name in ({ ...storage.favoritedPublishers }), [storage.favoritedPublishers]);
  
  const excludePublisher = async (publisher: PublicPublisherAttributes) => {
    await setStoredValue('excludedPublishers', (prev) => {
      const state = { ...prev };
      if (publisher.name in state) {
        delete state[publisher.name];
        emitStorageEvent('unexclude-publisher', publisher, state);
      } else {
        state[publisher.name] = true;
        // ensure publisher is also unfollowed/unfavorited
        followPublisher(publisher, false);
        emitStorageEvent('exclude-publisher', publisher, state);
      }
      return state;
    });
  };
  
  const isExcludingPublisher = React.useCallback((publisher: PublicPublisherAttributes) => publisher.name in ({ ...storage.excludedPublishers }), [storage.excludedPublishers]);

  // category functions
  
  const followCategory = async (category: PublicCategoryAttributes, force?: boolean) => {
    await setStoredValue('followedCategories', (prev) => {
      const state = { ...prev };
      if (force === false || (force === undefined && category.name in state)) {
        delete state[category.name];
        // also remove from favorited categories
        setStoredValue('favoritedCategories', (prev) => {
          const state = { ...prev };
          delete state[category.name];
          return state;
        });
        emitStorageEvent('unfollow-category', category, state);
      } else
      if (force === true || (force === undefined && !(category.name in state))) {
        state[category.name] = true;
        // also remove from excluded categories
        setStoredValue('excludedCategories', (prev) => {
          const state = { ...prev };
          delete state[category.name];
          return state;
        });
        emitStorageEvent('follow-category', category, state);
      }
      return state;
    }, force === undefined);
  };
  
  const isFollowingCategory = React.useCallback((category: PublicCategoryAttributes) => category.name in ({ ...storage.followedCategories }), [storage.followedCategories]);
  
  const favoriteCategory = async (category: PublicCategoryAttributes, force?: boolean) => {
    await setStoredValue('favoritedCategories', (prev) => {
      const state = { ...prev };
      if (force === false || (force === undefined && category.name in state)) {
        delete state[category.name];
        emitStorageEvent('unfavorite-category', category, state);
      } else
      if (force === true || (force === undefined && !(category.name in state))) {
        state[category.name] = true;
        // ensure category is also followed
        followCategory(category, true);
        emitStorageEvent('favorite-category', category, state);
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
        emitStorageEvent('unexclude-category', category, state);
      } else {
        state[category.name] = true;
        // ensure category is also unfollowed/unfavorited
        followCategory(category, false);
        emitStorageEvent('exclude-category', category, state);
      }
      return state;
    });
  };
  
  const isExcludingCategory = React.useCallback((category: PublicCategoryAttributes) => category.name in ({ ...storage.excludedCategories }), [storage.excludedCategories]);

  return (
    <StorageContext.Provider
      value={ {
        ...storage,
        api,
        bookmarkCount,
        bookmarkSummary,
        categories,
        categoryIsFavorited,
        currentStreak,
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
        hasReadNotification,
        hasViewedFeature,
        isExcludingCategory,
        isExcludingPublisher,
        isFollowingCategory,
        isFollowingPublisher,
        loadedInitialUrl,
        longestStreak,
        notificationCount,
        notifications,
        publisherIsFavorited,
        publishers,
        readNotification,
        readRecap,
        readSummary,
        ready,
        removeSummary,
        resetStorage,
        setCategories,
        setErrorHandler,
        setLoadedInitialUrl,
        setPublishers,
        setStoredValue,
        storeTranslations,
        syncState,
        syncWithRemote,
        unreadBookmarkCount,
        unreadNotificationCount,
        viewFeature,
        withHeaders,
      } }>
      {children}
    </StorageContext.Provider>
  );
}
