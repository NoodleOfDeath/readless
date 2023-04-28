
import React from 'react';

import { formatDistance } from 'date-fns';
import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
  Event,
  State,
  Track,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import Tts, { Voice } from 'react-native-tts-reborn';

import {
  DEFAULT_MEDIA_CONTEXT,
  TtsStatus,
  deviceLanguage,
} from './types';

import { PublicSummaryAttributes } from '~/api';

export const PlaybackService = async () => {
  try {
    await TrackPlayer.setupPlayer({ maxCacheSize: 1024 * 5 });
    await TrackPlayer.updateOptions({
      android: { appKilledPlaybackBehavior: AppKilledPlaybackBehavior.StopPlaybackAndRemoveNotification },
      capabilities: [
        Capability.Bookmark,
        Capability.Like,
        Capability.Pause,
        Capability.Play,
        Capability.Skip,
        Capability.SkipToPrevious,
        Capability.SkipToNext,
        Capability.Stop,
      ],
    });
    TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
    TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
    TrackPlayer.addEventListener(Event.RemoteStop, () => TrackPlayer.pause());
    TrackPlayer.addEventListener(Event.RemotePrevious, () => TrackPlayer.skipToPrevious());
    TrackPlayer.addEventListener(Event.RemoteNext, () => TrackPlayer.skipToNext());
  } catch (error) {
    console.error(error);
  }
};

export const MediaContext = React.createContext(DEFAULT_MEDIA_CONTEXT);

type Props = React.PropsWithChildren;

export function MediaContextProvider({ children }: Props) {

  const [voices, setVoices] = React.useState<Voice[]>([]);
  const [ttsStatus, setTtsStatus] = React.useState<TtsStatus>('initializing');
  const [selectedVoiceIndex, setSelectedVoice] = React.useState(0);
  const [speechRate, setSpeechRate] = React.useState(0.5);
  const [speechPitch, setSpeechPitch] = React.useState(1);
  const [speechVolume, setSpeechVolume] = React.useState(1);

  const [trackState, setTrackState] = React.useState<State>(State.None);
  const [currentTrackIndex, setCurrentTrackIndex] = React.useState<number>();
  const [currentTrack, setCurrentTrack] = React.useState<Track>();
  const [tracks, setTracks] = React.useState<Track[]>([]);

  const canSkipToPrevious = React.useMemo(() => currentTrackIndex != null && currentTrackIndex > 0, [currentTrackIndex]);
  const canSkipToNext = React.useMemo(() => currentTrackIndex != null && currentTrackIndex < tracks.length - 1, [currentTrackIndex, tracks]);

  useTrackPlayerEvents([
    Event.PlaybackQueueEnded,
    Event.PlaybackState,
  ], async (event) => {
    if (event.type === Event.PlaybackState) {
      const state = await TrackPlayer.getState();
      const currentTrack = await TrackPlayer.getCurrentTrack() ?? undefined;
      const track = currentTrack != null ? tracks[currentTrack] : undefined;
      setCurrentTrackIndex(currentTrack);
      setCurrentTrack(track);
      if (state) {
        setTrackState(state);
      }
    } else
    if (event.type === Event.PlaybackQueueEnded) {
      stopAndClearTracks();
    }
  });
  
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
    // Set up the player
    Tts.addEventListener('tts-start', (_event) => setTtsStatus('started'));
    Tts.addEventListener('tts-finish', (_event) => setTtsStatus('finished'));
    Tts.addEventListener('tts-cancel', (_event) => setTtsStatus('cancelled'));
    Tts.setDefaultRate(speechRate);
    Tts.setDefaultPitch(speechPitch);
    Tts.getInitStatus().then(initTts);
    return () => {
      Tts.removeEventListener('tts-start', (_event) => setTtsStatus('started'));
      Tts.removeEventListener('tts-finish', (_event) => setTtsStatus('finished'));
      Tts.removeEventListener('tts-cancel', (_event) => setTtsStatus('cancelled'));
    };
  }, [initTts, speechPitch, speechRate]);
  
  const cancelTts = React.useCallback(async () => {
    Tts.stop();
  }, []);

  const textToTrack = React.useCallback(async (text: string, firstResponder: string, track?: Partial<Track>): Promise<Track> => {
    const file = await Tts.export(text, { filename: firstResponder, overwrite: true } );
    return {
      id: firstResponder,
      url: file,
      ...track,
    };
  }, []);
  
  const queueTrack = React.useCallback(async (track: Track | Track[]) => {
    // Add a track to the queue
    const existingTracks = await TrackPlayer.getQueue();
    const tracks = (Array.isArray(track) ? track : [track]).filter((t) => !existingTracks.find((et) => et.id === t.id));
    setTracks([...existingTracks, ...tracks]);
    await TrackPlayer.add(tracks);
  }, []);

  const queueSummary = React.useCallback(
    async (summary: PublicSummaryAttributes, altText?: string) => {
      const timeAgo = formatDistance(new Date(summary.originalDate ?? 0), new Date(), { addSuffix: true });
      const text = [
        `From ${summary.outletAttributes?.displayName} ${timeAgo}:`,
        altText ?? summary.title,
      ].join('\n');
      const track = await textToTrack(
        text,
        ['summary', summary.id].join('-'),
        {
          artist: summary.outletAttributes?.displayName,
          artwork: 'https://www.readless.ai/AppIcon.png',
          data: summary,
          title: summary.title,
        }
      );
      if (track) {
        await queueTrack(track);
      }
    },
    [queueTrack, textToTrack]
  );

  const playTrack = React.useCallback(async () => {
    if (trackState === State.Playing) {
      setTrackState(State.Paused);
      await TrackPlayer.pause();
    } else {
      setTrackState(State.Playing);
      await TrackPlayer.play();
    }
  }, [trackState]);

  const stopAndClearTracks = React.useCallback(async () => {
    setCurrentTrack(undefined);
    setTrackState(State.Stopped);
    setCurrentTrackIndex(undefined);
    setTracks([]);
    await TrackPlayer.reset();
  }, []);
  
  return (
    <MediaContext.Provider value={ {
      canSkipToNext,
      canSkipToPrevious,
      cancelTts,
      currentTrack,
      currentTrackIndex,
      deviceLanguage,
      playTrack,
      queueSummary,
      queueTrack,
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
      stopAndClearTracks,
      textToTrack,
      trackState,
      tracks,
      ttsStatus,
      voices,
    } }>
      {children}
    </MediaContext.Provider>
  );
}
