import React from 'react';

import {
  Button,
  ScrollView,
  TextInput,
  View,
  ViewProps,
} from '~/components';
import { Bookmark, SessionContext } from '~/contexts';
import { strings } from '~/locales';

type TriggerWordPickerProps = Omit<ViewProps, 'children'> & {
  onSubmit: () => void;
};

export function TriggersWordPicker({ onSubmit }: TriggerWordPickerProps) {

  const { triggerWords, setPreference } = React.useContext(SessionContext);
  
  const [words, setWords] = React.useState([...Object.entries({ ...triggerWords }).map(([word, replacement]) => [word, replacement.item]), ['', '']]);

  const save = React.useCallback(() => {
    setPreference('triggerWords', Object.fromEntries(words.map(([word, replacement]) => [word.toLowerCase().replace(/[\n\s\t]+/g, ' '), new Bookmark(replacement)])));
    onSubmit();
  }, [setPreference, words, onSubmit]);

  return (
    <View gap={ 12 }>
      <ScrollView>
        {words.map(([word, replacement], i) => (
          <View key={ i } row gap={ 6 } alignCenter>
            <TextInput
              flex={ 1 }
              label={ strings.walkthroughs_triggerWords_word }
              onChangeText={ (text) => setWords((prev) => {
                const state = [ ...prev ];
                state[i][0] = text;
                return (prev = state);
              }) }
              value={ word } />
            <TextInput
              flex={ 1 }
              label={ strings.walkthroughs_triggerWords_emoji }
              onChangeText={ (text) => setWords((prev) => {
                const state = [ ...prev ];
                state[i][1] = text;
                return (prev = state);
              }) }
              value={ replacement } />
            <Button
              disabled={ words.length === 1 && i === 0 }
              startIcon="trash-can"
              iconSize={ 24 }
              haptic
              onPress={ () => setWords((prev) => {
                const state = [ ...prev ];
                state.splice(i, 1);
                return (prev = state);
              }) } />
            <Button
              startIcon="plus"
              iconSize={ 24 }
              haptic
              onPress={ () => setWords((prev) => {
                const state = [ ...prev ];
                state.push([ '', '' ]);
                return (prev = state);
              }) } />
          </View>
        ))}
      </ScrollView>
      <Button
        alignCenter
        justifyCenter
        flexRow
        rounded
        pv={ 4 }
        elevated
        fontSize={ 24 }
        disabled={ words.filter(([word, replacement]) => word && replacement).length === 0 }
        onPress={ save }>
        { strings.action_save }
      </Button>
    </View>
  );
}