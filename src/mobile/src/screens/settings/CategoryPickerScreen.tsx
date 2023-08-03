import React from 'react';

import { useFocusEffect } from '@react-navigation/native';

import { CategoryPicker, Screen } from '~/components';
import { SessionContext } from '~/contexts';
import { useNavigation } from '~/hooks';

export function CategoryPickerScreen() {

  const { navigation } = useNavigation();
  const { setPreference } = React.useContext(SessionContext);

  const pickerRef = React.useRef<{ value: string[] }>(null);

  useFocusEffect(React.useCallback(() => {
    navigation?.addListener('beforeRemove', async () => {
      const { value } = pickerRef.current ?? {};
      setPreference('followedCategories', Object.fromEntries(value?.map((category) => [category, true]) ?? []));
    });
  }, [pickerRef, navigation, setPreference]));

  return (
    <Screen safeArea>
      <CategoryPicker ref={ pickerRef } />
    </Screen>
  );
}