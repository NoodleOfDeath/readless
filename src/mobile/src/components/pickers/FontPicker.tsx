import React from 'react';

import {
  AVAILABLE_FONTS,
  Button,
  ScrollView,
  View,
} from '~/components';
import { SessionContext } from '~/contexts';

export function FontPicker() {
  
  const { fontFamily, setPreference } = React.useContext(SessionContext);
  
  return (
    <ScrollView 
      horizontal
      style={ { overflow: 'hidden', padding: 8 } }>
      <View flexRow alignCenter gap={ 8 } mh={ 8 }>
        {AVAILABLE_FONTS.map((font) => (
          <Button 
            flexRow
            caption
            alignCenter
            gap={ 4 }
            key={ font }
            elevated
            p={ 8 }
            startIcon={ fontFamily === font ? 'check' : undefined } 
            fontFamily={ font }
            onPress={ () => setPreference('fontFamily', font) }>
            {font}
          </Button>
        ))}
      </View>
    </ScrollView>
  );
}