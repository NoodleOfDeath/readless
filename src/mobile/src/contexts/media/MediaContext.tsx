
import React from 'react';
import { DeviceEventEmitter } from 'react-native';

import { formatDistance } from 'date-fns';
import TrackPlayer, {
  Capability,
  Event,
  Track as RNTrack,
  State,
  useTrackPlayerEvents,
} from 'react-native-track-player';
import Tts, { Voice } from 'react-native-tts-export';

import {
  DEFAULT_MEDIA_CONTEXT,
  Track,
  deviceLanguage,
} from './types';

import { PublicSummaryAttributes } from '~/api';

export const PlaybackService = async () => {
  try {
    await TrackPlayer.setupPlayer();
    await TrackPlayer.updateOptions({
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
  
  // TTS
  const [voices, setVoices] = React.useState<Voice[]>([]);
  const [selectedVoiceIndex, setSelectedVoice] = React.useState(0);
  const [speechRate, setSpeechRate] = React.useState(0.5);
  const [speechPitch, setSpeechPitch] = React.useState(1);
  const [speechVolume, setSpeechVolume] = React.useState(1);

  // Track Player
  const [trackState, setTrackState] = React.useState<State>(State.None);
  const [currentTrackIndex, setCurrentTrackIndex] = React.useState<number>();
  const [currentTrack, setCurrentTrack] = React.useState<Track>();
  const [tracks, setTracks] = React.useState<Track[]>([]);
  const [cacheMap, setCacheMap] = React.useState<Record<string, boolean>>({});
  const [preloadCount] = React.useState(3);
  const [isPreloaded, setIsPreloaded] = React.useState(false);

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
      if (state) {
        setTrackState(state);
      }
      if (currentTrack) {
        setCurrentTrackIndex(currentTrack);
      }
      if (track) {
        setCurrentTrack(track);
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
    }
  }, []);

  const playTrack = React.useCallback(async () => {
    setTrackState(State.Playing);
    await TrackPlayer.play();
  }, []);

  const pauseTrack = React.useCallback(async () => {
    setTrackState(State.Paused);
    await TrackPlayer.pause();
  }, []);

  const stopAndClearTracks = React.useCallback(async () => {
    setCurrentTrack(undefined);
    setTrackState(State.Stopped);
    setCurrentTrackIndex(undefined);
    setTracks([]);
    setCacheMap({});
    await TrackPlayer.reset();
  }, []);

  React.useEffect(() => {
    // Set up TTS player
    Tts.setDefaultRate(speechRate);
    Tts.setDefaultPitch(speechPitch);
    Tts.getInitStatus().then(initTts);
    Tts.addEventListener('tts-finish', () => {
      // placeholder
    });
    Tts.addEventListener('tts-cancel', () => {
      // placeholder
    });
    Tts.addEventListener('tts-start', () => {
      // placeholder
    });
  }, [initTts, speechPitch, speechRate]);
  
  const generateTrack = React.useCallback(async (
    track: Track
  ): Promise<RNTrack> => {
    const file = await Tts.export(track.text, {
      filename: track.id, 
      overwrite: true, 
    } );
    return {
      cached: true,
      url: file,
      ...track,
    };
  }, []);

  const preload = React.useCallback(async () => {
    setIsPreloaded(false);
    const trackIndex = currentTrackIndex ?? 0;
    const updatedTracks: string[] = [];
    for (let i = trackIndex; i < Math.min(tracks.length, trackIndex + preloadCount); i++) {
      const track = tracks[i];
      if (!cacheMap[track.id]) {
        const newTrack = await generateTrack(track);
        updatedTracks.push(newTrack.id);
        await TrackPlayer.add(newTrack);
      }
    }
    DeviceEventEmitter.emit('media-preload');
    setIsPreloaded(true);
    setCacheMap((prev) => { 
      const state = { ...prev };
      for (const track of updatedTracks) {
        state[track] = true;
      }
      return (prev = state);
    });
  }, [cacheMap, currentTrackIndex, generateTrack, preloadCount, tracks]);
  
  React.useEffect(() => {
    preload();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackIndex, tracks]);

  React.useEffect(() => {
    const subscription = DeviceEventEmitter.addListener('media-preload', () =>{
      console.log('Preload event received');
      if (trackState !== State.Paused) {
        playTrack();
      }
    });
    return () => {
      subscription.remove();
    };
  }, [playTrack, trackState]);

  const queueSummary = React.useCallback(
    async (summary: PublicSummaryAttributes | PublicSummaryAttributes[]) => {
      const tracks: Track[] = [];
      const summaries = Array.isArray(summary) ? summary : [summary];
      for (const summary of summaries) {
        const timeAgo = formatDistance(new Date(summary.originalDate ?? 0), new Date(), { addSuffix: true });
        const text = [
          `From ${summary.outlet.displayName} ${timeAgo}:`,
          summary.title,
        ].join('\n');
        const newTrack = {
          artist: summary.outlet.displayName,
          artwork: summary.imageUrl ?? 'https://www.readless.ai/AppIcon.png',
          headers: {},
          id: ['summary', summary.id].join('-'),
          summary,
          text,
          title: summary.title,
          //url: audioStreamURI(summary) || summary.media?.[0]?.url,
        };
        tracks.push(newTrack);
      }
      setTracks((prev) => {
        const state = [...prev, ...tracks.filter((t) => !prev.some((p) => p.id === t.id))];
        return state;
      });
    },
    []
  );
  
  return (
    <MediaContext.Provider value={ {
      canSkipToNext,
      canSkipToPrevious,
      currentTrack,
      currentTrackIndex,
      deviceLanguage,
      isPreloaded,
      pauseTrack,
      playTrack,
      preloadCount,
      queueSummary,
      selectedVoice: voices[selectedVoiceIndex],
      selectedVoiceIndex,
      setSelectedVoice,
      setSpeechPitch,
      setSpeechRate,
      setSpeechVolume,
      speechPitch,
      speechRate,
      speechVolume,
      stopAndClearTracks,
      trackState,
      tracks,
      voices,
    } }>
      {children}
    </MediaContext.Provider>
  );
}
