import React from 'react';

import { Slider } from '~/components';
import { SessionContext } from '~/contexts';
import { strings } from '~/locales';

export function FontSizeSelector() {
  
  const { textScale = 1, setPreference } = React.useContext(SessionContext);  
  
  return (
    <Slider
      minimumValue={ 0.8 }
      maximumValue={ 1.2 }
      value={ textScale }
      onValueChange={ (value) => setPreference('textScale', value) } />
  );
}