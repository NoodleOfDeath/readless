import React from 'react';
import { NativeModules, Platform } from 'react-native';

import { State } from 'react-native-track-player';
import { Voice } from 'react-native-tts-reborn';

import { PublicSummaryAttributes } from '~/api';

export const deviceLanguage = (
  Platform.OS === 'ios' ? NativeModules.SettingsManager.settings.AppleLocale || NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
    : NativeModules.I18nManager.localeIdentifier
).replace(/_/g, '-');

export type Track = {
  id: string;
  title: string;
  text: string;
  summary: PublicSummaryAttributes;
  altText?: string;
  artist?: string;
  artwork?: string;
};

export type MediaContextType = {
  deviceLanguage: string;
  selectedVoice?: Voice;
  selectedVoiceIndex: number;
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
  queueSummary: (summary: PublicSummaryAttributes | PublicSummaryAttributes[], autoplay?: boolean) => void;
  playTrack: () => Promise<void>;
  pauseTrack: () => Promise<void>;
  stopAndClearTracks: () => Promise<void>;
  setSpeechRate: React.Dispatch<React.SetStateAction<number>>;
  setSpeechPitch: React.Dispatch<React.SetStateAction<number>>;
  setSpeechVolume: React.Dispatch<React.SetStateAction<number>>;
  setSelectedVoice: React.Dispatch<React.SetStateAction<number>>;
};

export const DEFAULT_MEDIA_CONTEXT: MediaContextType = {
  canSkipToNext: false,
  canSkipToPrevious: false,
  deviceLanguage,
  isPreloaded: false,
  pauseTrack: () => Promise.resolve(),
  playTrack: () => Promise.resolve(),
  preloadCount: 3,
  queueSummary: () => {
    /** placeholder */
  },
  selectedVoiceIndex: 0,
  setSelectedVoice: () => {
    /** placeholder */
  },
  setSpeechPitch: () => {
    /** placeholder */
  },
  setSpeechRate: () => {
    /** placeholder */
  },
  setSpeechVolume: () => {
    /** placeholder */
  },
  speechPitch: 1,
  speechRate: 0.5,
  speechVolume: 1,
  stopAndClearTracks: () => Promise.resolve(),
  trackState: State.None,
  tracks: [],
  voices: [],
};
