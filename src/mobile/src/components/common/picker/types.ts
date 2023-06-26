import React from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export class SelectOption<T extends string = string, P = any> {

  value: T;
  payload?: P;
  label: React.ReactNode;
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static from<T extends string = string, P = any>(value: T | SelectOption<T, P>, label?: React.ReactNode) {
    return new SelectOption<T, P>(value, label);
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static options<T extends string = string, P = any>(options: T[] | SelectOption<T>[]) {
    return options.map((o: T | SelectOption<T, P>) => SelectOption.from(o));
  }
  
  constructor(value: T | SelectOption<T, P>, label?: React.ReactNode) {
    if (typeof value === 'object') {
      this.value = value.value;
      this.label = label ?? value.label;
      this.payload = value.payload;
    } else {
      this.value = value;
      this.label = label ?? `${value}`;
    }
  }
  
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SelectOptionState<T extends string = string, ExtraStates = any, P = any> = ExtraStates & {
  option: SelectOption<T>;
  currentValue?: T | T[];
  payload?: P;
  selected: boolean;
};