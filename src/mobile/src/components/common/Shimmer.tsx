import React from 'react';

import RNShimmer, { ShimmerProps as RNShimmerProps } from 'react-native-shimmer';

import { ViewProps } from '~/components';

export type ShimmerProps = ViewProps & RNShimmerProps & {
  disabled?: boolean;
};

export function Shimmer({ 
  children, 
  disabled,
  animating = !disabled,
  duration = 1_000,
  pauseDuration = 3_000,
  ...props
}: ShimmerProps) {
  return (
    <RNShimmer 
      { ...props }
      animating={ animating }
      duration={ duration }
      pauseDuration={ pauseDuration }>
      {children}
    </RNShimmer>
  );
}