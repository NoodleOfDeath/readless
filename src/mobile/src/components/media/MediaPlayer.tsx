import React from 'react';

import TrackPlayer, { State } from 'react-native-track-player';

import {
  Banner,
  BannerProps,
  Summary,
  View,
  ViewProps,
} from '~/components';
import { MediaContext } from '~/contexts';

type MediaPlayerProps = ViewProps & Omit<BannerProps, 'actions' | 'children'>;

export function MediaPlayer(props: MediaPlayerProps) {

  const {
    canSkipToPrevious, canSkipToNext, currentTrack, trackState, playTrack, pauseTrack, stopAndClearTracks, 
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
          onPress: handleSkipToPrevious,
        },
        {
          icon: trackState === State.Playing ? 'pause' : 'play',
          onPress: trackState === State.Playing ? pauseTrack : playTrack,
        },
        {
          icon: 'stop',
          onPress: stopAndClearTracks,
        },
        {
          disabled: !canSkipToNext,
          icon: 'skip-next',
          onPress: handleSkipToNext,
        },
      ] }>
      <View>
        {currentTrack && (
          <Summary 
            forceStatic
            swipeable={ false }
            summary={ currentTrack.summary } />
        )}
      </View>
    </Banner>
  );
}
