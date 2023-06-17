import React from 'react';

import { ICheckboxProps, Checkbox as NBCheckbox } from 'native-base';

export type CheckboxProps = ICheckboxProps;

export function Checkbox(props: CheckboxProps) {
  return (<NBCheckbox { ...props } />);
}

