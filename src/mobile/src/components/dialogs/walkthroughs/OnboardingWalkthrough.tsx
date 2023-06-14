import React from 'react';

import { SheetProps } from 'react-native-actions-sheet';

import { Walkthrough } from '~/components';

export function OnboardingWalkthrough(props: SheetProps) {
  return (
    <Walkthrough
      { ...props }
      payload={ { steps: [] } } />
  );
  
}