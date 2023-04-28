import React from 'react';

import TrackPlayer, { State } from 'react-native-track-player';

import {
  Banner,
  BannerProps,
  Summary,
  ViewProps,
} from '~/components';
import { MediaContext } from '~/contexts';

type MediaPlayerProps = ViewProps & Omit<BannerProps, 'children'>;

export function MediaPlayer(props: MediaPlayerProps) {

  const {
    canSkipToPrevious, canSkipToNext, currentTrack, trackState, playTrack, stopAndClearTracks, 
  } = React.useContext(MediaContext);

  const handleSkipToPrevious = React.useCallback(async () => {
    await TrackPlayer.skipToPrevious();
  }, []);
  
  const handleSkipToNext = React.useCallback(async () => {
    await TrackPlayer.skipToNext();
  }, []);

  return (
    <Banner
      { ...props } 
      actions={ [
        {
          disabled: !canSkipToPrevious,
          icon: 'skip-previous',
          label: 'previous',
          onPress: handleSkipToPrevious,
        },
        {
          icon: trackState === State.Playing ? 'pause' : 'play',
          label: trackState === State.Playing ? 'pause' : 'play',
          onPress: playTrack,
        },
        {
          icon: 'stop',
          label: 'stop',
          onPress: stopAndClearTracks,
        },
        {
          disabled: !canSkipToNext,
          icon: 'skip-next',
          label: 'next',
          onPress: handleSkipToNext,
        },
      ] }>
      {currentTrack?.data && (
        <Summary 
          forceStatic
          swipeable={ false }
          summary={ currentTrack.data } />
      )}
    </Banner>
  );
}
