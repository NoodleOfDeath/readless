import React from 'react';

import {
  AVAILABLE_FONTS,
  Button,
  ScrollView,
  Switch,
  Text,
  View,
} from '~/components';
import { SessionContext } from '~/contexts';
import { strings } from '~/locales';

export function FontSelector() {
  
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
            <Text fontFamily={ font }>{font}</Text>
          </Button>
        ))}
      </View>
    </ScrollView>
  );
}