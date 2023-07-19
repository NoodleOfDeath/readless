import React from 'react';

import { Recap, Screen } from '~/components';
import { ScreenProps } from '~/screens';

export function RecapScreen({
  route,
  navigation,
}: ScreenProps<'recap'>) {
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