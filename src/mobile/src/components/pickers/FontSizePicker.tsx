import React from 'react';

import { Slider } from '~/components';
import { SessionContext } from '~/contexts';

export function FontSizePicker() {
  
  const { textScale = 1, setPreference } = React.useContext(SessionContext);  
  
  return (
    <Slider
      minimumValue={ 0.75 }
      maximumValue={ 1.5 }
      value={ textScale }
      onValueChange={ (value) => setPreference('textScale', typeof value === 'number' ? value : value[0]) }
      animationType={ 'spring' } />
  );
}