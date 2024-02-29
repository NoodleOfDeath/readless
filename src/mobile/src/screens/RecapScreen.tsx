import React from 'react';

import { Recap, Screen } from '~/components';
import { ScreenComponent } from '~/screens';

export function RecapScreen({ route }: ScreenComponent<'recap'>) {
  const recap = React.useMemo(() => route?.params?.recap, [route]);
  return (
    <Screen>
      {recap && (
        <Recap
          expanded
          recap={ recap } />
      )}
    </Screen>
  );
}