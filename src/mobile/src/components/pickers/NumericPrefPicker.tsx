import React from 'react';

import { Stepper } from '~/components';
import { Preferences, SessionContext } from '~/contexts';

type ValueOf<T> = T[keyof T];
type NumericPreferencesKeys = NonNullable<ValueOf<{ [I in keyof Preferences]: Preferences[I] extends (number | undefined) ? I : never }>>;
type NumericPreferences = { [I in NumericPreferencesKeys]: Preferences[I] };

export type PrefPickerProps<K extends keyof NumericPreferences> = {
  prefKey: K;
  offset?: number;
  min?: number;
  max?: number;
  step?: number;
  variant?: 'slider' | 'stepper';
  slider?: boolean;
};

export function NumericPrefPicker<K extends keyof NumericPreferences>({
  prefKey,
  offset,
  min = 0,
  max = 1,
  step = 0.1,
}: PrefPickerProps<K>) {
  
  const context = React.useContext(SessionContext);  
  
  const [value, setValue] = React.useState<Preferences[K] | undefined>(context[prefKey]);

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
    context.setPreference(prefKey, newValue);
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