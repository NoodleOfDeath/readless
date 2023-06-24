import React from 'react';

import { SheetManager, SheetProps } from 'react-native-actions-sheet';

import {
  Button,
  Chip,
  Divider,
  Markdown,
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
          <Markdown subtitle1 textCenter system>{strings.walkthroughs_promoCodeDescription}</Markdown>
          <Divider />
          <Chip
            h4
            contained
            system
            bold
            textCenter>
            READLESSFIRST500
          </Chip>
          <Button
            contained
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
      payload={ { onDone, steps } } />
  );
}