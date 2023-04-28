import React from 'react';
import { NativeModules, Platform } from 'react-native';

import { State, Track } from 'react-native-track-player';
import { Voice } from 'react-native-tts-reborn';

import { PublicSummaryAttributes } from '~/api';

export type TtsStatus = 'ready' | 'initializing' | 'error' |'started' | 'finished' | 'cancelled';

export const deviceLanguage = (
  Platform.OS === 'ios' ? NativeModules.SettingsManager.settings.AppleLocale || NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
    : NativeModules.I18nManager.localeIdentifier
).replace(/_/g, '-');

export type MediaContextType = {
  deviceLanguage: string;
  selectedVoice?: Voice;
  selectedVoiceIndex: number;
  speechRate: number;
  speechPitch: number;
  speechVolume: number;
  ttsStatus: TtsStatus;
  voices: Voice[];
  trackState: State;
  currentTrackIndex?: number;
  currentTrack?: Track;
  tracks: Track[];
  canSkipToPrevious: boolean;
  canSkipToNext: boolean;
  cancelTts: () => Promise<void>;
  textToTrack: (text: string, firstResponder: string, track?: Partial<Track>) => Promise<Track|undefined>;
  queueTrack: (track: Track) => Promise<void>;
  queueSummary: (summary: PublicSummaryAttributes, altText?: string) => Promise<void>;
  playTrack: () => Promise<void>;
  stopAndClearTracks: () => Promise<void>;
  setSpeechRate: React.Dispatch<React.SetStateAction<number>>;
  setSpeechPitch: React.Dispatch<React.SetStateAction<number>>;
  setSpeechVolume: React.Dispatch<React.SetStateAction<number>>;
  setSelectedVoice: React.Dispatch<React.SetStateAction<number>>;
  setVoices: React.Dispatch<React.SetStateAction<Voice[]>>;
  setTtsStatus: React.Dispatch<React.SetStateAction<TtsStatus>>;
};

export const DEFAULT_MEDIA_CONTEXT: MediaContextType = {
  canSkipToNext: false,
  canSkipToPrevious: false,
  cancelTts: () => Promise.resolve(),
  deviceLanguage,
  playTrack: () => Promise.resolve(),
  queueSummary: () => Promise.resolve(),
  queueTrack: () => Promise.resolve(),
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
  setTtsStatus: () => {
    /** placeholder */
  },
  setVoices: () => {
    /** placeholder */
  },
  speechPitch: 1,
  speechRate: 0.5,
  speechVolume: 1,
  stopAndClearTracks: () => Promise.resolve(),
  textToTrack: () => Promise.resolve(undefined),
  trackState: State.None,
  tracks:[],
  ttsStatus: 'initializing',
  voices: [],
};
