import React from 'react';

import { useFocusEffect } from '@react-navigation/native';

import { PublisherPicker, Screen } from '~/components';
import { SessionContext } from '~/contexts';
import { useNavigation } from '~/hooks';

export function PublisherPickerScreen() {

  const { navigation } = useNavigation();
  const { setStoredValue } = React.useContext(SessionContext);

  const pickerRef = React.useRef<{ value: string[] }>(null);

  useFocusEffect(React.useCallback(() => {
    navigation?.addListener('beforeRemove', async () => {
      const { value = [] } = pickerRef.current ?? {};
      setStoredValue('followedPublishers', (prev) => {
        const removed = Object.keys({ ...prev }).filter((publisher) => !value.includes(publisher)) ?? [];
        setStoredValue('favoritedPublishers', (favorited) => {
          const state = { ...favorited };
          for (const publisher of removed) {
            delete state[publisher];
          }
          return (favorited = state);
        });
        return (prev = Object.fromEntries(value.map((publisher) => [publisher, true]) ?? []));
      });
    });
  }, [pickerRef, navigation, setStoredValue]));

  return (
    <Screen safeArea>
      <PublisherPicker ref={ pickerRef } />
    </Screen>
  );
}