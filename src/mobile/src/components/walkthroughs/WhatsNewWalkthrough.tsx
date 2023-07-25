import React from 'react';

import { SheetManager, SheetProps } from 'react-native-actions-sheet';

import {
  View,
  Walkthrough,
  WalkthroughStep,
} from '~/components';
import { Bookmark, SessionContext } from '~/contexts';
import { strings } from '~/locales';

export function WhatsNewWalkthrough(props: SheetProps) {
  
  const { setPreference } = React.useContext(SessionContext);
  
  const onDone = React.useCallback(async () => {
    setPreference('viewedFeatures', (prev) => {
      const state = { ...prev };
      state[props.sheetId] = new Bookmark(true);
      return (prev = state);
    });
    await SheetManager.hide(props.sheetId);
  }, [props.sheetId, setPreference]);
  
  const steps: WalkthroughStep[] = React.useMemo(() => [
    {
      content: <View />,
      title: strings.walkthroughs_whatsNew,
    },
  ], []);
  
  return (
    <Walkthrough
      { ...props }
      payload={ { onDone, steps } } />
  );
  
}