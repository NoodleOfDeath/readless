import React from 'react';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import TrackPlayer, { State } from 'react-native-track-player';

import {
  InteractionType,
  PublicSummaryGroup,
  ReadingFormat,
} from '~/api';
import {
  Banner,
  BannerProps,
  ScrollView,
  Summary,
  ViewProps,
} from '~/components';
import { MediaContext, SessionContext } from '~/contexts';
import { useApiClient } from '~/hooks';
import { RoutingParams } from '~/screens';

type MediaPlayerProps = ViewProps & Omit<BannerProps, 'actions' | 'children'> ;

export function MediaPlayer(props: MediaPlayerProps) {

  const {
    canSkipToPrevious, canSkipToNext, currentTrack, trackState, playTrack, pauseTrack, stopAndClearTracks, 
  } = React.useContext(MediaContext);
  const { preferredReadingFormat } = React.useContext(SessionContext);
  const { interactWithSummary } = useApiClient();

  const navigation = useNavigation<NativeStackNavigationProp<RoutingParams>>();

  const handleSkipToPrevious = React.useCallback(async () => {
    await TrackPlayer.skipToPrevious();
  }, []);
  
  const handleSkipToNext = React.useCallback(async () => {
    await TrackPlayer.skipToNext();
  }, []);

  const handleFormatChange = React.useCallback(
    (summary: PublicSummaryGroup, format?: ReadingFormat) => {
      interactWithSummary(summary.id, InteractionType.Read);
      navigation?.navigate('summary', {
        initialFormat: format ?? preferredReadingFormat ?? ReadingFormat.Bullets,
        summary,
      });
    },
    [interactWithSummary, navigation, preferredReadingFormat]
  );

  return (
    <Banner
      { ...props } 
      onDismiss={ () => stopAndClearTracks() }
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
      <ScrollView flexGrow={ 1 }>
        {currentTrack && (
          <Summary 
            disableInteractions
            forceShortSummary
            summary={ currentTrack.summary }
            onFormatChange={ (format) => handleFormatChange(currentTrack.summary, format) } />
        )}
      </ScrollView>
    </Banner>
  );
}
