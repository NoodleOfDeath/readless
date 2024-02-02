import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { StoreState } from '../../types';

export type PreferenceSliceState = Pick<StoreState, 'colorScheme' | 'compactSummaries' | 'fcmToken' | 'fontFamily' | 'fontSizeOffset' | 'hasReviewed' | 'lastLocalSync' | 'lastRemoteSync' | 'lastRequestForReview' | 'letterSpacing' | 'lineHeightMultiplier' | 'locale' | 'preferredReadingFormat' | 'preferredShortPressFormat' | 'pushNotifications' | 'pushNotificationsEnabled' | 'readNotifications' | 'readRecaps' | 'recapTranslations' | 'rotationLock' | 'searchHistory' | 'sentimentEnabled' | 'showShortSummary' | 'userData' | 'uuid' | 'viewedFeatures'
>;

const initialState: PreferenceSliceState = {
  colorScheme: null,
  compactSummaries: null,
  fcmToken: null,
  fontFamily: null,
  fontSizeOffset: null,
  hasReviewed: null,
  lastLocalSync: null,
  lastRemoteSync: null,
  lastRequestForReview: null,
  letterSpacing: null,
  lineHeightMultiplier: null,
  locale: null,
  preferredReadingFormat: null,
  preferredShortPressFormat: null,
  pushNotifications: null,
  pushNotificationsEnabled: null,
  readNotifications: null,
  readRecaps: null,
  recapTranslations: null,
  rotationLock: null,
  searchHistory: null,
  sentimentEnabled: null,
  showShortSummary: null,
  userData: null,
  uuid: null,
  viewedFeatures: null,
};

export { initialState as preferenceInitialState };

export const preferenceSlice = createSlice({
  initialState, 
  name: 'preference',
  reducers: { 
    setColorScheme: (state, action: PayloadAction<StoreState['colorScheme']>) => {
      if (state) {
        state.colorScheme = action.payload;
      }
    },
    setCompactSummaries: (state, action: PayloadAction<StoreState['compactSummaries']>) => {
      if (state) {
        state.compactSummaries = action.payload;
      }
    },
    setFcmToken: (state, action: PayloadAction<StoreState['fcmToken']>) => {
      if (state) {
        state.fcmToken = action.payload;
      }
    },
    setFontFamily: (state, action: PayloadAction<StoreState['fontFamily']>) => {
      if (state) {
        state.fontFamily = action.payload;
      }
    },
    setFontSizeOffset: (state, action: PayloadAction<StoreState['fontSizeOffset']>) => {
      if (state) {
        state.fontSizeOffset = action.payload;
      }
    },
    setHasReviewed: (state, action: PayloadAction<StoreState['hasReviewed']>) => {
      if (state) {
        state.hasReviewed = action.payload;
      }
    },
    setLastLocalSync: (state, action: PayloadAction<StoreState['lastLocalSync']>) => {
      if (state) {
        state.lastLocalSync = action.payload;
      }
    }, 
    setLastRemoteSync: (state, action: PayloadAction<StoreState['lastRemoteSync']>) => {
      if (state) {
        state.lastRemoteSync = action.payload;
      }
    },
    setLastRequestForReview: (state, action: PayloadAction<StoreState['lastRequestForReview']>) => {
      if (state) {
        state.lastRequestForReview = action.payload;
      }
    },
    setLetterSpacing: (state, action: PayloadAction<StoreState['letterSpacing']>) => {
      if (state) {
        state.letterSpacing = action.payload;
      }
    },
    setLineHeightMultiplier: (state, action: PayloadAction<StoreState['lineHeightMultiplier']>) => {
      if (state) {
        state.lineHeightMultiplier = action.payload;
      }
    },
    setLocale: (state, action: PayloadAction<StoreState['locale']>) => {
      if (state) {
        state.locale = action.payload;
      }
    },
    setPreferredReadingFormat: (state, action: PayloadAction<StoreState['preferredReadingFormat']>) => {
      if (state) {
        state.preferredReadingFormat = action.payload;
      }
    },
    setPreferredShortPressFormat: (state, action: PayloadAction<StoreState['preferredShortPressFormat']>) => {
      if (state) {
        state.preferredShortPressFormat = action.payload;
      }
    },
    setPushNotifications: (state, action: PayloadAction<StoreState['pushNotifications']>) => {
      if (state) {
        state.pushNotifications = action.payload;
      }
    },
    setPushNotificationsEnabled: (state, action: PayloadAction<StoreState['pushNotificationsEnabled']>) => {
      if (state) {
        state.pushNotificationsEnabled = action.payload;
      }
    },
    setReadNotifications: (state, action: PayloadAction<StoreState['readNotifications']>) => {
      if (state) {
        state.readNotifications = action.payload;
      }
    },
    setReadRecaps: (state, action: PayloadAction<StoreState['readRecaps']>) => {
      if (state) {
        state.readRecaps = action.payload;
      }
    },
    setRecapTranslations: (state, action: PayloadAction<StoreState['recapTranslations']>) => {
      if (state) {
        state.recapTranslations = action.payload;
      }
    },
    setRotationLock: (state, action: PayloadAction<StoreState['rotationLock']>) => {
      if (state) {
        state.rotationLock = action.payload;
      }
    },
    setSearchHistory: (state, action: PayloadAction<StoreState['searchHistory']>) => {
      if (state) {
        state.searchHistory = action.payload;
      }
    },
    setSentimentEnabled: (state, action: PayloadAction<StoreState['sentimentEnabled']>) => {
      if (state) {
        state.sentimentEnabled = action.payload;
      }
    },
    setShowShortSummary: (state, action: PayloadAction<StoreState['showShortSummary']>) => {
      if (state) {
        state.showShortSummary = action.payload;
      }
    },
    setUserData: (state, action: PayloadAction<StoreState['userData']>) => {
      if (state) {
        state.userData = action.payload;
      }
    },
    setUuid: (state, action: PayloadAction<StoreState['uuid']>) => {
      if (state) {
        state.uuid = action.payload;
      }
    },
    setViewedFeatures: (state, action: PayloadAction<StoreState['viewedFeatures']>) => {
      if (state) {
        state.viewedFeatures = action.payload;
      }
    },
  },
});

export const {
  setColorScheme,
  setCompactSummaries,
  setFontFamily,
  setFontSizeOffset,
  setHasReviewed,
  setLineHeightMultiplier,
  setLocale,
  setPreferredReadingFormat,
  setPreferredShortPressFormat,
  setPushNotifications,
  setPushNotificationsEnabled,
  setReadRecaps,
  setRecapTranslations,
  setRotationLock,
  setSearchHistory,
  setSentimentEnabled,
  setShowShortSummary,
  setViewedFeatures,
  setFcmToken,
  setLastLocalSync,
  setLastRemoteSync,
  setLastRequestForReview,
  setLetterSpacing,
  setUserData,
  setUuid,
} = preferenceSlice.actions;