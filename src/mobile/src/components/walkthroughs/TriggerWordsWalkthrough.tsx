import React from 'react';

import { SheetManager, SheetProps } from 'react-native-actions-sheet';

import {
  Divider,
  Markdown,
  Text,
  TriggerWordPicker,
  View,
  Walkthrough,
} from '~/components';
import { DatedEvent, StorageContext } from '~/core';
import { strings } from '~/locales';

export function TriggerWordsWalkthrough(props: SheetProps) {
  
  const { setStoredValue } = React.useContext(StorageContext);

  const onDone = React.useCallback(async () => {
    setStoredValue('viewedFeatures', (prev) => {
      const state = { ...prev };
      state[props.sheetId] = new DatedEvent(true);
      return (prev = state);
    });
    await SheetManager.hide(props.sheetId);
  }, [props.sheetId, setStoredValue]);
  
  const steps = React.useMemo(() => [
    {
      artwork: 'https://readless.nyc3.cdn.digitaloceanspaces.com/img/guides/walkthrough-trigger-words.png',
      body: (
        <View gap={ 12 }>
          <Markdown
            subtitle1
            textCenter
            system
            contained>
            {strings.walkthroughs_triggerWords_description}
          </Markdown>
          <Divider />
          <Text caption system>{strings.walkthroughs_triggerWords_limitedLocalizationSupport}</Text>
        </View>
      ),
      title: strings.walkthroughs_triggerWords,
    },
    {
      body: <TriggerWordPicker 
        saveLabel={ strings.action_saveAndClose }
        onSubmit={ onDone } />,
      title: strings.walkthroughs_triggerWords,
    },
  ], [onDone]);

  return (
    <Walkthrough
      { ...props }
      payload={ {
        closable: true, onDone, steps, 
      } } />
  );
}