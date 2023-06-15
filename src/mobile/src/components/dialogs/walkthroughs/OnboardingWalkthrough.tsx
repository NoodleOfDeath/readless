import React from 'react';

import { SheetManager, SheetProps } from 'react-native-actions-sheet';

import { Walkthrough } from '~/components';
import { Bookmark, SessionContext } from '~/contexts';

export function OnboardingWalkthrough(props: SheetProps) {
  
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
      body: 'Read Less uses...',
      title: 'Welcome',
    },
    {
      body: 'Read Less uses...',
      title: 'Accessibility',
    },
    {
      body: 'Read Less uses...',
      title: 'Sentiment',
    },
    {
      body: 'Read Less uses...',
      title: 'Subscriptions',
    },
  ], []);
  
  return (
    <Walkthrough
      { ...props }
      payload={ { onDone, steps } } />
  );
  
}