
import React from 'react';

import { Portal } from 'react-native-paper';
import Tts, { Voice } from 'react-native-tts';

import {
  DEFAULT_MEDIA_CONTEXT,
  TtsStatus,
  deviceLanguage,
} from './types';

import { FAB } from '~/components';

export const MediaContext = React.createContext(DEFAULT_MEDIA_CONTEXT);

type Props = React.PropsWithChildren;

export function MediaContextProvider({ children }: Props) {

  const [voices, setVoices] = React.useState<Voice[]>([]);
  const [ttsStatus, setTtsStatus] = React.useState<TtsStatus>('initializing');
  const [selectedVoiceIndex, setSelectedVoice] = React.useState(0);
  const [speechRate, setSpeechRate] = React.useState(0.5);
  const [speechPitch, setSpeechPitch] = React.useState(1);
  const [speechVolume, setSpeechVolume] = React.useState(1);
  const [firstResponder, setFirstResponder] = React.useState('');
  
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
        console.error('setDefaultLanguage error ', err);
      }
      setVoices(availableVoices);
      const defaultVoice = voices?.findIndex((v) => /Aaron/i.test(v.name)) ?? 0;
      setSelectedVoice(defaultVoice);
      setTtsStatus('ready');
    } else {
      setTtsStatus('ready');
    }
  }, []);

  React.useEffect(() => {
    Tts.addEventListener(
      'tts-start',
      (_event) => {
        setTtsStatus('started');
      }
    );
    Tts.addEventListener(
      'tts-finish',
      (_event) => {
        setFirstResponder('');
        setTtsStatus('finished');
      }
    );
    Tts.addEventListener(
      'tts-cancel',
      (_event) => {
        setFirstResponder('');
        setTtsStatus('cancelled');
      }
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

  const readText = React.useCallback(async (text: string, firstResponder: string) => {
    setFirstResponder(firstResponder);
    Tts.stop();
    Tts.speak(text);
  }, []);

  const cancelTts = React.useCallback(async () => {
    setFirstResponder('');
    Tts.stop();
  }, []);
  
  return (
    <MediaContext.Provider value={ {
      cancelTts,
      deviceLanguage,
      firstResponder,
      readText,
      selectedVoice: voices[selectedVoiceIndex],
      selectedVoiceIndex,
      setFirstResponder,
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
      {firstResponder && (
        <Portal>
          <FAB 
            icon='stop'
            visible
            onPress={ () => cancelTts() } />
        </Portal>
      )}
    </MediaContext.Provider>
  );
}
