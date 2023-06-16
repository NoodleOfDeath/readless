import React from 'react';

import { IButtonProps, Button as NBButton } from 'native-base';

import { Icon } from './Icon';
export type ButtonProps = IButtonProps & {
  leftIcon?: React.ReactNode;
};

export function Button(props: ButtonProps) {
  return (
    <NBButton 
      { ...props }
      leftIcon={ typeof props.leftIcon === 'string' ? <Icon name={ props.leftIcon } /> : props.leftIcon } />
  );
}