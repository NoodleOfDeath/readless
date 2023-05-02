import { AppRegistry, Platform } from 'react-native';

import TrackPlayer from 'react-native-track-player';

import { name as appName } from './app.json';

import App from '~/App';
import { PlaybackService } from '~/contexts';

AppRegistry.registerComponent(appName, () => App);
TrackPlayer.registerPlaybackService(() => PlaybackService);

if (Platform.OS === 'android') {
  TrackPlayer.setupPlayer();
}