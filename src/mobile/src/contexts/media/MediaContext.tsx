
import React from 'react';

import Tts, { Voice } from 'react-native-tts';

import {
  DEFAULT_MEDIA_CONTEXT,
  TtsStatus,
  deviceLanguage,
} from './types';

export const MediaContext = React.createContext(DEFAULT_MEDIA_CONTEXT);

type Props = React.PropsWithChildren;

export function MediaContextProvider({ children }: Props) {
  
  const [voices, setVoices] = React.useState<Voice[]>([]);
  const [ttsStatus, setTtsStatus] = React.useState<TtsStatus>('initializing');
  const [selectedVoiceIndex, setSelectedVoice] = React.useState(0);
  const [speechRate, setSpeechRate] = React.useState(0.5);
  const [speechPitch, setSpeechPitch] = React.useState(1);
  const [speechVolume, setSpeechVolume] = React.useState(1);
  
  const initTts = React.useCallback(async () => {
    const voices = await Tts.voices();
    const availableVoices = voices?.filter((v) => 
      !v.networkConnectionRequired && !v.notInstalled && v.language === deviceLanguage);
    if (availableVoices && availableVoices.length > 0) {
      try {
        await Tts.setDefaultLanguage(deviceLanguage);
      } catch (err) {
        //Samsung S9 has always this error:
        //"Language is not supported"
        console.log('setDefaultLanguage error ', err);
      }
      setVoices(availableVoices);
      const defaultVoice = voices?.findIndex((v) => /Aaron/i.test(v.name)) ?? 0;
      console.log(defaultVoice);
      setSelectedVoice(defaultVoice);
      setTtsStatus('ready');
    } else {
      setTtsStatus('ready');
    }
  }, []);

  React.useEffect(() => {
    Tts.addEventListener(
      'tts-start',
      (_event) => setTtsStatus('started')
    );
    Tts.addEventListener(
      'tts-finish',
      (_event) => setTtsStatus('finished')
    );
    Tts.addEventListener(
      'tts-cancel',
      (_event) => setTtsStatus('cancelled')
    );
    Tts.setDefaultRate(speechRate);
    Tts.setDefaultPitch(speechPitch);
    Tts.getInitStatus().then(initTts);
    return () => {
      Tts.removeEventListener(
        'tts-start',
        (_event) => setTtsStatus('started')
      );
      Tts.removeEventListener(
        'tts-finish',
        (_event) => setTtsStatus('finished')
      );
      Tts.removeEventListener(
        'tts-cancel',
        (_event) => setTtsStatus('cancelled')
      );
    };
  }, [initTts, speechPitch, speechRate]);

  const readText = React.useCallback(async (text: string) => {
    Tts.stop();
    Tts.speak(text);
  }, []);

  const cancel = React.useCallback(async () => {
    Tts.stop();
  }, []);
  
  return (
    <MediaContext.Provider value={ {
      cancel,
      deviceLanguage,
      readText,
      selectedVoice: voices[selectedVoiceIndex],
      selectedVoiceIndex,
      setSelectedVoice,
      setSpeechPitch,
      setSpeechRate,
      setSpeechVolume,
      setTtsStatus,
      setVoices,
      speechPitch,
      speechRate,
      speechVolume,
      ttsStatus,
      voices,
    } }>
      {children}
    </MediaContext.Provider>
  );
}