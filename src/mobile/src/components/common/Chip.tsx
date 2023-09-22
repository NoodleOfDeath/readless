import React from 'react';

import { Chip as RNChip, ChipProps as RNChipProps } from 'react-native-paper';

export type ChipProps = RNChipProps;

export function Chip({ ...props }: ChipProps) {
  
  return (
    <RNChip
      { ...props } />
  );
}