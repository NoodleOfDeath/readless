import React from 'react';

import { Chip, ChipProps } from '~/components';

export type ButtonProps = ChipProps; 

export function Button(props: ButtonProps) {
  return (
    <Chip { ...props } />
  );
}