
import React from 'react';
import { DeviceEventEmitter } from 'react-native';

import { formatDistance } from 'date-fns';
import ms from 'ms';
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

import { API, PublicSummaryGroup } from '~/api';

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
  const [selectedVoice, setSelectedVoice] = React.useState<Voice>();
  const [speechRate, setSpeechRate] = React.useState(0.5);
  const [speechPitch, setSpeechPitch] = React.useState(1);
  const [speechVolume, setSpeechVolume] = React.useState(1);

  // Streaming
  const [stream, setStream] = React.useState<typeof API.getSummaries>();
  const [streamOffset, setStreamOffset] = React.useState(0);
  const [totalResultCount, setTotalResultCount] = React.useState(0);
  const [fetchOptions, setFetchOptions] = React.useState<Parameters<typeof API.getSummaries>[0]>();
  const [lastFetch, setLastFetch] = React.useState(0);
  
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
  
  const initTts = React.useCallback(async () => {
    await Tts.setDefaultRate(speechRate);
    await Tts.setDefaultPitch(speechPitch);
    await Tts.getInitStatus();
    const voices = await Tts.voices();
    const availableVoices = voices?.filter((v) => 
      !v.networkConnectionRequired && !v.notInstalled);
    if (availableVoices && availableVoices.length > 0) {
      try {
        await Tts.setDefaultLanguage(deviceLanguage);
      } catch (err) {
        //Samsung S9 has always this error:
        //"Language is not supported"
        console.error('setDefaultLanguage error ', err);
      }
      setVoices(availableVoices);
      const defaultVoice = selectedVoice ?? voices?.find((v) => /aaron/i.test(v.name));
      await Tts.setDefaultVoice(defaultVoice?.id ?? availableVoices[0].id);
    }
  }, [speechPitch, speechRate, selectedVoice]);

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
    initTts();
    const listener = () => {
      // placeholder
    };
    Tts.addEventListener('tts-finish', listener);
    Tts.addEventListener('tts-cancel', listener);
    Tts.addEventListener('tts-start', listener);
  }, [initTts]);
  
  const generateTrack = React.useCallback(async (
    track: Track
  ): Promise<RNTrack> => {
    const file = await Tts.export(track.text, {
      filename: track.id, 
      overwrite: true,
    } );
    return {
      cached: true,
      ...track,
      url: file,
    };
  }, []);

  const preload = React.useCallback(async () => {
    setIsPreloaded(false);
    const trackIndex = currentTrackIndex ?? 0;
    const updatedTracks: string[] = [];
    for (let i = trackIndex; i < Math.min(tracks.length, trackIndex + preloadCount); i++) {
      const track = tracks[i];
      if (track.url) {
        updatedTracks.push(track.id);
        await TrackPlayer.add(track as RNTrack);
        continue;
      }
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

  const queueSummary = React.useCallback(
    async (summary: PublicSummaryGroup | PublicSummaryGroup[]) => {
      const tracks: Track[] = [];
      const summaries = Array.isArray(summary) ? summary : [summary];
      for (const summary of summaries) {
        const timeAgo = formatDistance(new Date(summary.originalDate ?? 0), new Date(), { addSuffix: true });
        const text = [
          `From ${summary.publisher.displayName} ${timeAgo}:`,
          summary.title,
        ].join('\n');
        const newTrack: Track = {
          artist: summary.publisher.displayName,
          artwork: summary.imageUrl ?? 'https://www.readless.ai/AppIcon.png',
          headers: {},
          id: ['summary', summary.id].join('-'),
          summary,
          text,
          title: summary.title,
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

  const queueStream = React.useCallback((newStream: typeof API.getSummaries, options?: Parameters<typeof API.getSummaries>[0]) => {
    setStreamOffset(0);
    setTotalResultCount(0);
    setFetchOptions(options);
    setStream(() => newStream);
  }, []);

  const autoloadFromStream = React.useCallback(async () => {
    if (!stream || Date.now() - lastFetch < ms('5s')) {
      return;
    }
    if (currentTrackIndex != null && 
      (tracks.length - currentTrackIndex > preloadCount || streamOffset >= totalResultCount)) {
      return;
    }
    try {
      const { data, error } = await stream({ offset: streamOffset, ...fetchOptions });
      if (error) {
        throw error;
      }
      setLastFetch(Date.now());
      setStreamOffset((prev) => data.next ?? prev + data.rows.length);
      setTotalResultCount(data.count);
      queueSummary(data.rows);
    } catch (err) {
      console.error(err);
    }
  }, [currentTrackIndex, fetchOptions, lastFetch, preloadCount, queueSummary, stream, streamOffset, totalResultCount, tracks.length]);
  
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

  React.useEffect(() => {
    autoloadFromStream();
  }, [autoloadFromStream]);

  useTrackPlayerEvents([
    Event.PlaybackQueueEnded,
    Event.PlaybackState,
  ], async (event) => {
    if (event.type === Event.PlaybackState) {
      const { state } = await TrackPlayer.getPlaybackState();
      const currentTrack = await TrackPlayer.getActiveTrackIndex() ?? undefined;
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
      queueStream,
      queueSummary,
      selectedVoice,
      setSelectedVoice,
      setSpeechPitch,
      setSpeechRate,
      setSpeechVolume,
      speechPitch,
      speechRate,
      speechVolume,
      stopAndClearTracks,
      stream,
      trackState,
      tracks,
      voices,
    } }>
      {children}
    </MediaContext.Provider>
  );
}
