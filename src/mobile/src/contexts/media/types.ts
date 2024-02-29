import React from 'react';
import { NativeModules, Platform } from 'react-native';

import { Track as RNTrack, State } from 'react-native-track-player';
import {  Voice } from 'react-native-tts-export';

import { API, PublicSummaryGroup } from '~/api';

export const deviceLanguage = (
  Platform.OS === 'ios' ? NativeModules.SettingsManager.settings.AppleLocale || NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
    : NativeModules.I18nManager.localeIdentifier
).replace(/_/g, '-');

export type Track = Omit<RNTrack, 'url'> & {
  id: string;
  text: string;
  summary: PublicSummaryGroup;
  altText?: string;
  url?: string;
};

export type MediaContextType = {
  deviceLanguage: string;
  selectedVoice?: Voice;
  speechRate: number;
  speechPitch: number;
  speechVolume: number;
  voices: Voice[];
  trackState: State;
  currentTrackIndex?: number;
  currentTrack?: Track;
  tracks: Track[];
  canSkipToPrevious: boolean;
  canSkipToNext: boolean;
  preloadCount: number;
  isPreloaded: boolean;
  stream?: typeof API.getSummaries;
  queueStream: (stream: typeof API.getSummaries, options?: Parameters<typeof API.getSummaries>[0]) => void;
  queueSummary: (summary: PublicSummaryGroup | PublicSummaryGroup[], autoplay?: boolean) => void;
  playTrack: () => Promise<void>;
  pauseTrack: () => Promise<void>;
  stopAndClearTracks: () => Promise<void>;
  setSpeechRate: React.Dispatch<React.SetStateAction<number>>;
  setSpeechPitch: React.Dispatch<React.SetStateAction<number>>;
  setSpeechVolume: React.Dispatch<React.SetStateAction<number>>;
  setSelectedVoice: React.Dispatch<React.SetStateAction<Voice | undefined>>;
};

export const DEFAULT_MEDIA_CONTEXT: MediaContextType = {
  canSkipToNext: false,
  canSkipToPrevious: false,
  deviceLanguage,
  isPreloaded: false,
  pauseTrack: () => Promise.resolve(),
  playTrack: () => Promise.resolve(),
  preloadCount: 3,
  queueStream: () => Promise.resolve([]),
  queueSummary: () => Promise.resolve(),
  setSelectedVoice: () => Promise.resolve(),
  setSpeechPitch: () => Promise.resolve(),
  setSpeechRate: () => Promise.resolve(),
  setSpeechVolume: () => Promise.resolve(),
  speechPitch: 1,
  speechRate: 0.5,
  speechVolume: 1,
  stopAndClearTracks: () => Promise.resolve(),
  trackState: State.None,
  tracks: [],
  voices: [],
};
