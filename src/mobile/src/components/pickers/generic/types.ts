import React from 'react';

export class SelectOption<T extends string = string> {

  value: T;
  label: React.ReactNode;
  
  static from<T extends string = string>(value: T | SelectOption<T>, label?: React.ReactNode) {
    return new SelectOption<T>(value, label);
  }
  
  static options<T extends string = string>(options: T[] | SelectOption<T>[]) {
    return options.map((o: T | SelectOption<T>) => SelectOption.from(o));
  }
  
  constructor(value: T | SelectOption<T>, label?: React.ReactNode) {
    if (typeof value === 'object') {
      this.value = value.value;
      this.label = label ?? value.label;
    } else {
      this.value = value;
      this.label = label ?? `${value}`;
    }
  }
  
}

// eslint-disable-next-line @typescript-eslint/ban-types
export type SelectOptionState<T extends string = string, P = {}> = P & {
  option: SelectOption<T>;
  currentValue?: T | T[];
  selected: boolean;
};