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
import { Bookmark, SessionContext } from '~/core';
import { strings } from '~/locales';

export function TriggerWordsWalkthrough(props: SheetProps) {
  
  const { setPreference } = React.useContext(SessionContext);

  const onDone = React.useCallback(async () => {
    setPreference('viewedFeatures', (prev) => {
      const state = { ...prev };
      state[props.sheetId] = new Bookmark(true);
      return (prev = state);
    });
    await SheetManager.hide(props.sheetId);
  }, [props.sheetId, setPreference]);
  
  const steps = React.useMemo(() => [
    {
      body: (
        <View>
          <Markdown>{strings.walkthroughs_triggerWords_description}</Markdown>
          <Divider />
          <Text caption>{strings.walkthroughs_triggerWords_limitedLocalizationSupport}</Text>
        </View>
      ),
      title: strings.walkthroughs_triggerWords,
    },
    {
      body: <TriggerWordPicker onSubmit={ onDone } />,
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