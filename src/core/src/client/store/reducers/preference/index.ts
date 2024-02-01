import { PayloadAction, createSlice } from '@reduxjs/toolkit';

import { StoreState } from '../../types';

import { ReadingFormat, SupportedLocale } from '~/api';
import { ColorScheme } from '~/contexts';

export type PreferenceSliceState = Pick<StoreState, 'colorScheme' | 'compactSummaries' | 'fcmToken' | 'fontFamily' | 'fontSizeOffset' | 'hasReviewed' | 'lastLocalSync' | 'lastRemoteSync' | 'lastRequestForReview' | 'letterSpacing' | 'lineHeightMultiplier' | 'locale' | 'preferredReadingFormat' | 'preferredShortPressFormat' | 'pushNotifications' | 'pushNotificationsEnabled' | 'readNotifications' | 'readRecaps' | 'recapTranslations' | 'rotationLock' | 'searchHistory' | 'sentimentEnabled' | 'showShortSummary' | 'uuid' | 'viewedFeatures'
>;

const preferenceSlice = createSlice({
  initialState: null as PreferenceSliceState | null,
  name: 'preference',
  reducers: { 
    setColorScheme: (state, action: PayloadAction<ColorScheme>) => {
      if (state) {
        state.colorScheme = action.payload;
      }
    },
    setCompactSummaries: (state, action: PayloadAction<boolean>) => {
      if (state) {
        state.compactSummaries = action.payload;
      }
    },
    setFcmToken: (state, action: PayloadAction<string>) => {
      if (state) {
        state.fcmToken = action.payload;
      }
    },
    setFontFamily: (state, action: PayloadAction<string>) => {
      if (state) {
        state.fontFamily = action.payload;
      }
    },
    setFontSizeOffset: (state, action: PayloadAction<number>) => {
      if (state) {
        state.fontSizeOffset = action.payload;
      }
    },
    setHasReviewed: (state, action: PayloadAction<boolean>) => {
      if (state) {
        state.hasReviewed = action.payload;
      }
    },
    setLastLocalSync: (state, action: PayloadAction<number>) => {
      if (state) {
        state.lastLocalSync = action.payload;
      }
    },
    setLastRemoteSync: (state, action: PayloadAction<number>) => {
      if (state) {
        state.lastRemoteSync = action.payload;
      }
    },
    setLastRequestForReview: (state, action: PayloadAction<number>) => {
      if (state) {
        state.lastRequestForReview = action.payload;
      }
    },
    setLetterSpacing: (state, action: PayloadAction<number>) => {
      if (state) {
        state.letterSpacing = action.payload;
      }
    },
    setLineHeightMultiplier: (state, action: PayloadAction<number>) => {
      if (state) {
        state.lineHeightMultiplier = action.payload;
      }
    },
    setLocale: (state, action: PayloadAction<SupportedLocale>) => {
      if (state) {
        state.locale = action.payload;
      }
    },
    setPreferredReadingFormat: (state, action: PayloadAction<ReadingFormat>) => {
      if (state) {
        state.preferredReadingFormat = action.payload;
      }
    },
    setPreferredShortPressFormat: (state, action: PayloadAction<ReadingFormat>) => {
      if (state) {
        state.preferredShortPressFormat = action.payload;
      }
    },
    setPushNotifications: (state, action: PayloadAction<PreferenceSliceState>) => {
      if (state) {
        state.pushNotifications = action.payload.pushNotifications;
      }
    },
    setPushNotificationsEnabled: (state, action: PayloadAction<PreferenceSliceState>) => {
      if (state) {
        state.pushNotificationsEnabled = action.payload.pushNotificationsEnabled;
      }
    },
    setReadNotifications: (state, action: PayloadAction<PreferenceSliceState>) => {
      if (state) {
        state.readNotifications = action.payload.readNotifications;
      }
    },
    setReadRecaps: (state, action: PayloadAction<PreferenceSliceState>) => {
      if (state) {
        state.readRecaps = action.payload.readRecaps;
      }
    },
    setRecapTranslations: (state, action: PayloadAction<PreferenceSliceState>) => {
      if (state) {
        state.recapTranslations = action.payload.recapTranslations;
      }
    },
    setRotationLock: (state, action: PayloadAction<PreferenceSliceState>) => {
      if (state) {
        state.rotationLock = action.payload.rotationLock;
      }
    },
    setSearchHistory: (state, action: PayloadAction<PreferenceSliceState>) => {
      if (state) {
        state.searchHistory = action.payload.searchHistory;
      }
    },
    setSentimentEnabled: (state, action: PayloadAction<PreferenceSliceState>) => {
      if (state) {
        state.sentimentEnabled = action.payload.sentimentEnabled;
      }
    },
    setShowShortSummary: (state, action: PayloadAction<PreferenceSliceState>) => {
      if (state) {
        state.showShortSummary = action.payload.showShortSummary;
      }
    },
    setUuid: (state, action: PayloadAction<PreferenceSliceState>) => {
      if (state) {
        state.uuid = action.payload.uuid;
      }
    },
    setViewedFeatures: (state, action: PayloadAction<PreferenceSliceState>) => {
      if (state) {
        state.viewedFeatures = action.payload.viewedFeatures;
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
  setUuid,
} = preferenceSlice.actions;

export default preferenceSlice.reducer;