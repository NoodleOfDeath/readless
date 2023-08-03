import React from 'react';

export class SelectOption<T extends string = string> {

  value: T;
  label: React.ReactNode;
  icon?: React.ReactNode;
  
  static from<T extends string = string>(value: T | SelectOption<T>) {
    return new SelectOption(value);
  }
  
  static options<T extends string = string>(options: T[] | SelectOption<T>[]) {
    return options.map((o) => SelectOption.from(o));
  }
  
  constructor(value: T | SelectOption<T>) {
    if (typeof value === 'string') {
      this.value = value;
      this.label = value;
    } else {
      this.value = value.value;
      this.label = value.label;
      this.icon = value.icon;
    }
  }
  
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type SelectOptionState<T extends string = string, ExtraStates = any> = ExtraStates & {
  option: SelectOption<T>;
  currentValue?: T | T[];
  selected: boolean;
};