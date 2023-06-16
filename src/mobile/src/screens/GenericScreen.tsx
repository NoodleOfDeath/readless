import React from 'react';

import { Screen } from '~/components';
import { ScreenProps } from '~/screens';

export function GenericScreen({
  route,
  navigation,
}: ScreenProps<'generic'>) {
  
  const { component, ...params } = React.useMemo(() => ({
    component: route?.params?.component, 
    headerRight: () => undefined,
    headerTitle: '',
    ...route?.params,
  }), [route]);

  React.useEffect(() => {
    navigation?.setOptions(params);
  }, [navigation, params]);

  return (
    <Screen>
      {component}
    </Screen>
  );
}