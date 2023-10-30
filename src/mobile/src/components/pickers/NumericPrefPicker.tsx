import React from 'react';

import { Stepper } from '~/components';
import { Storage, StorageContext } from '~/contexts';

type ValueOf<T> = T[keyof T];
type NumericStorageKeys = NonNullable<ValueOf<{ [I in keyof Storage]: Storage[I] extends (number | undefined) ? I : never }>>;
type NumericStorage = { [I in NumericStorageKeys]: Storage[I] };

export type PrefPickerProps<K extends keyof NumericStorage> = {
  prefKey: K;
  offset?: number;
  min?: number;
  max?: number;
  step?: number;
  variant?: 'slider' | 'stepper';
  slider?: boolean;
};

export function NumericPrefPicker<K extends keyof NumericStorage>({
  prefKey,
  offset,
  min = 0,
  max = 1,
  step = 0.1,
}: PrefPickerProps<K>) {
  
  const context = React.useContext(StorageContext);  
  
  const [value, setValue] = React.useState<Storage[K] | undefined>(context[prefKey]);

  const onValueChange = React.useCallback((values?: number | number[]) => {
    let newValue = typeof values === 'number' ? values : values && values[0];
    if (newValue !== undefined) {
      if (newValue < min) {
        newValue = min;
      } else if (newValue > max) {
        newValue = max;
      }
    }
    setValue(newValue);
    context.setStoredValue(prefKey, newValue);
  }, [min, max, context, prefKey]);

  return (
    <Stepper
      value={ value }
      offset={ offset }
      minimumValue={ min }
      maximumValue={ max }
      stepValue={ step }
      onValueChange={ onValueChange } />
  );
}