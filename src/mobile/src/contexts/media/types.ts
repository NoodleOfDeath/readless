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
  navigation?: any;
  selectedVoice?: Voice;
  selectedVoiceIndex: number;
  speechRate: number;
  speechPitch: number;
  speechVolume: number;
  ttsStatus: TtsStatus;
  voices: Voice[];
  cancelTts: () => Promise<void>;
  readText: (text: string, firstResponder: string) => Promise<void>;
  setFirstResponder: React.Dispatch<React.SetStateAction<string>>;
  setNavigation: React.Dispatch<React.SetStateAction<any>>;
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
  firstResponder: '',
  readText: () => Promise.resolve(),  
  selectedVoiceIndex: 0,
  setFirstResponder: () => {
    /** placeholder */
  },
  setNavigation: () => {
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
