import React from 'react';

import { SheetManager, SheetProps } from 'react-native-actions-sheet';

import {
  Button,
  Divider,
  Markdown,
  Text,
  View,
  Walkthrough,
} from '~/components';
import { SessionContext, TimelineEvent } from '~/core';
import { strings } from '~/locales';

export function SharingWalkthrough(props: SheetProps) {
  
  const { setStoredValue } = React.useContext(SessionContext);

  const onDone = React.useCallback(async () => {
    setStoredValue('viewedFeatures', (prev) => {
      const state = { ...prev };
      state[props.sheetId] = new TimelineEvent(true);
      return (prev = state);
    });
    await SheetManager.hide(props.sheetId);
  }, [props.sheetId, setStoredValue]);
  
  const steps = React.useMemo(() => [
    {
      body: (
        <View itemsCenter gap={ 12 }>
          <Markdown>{strings.walkthroughs_promoCodeDescription}</Markdown>
          <Divider />
          <Text subtitle1 bold textCenter>READLESSFIRST500</Text>
          <Button
            elevated
            p={ 6 }
            beveled
            onPress={ onDone }>
            {strings.misc_awesome}
          </Button>
        </View>
      ),
      title: strings.walkthroughs_promoCodeTitle,
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