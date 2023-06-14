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
  
  const { triggerWords, setPreference } = React.useContext(SessionContext);
  
  const [words, setWords] = React.useState(Object.keys({ ...triggerWords }).join(', '));

  const onSubmit = React.useCallback(() => {
    setPreference('triggerWords', (prev) => {
      const state = Object.fromEntries(words.split(',').map((word) => [word.toLowerCase().replace(/[\n\s\t]+/g, ' '), new Bookmark('🐱')]));
      alert(state);
      return (prev = state);
    });
  }, [setPreference, words]);
  
  const steps = React.useMemo(() => [
    {
      body: strings.features.triggerWarning.setTriggerWords,
      title: strings.features.triggerWarning.triggerWarning,
    },
    {
      body: (
        <View gap={ 12 }>
          <Text>{strings.features.triggerWarning.setTriggerWords}</Text>
          <TextInput
            width="100%"
            placeholder={ 'comma, separated trigger words, or phrases' }
            value={ words }
            onChange={ (value) => setWords(value) }
            onSubmitEditing={ onSubmit } />
        </View>
      ),
      title: strings.features.triggerWarning.setTriggerWords,
    },
  ], [words, onSubmit]);

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