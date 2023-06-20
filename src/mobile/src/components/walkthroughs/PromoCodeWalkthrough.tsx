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
import { Bookmark, SessionContext } from '~/core';
import { strings } from '~/locales';

export function PromoCodeWalkthrough(props: SheetProps) {
  
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
        <View itemsCenter gap={ 24 }>
          <Markdown subtitle1 textCenter>{strings.walkthroughs_promoCodeDescription}</Markdown>
          <Divider />
          <Text
            h4
            elevated
            p={ 6 }
            rounded
            bold
            textCenter>
            READLESSFIRST500
          </Text>
          <Button
            elevated
            p={ 6 }
            rounded
            onPress={ onDone }>
            {'Awesome!'}
          </Button>
        </View>
      ),
      title: strings.walkthroughs_promoCodeTitle,
    },
  ], [onDone]);

  return (
    <Walkthrough
      { ...props }
      payload={ { onDone, steps } } />
  );
}