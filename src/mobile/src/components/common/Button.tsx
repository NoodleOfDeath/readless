import React from 'react';

import { Chip, ChipProps } from '~/components';

export type ButtonProps = ChipProps; 

export function Button({
  untouchable,
  touchable = !untouchable,
  ...props
}: ButtonProps) {
  return (
    <Chip 
      touchable={ touchable }
      primary
      { ...props } />
  );
}