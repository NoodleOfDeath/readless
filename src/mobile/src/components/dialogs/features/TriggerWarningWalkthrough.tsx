import React from 'react';

import { SheetManager, SheetProps } from 'react-native-actions-sheet';

import {
  Button,
  Text,
  TextInput,
  View,
  Walkthrough,
} from '~/components';
import { Bookmark, SessionContext } from '~/core';
import { strings } from '~/locales';

export function TriggerWarningWalkthrough(props: SheetProps) {
  
  const { setPreference } = React.useContext(SessionContext);

  const steps = React.useMemo(() => [
    (
      <View key='1'>
        <Text>{strings.features.triggerWarning.setTriggerWords}</Text>
      </View>
    ),
    (
      <View key='2'>
        <Text>{strings.features.triggerWarning.setTriggerWords}</Text>
        <View flexRow gap={ 4 }>
          <TextInput />
          <TextInput />
        </View>
      </View>
    ),
  ], []);

  const onDone = React.useCallback(async () => {
    setPreference('viewedFeatures', (prev) => {
      const state = { ...prev };
      state[props.sheetId] = new Bookmark(true);
      return (prev = state);
    });
    await SheetManager.hide(props.sheetId);
  }, [props.sheetId, setPreference]);

  return (
    <Walkthrough
      { ...props }
      payload={ { onDone, steps } } />
  );
}