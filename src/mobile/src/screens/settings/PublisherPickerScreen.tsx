import React from 'react';

import { useFocusEffect } from '@react-navigation/native';

import { PublisherPicker, Screen } from '~/components';
import { SessionContext } from '~/contexts';
import { useNavigation } from '~/hooks';

export function PublisherPickerScreen() {

  const { navigation } = useNavigation();
  const { setPreference } = React.useContext(SessionContext);

  const pickerRef = React.useRef<{ value: string[] }>(null);

  useFocusEffect(React.useCallback(() => {
    navigation?.addListener('beforeRemove', async () => {
      const { value } = pickerRef.current ?? {};
      setPreference('followedPublishers', Object.fromEntries(value?.map((publisher) => [publisher, true]) ?? []));
    });
  }, [pickerRef, navigation, setPreference]));

  return (
    <Screen safeArea>
      <PublisherPicker ref={ pickerRef } />
    </Screen>
  );
}