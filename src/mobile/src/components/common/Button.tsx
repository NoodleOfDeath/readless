import React from 'react';

import { Chip, ChipProps } from '~/components';

export type ButtonProps = ChipProps; 

export function Button({
  touchable = true,
  ...props
}: ButtonProps) {
  return (
    <Chip 
      touchable={ touchable }
      { ...props } />
  );
}