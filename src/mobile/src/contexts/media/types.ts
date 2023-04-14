import React from 'react';
import { NativeModules, Platform } from 'react-native';

import { Voice } from 'react-native-tts';

export type TtsStatus = 'ready' | 'initializing' | 'error' |'started' | 'finished' | 'cancelled';

export const deviceLanguage = (
  Platform.OS === 'ios' ? NativeModules.SettingsManager.settings.AppleLocale || NativeModules.SettingsManager.settings.AppleLanguages[0] // iOS 13
    : NativeModules.I18nManager.localeIdentifier
).replace(/_/g, '-');

export type MediaContextType = {
  deviceLanguage: string;
  firstResponder: string;
  voices: Voice[];
  ttsStatus: TtsStatus;
  selectedVoice?: Voice;
  selectedVoiceIndex: number;
  speechRate: number;
  speechPitch: number;
  speechVolume: number;
  cancelTts: () => Promise<void>;
  readText: (text: string) => Promise<void>;
  setFirstResponder: React.Dispatch<React.SetStateAction<string>>;
  setSpeechRate: React.Dispatch<React.SetStateAction<number>>;
  setSpeechPitch: React.Dispatch<React.SetStateAction<number>>;
  setSpeechVolume: React.Dispatch<React.SetStateAction<number>>;
  setSelectedVoice: React.Dispatch<React.SetStateAction<number>>;
  setVoices: React.Dispatch<React.SetStateAction<Voice[]>>;
  setTtsStatus: React.Dispatch<React.SetStateAction<TtsStatus>>;
};

export const DEFAULT_MEDIA_CONTEXT: MediaContextType = {
  cancelTts: () => Promise.resolve(),
  deviceLanguage,
  firstReaponder: '',
  readText: () => Promise.resolve(),  
  selectedVoiceIndex: 0,
  setFirstResponder: () => {
    /** placeholder */
  },
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
  ttsStatus: 'initializing',
  voices: [],
};
