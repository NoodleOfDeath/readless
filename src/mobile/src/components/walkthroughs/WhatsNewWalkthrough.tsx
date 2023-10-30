import React from 'react';

import { SheetManager, SheetProps } from 'react-native-actions-sheet';

import {
  View,
  Walkthrough,
  WalkthroughStep,
} from '~/components';
import { DatedEvent, StorageContext } from '~/contexts';
import { strings } from '~/locales';

export function WhatsNewWalkthrough(props: SheetProps) {
  
  const { setStoredValue } = React.useContext(StorageContext);
  
  const onDone = React.useCallback(async () => {
    setStoredValue('viewedFeatures', (prev) => {
      const state = { ...prev };
      state[props.sheetId] = new DatedEvent(true);
      return (prev = state);
    });
    await SheetManager.hide(props.sheetId);
  }, [props.sheetId, setStoredValue]);
  
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