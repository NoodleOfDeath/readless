
import React from 'react';

import {
  Button,
  ScrollView,
  View,
} from '~/components';
import { MediaContext } from '~/contexts';

export function VoicePicker() {
  
  const {
    selectedVoice,
    setSelectedVoice,
    voices,
  } = React.useContext(MediaContext);

  return (
    <ScrollView horizontal style={ { overflow: 'visible' } }>
      <View>
        <View row alignCenter gap={ 8 } mx={ 8 }>
          {voices?.map((voice) => (
            <Button
              row
              caption
              alignCenter
              gap={ 4 }
              key={ voice.id }
              elevated
              p={ 8 }
              leftIcon={ voice.id === selectedVoice?.id ? 'check' : undefined }
              onPress={ () => setSelectedVoice(voice) }>
              {voice.name}
            </Button>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}