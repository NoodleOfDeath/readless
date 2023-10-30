import React from 'react';

import { useFocusEffect } from '@react-navigation/native';

import { CategoryPicker, Screen } from '~/components';
import { StorageContext } from '~/contexts';
import { useNavigation } from '~/hooks';

export function CategoryPickerScreen() {

  const { navigation } = useNavigation();
  const { setStoredValue } = React.useContext(StorageContext);

  const pickerRef = React.useRef<{ value: string[] }>(null);

  useFocusEffect(React.useCallback(() => {
    navigation?.addListener('beforeRemove', async () => {
      const { value = [] } = pickerRef.current ?? {};
      setStoredValue('followedCategories', (prev) => {
        const removed = Object.keys({ ...prev }).filter((publisher) => !value.includes(publisher)) ?? [];
        setStoredValue('favoritedCategories', (favorited) => {
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
      <CategoryPicker ref={ pickerRef } />
    </Screen>
  );
}