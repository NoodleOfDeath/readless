import React from 'react';

import {
  Button,
  ChildlessViewProps,
  Chip,
  ScrollView,
  TextInput,
  View,
} from '~/components';
import { SessionContext } from '~/contexts';
import { strings } from '~/locales';

type TriggerWordPickerProps = ChildlessViewProps & {
  onSubmit?: () => void;
  saveLabel?: string;
};

export function TriggerWordPicker({ 
  onSubmit,
  saveLabel = strings.action_save,
}: TriggerWordPickerProps) {

  const { triggerWords, setPreference } = React.useContext(SessionContext);
  
  const [words, setWords] = React.useState([...Object.entries({ ...triggerWords }).map(([word, replacement]) => [word, replacement]), ['', '']]);

  const save = React.useCallback(() => {
    if (words.every(([word, replacement]) => !word && !replacement)) {
      setPreference('triggerWords', undefined);
      onSubmit?.();
    }
    setPreference('triggerWords', Object.fromEntries(words.map(([word, replacement]) => [word.toLowerCase().replace(/[\n\s\t]+/g, ' '), replacement])));
    onSubmit?.();
  }, [setPreference, words, onSubmit]);

  return (
    <View gap={ 12 }>
      <Chip system contained>
        {strings.settings_enterYourTriggerWords}
      </Chip>
      <ScrollView>
        {words.map(([word, replacement], i) => (
          <View key={ i } row gap={ 6 } itemsCenter>
            <TextInput
              flex={ 1 }
              label={ strings.settings_triggerWord }
              onChangeText={ (text) => setWords((prev) => {
                const state = [ ...prev ];
                state[i][0] = text;
                return (prev = state);
              }) }
              value={ word } />
            <TextInput
              flex={ 1 }
              label={ strings.settings_replacement }
              onChangeText={ (text) => setWords((prev) => {
                const state = [ ...prev ];
                state[i][1] = text;
                return (prev = state);
              }) }
              value={ replacement } />
            <Button
              disabled={ words.length === 1 && i === 0 }
              leftIcon="trash-can"
              iconSize={ 24 }
              haptic
              system
              contained
              onPress={ () => setWords((prev) => {
                const state = [ ...prev ];
                state.splice(i, 1);
                return (prev = state);
              }) } />
          </View>
        ))}
      </ScrollView>
      <Button
        leftIcon="plus"
        iconSize={ 24 }
        haptic
        system
        contained
        onPress={ () => setWords((prev) => {
          const state = [ ...prev ];
          state.push([ '', '' ]);
          return (prev = state);
        }) } />
      <Button
        system
        contained
        fontSize={ 24 }
        onPress={ save }>
        { saveLabel }
      </Button>
    </View>
  );
}