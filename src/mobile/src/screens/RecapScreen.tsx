import React from 'react';

import { Recap } from '~/components';
import { ScreenComponent } from '~/screens';
import { RoutedScreen } from '~/screens';

export function RecapScreen({ route }: ScreenComponent<'recap'>) {
  const recap = React.useMemo(() => route?.params?.recap, [route]);
  return (
    <RoutedScreen navigationID='newsStackNav'>
      {recap && (
        <Recap
          expanded
          recap={ recap } />
      )}
    </RoutedScreen>
  );
}