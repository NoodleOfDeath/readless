import React from 'react';

import { Banner, BannerProps } from 'react-native-paper';
import TrackPlayer, { State } from 'react-native-track-player';

import { Summary, ViewProps } from '~/components';
import { MediaContext } from '~/contexts';
import { useTheme } from '~/hooks';

type MediaPlayerProps = ViewProps & Omit<BannerProps, 'children'>;

export function MediaPlayer(props: MediaPlayerProps) {

  const theme = useTheme();

  const {
    currentTrack, trackState, playTrack, stopAndClearTracks, 
  } = React.useContext(MediaContext);

  const style = React.useMemo(() => ({ backgroundColor: theme.colors.primary }), [theme.colors.primary]);

  const handleSkipToPrevious = React.useCallback(async () => {
    await TrackPlayer.skipToPrevious();
  }, []);
  
  const handleSkipToNext = React.useCallback(async () => {
    await TrackPlayer.skipToNext();
  }, []);

  return (
    <Banner
      { ...props } 
      contentStyle={ style }
      actions={ [
        {
          icon: 'skip-previous',
          label: 'previous',
          mode: 'outlined',
          onPress: handleSkipToPrevious,
          style: { marginBottom: 16, marginHorizontal: 4 },
          textColor: theme.colors.contrastText,
        },
        {
          icon: trackState === State.Playing ? 'pause' : 'play',
          label: trackState === State.Playing ? 'pause' : 'play',
          mode: 'outlined',
          onPress: playTrack,
          style: { marginBottom: 16, marginHorizontal: 4 },
          textColor: theme.colors.contrastText,
        },
        {
          icon: 'stop',
          label: 'stop',
          mode: 'outlined',
          onPress: stopAndClearTracks,
          style: { marginBottom: 16, marginHorizontal: 4 },
          textColor: theme.colors.contrastText,
        },
        {
          icon: 'skip-next',
          label: 'next',
          mode: 'outlined',
          onPress: handleSkipToNext,
          style: { marginBottom: 16, marginHorizontal: 4 },
          textColor: theme.colors.contrastText,
        },
      ] }>
      {currentTrack?.data && (
        <Summary
          forceStatic
          swipeable={ false }
          summary={ currentTrack?.data } />
      )}
    </Banner>
  );
}
