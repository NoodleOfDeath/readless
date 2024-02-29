import React from 'react';

import { Switch, SwitchProps } from '~/components';
import { Storage, StorageContext } from '~/contexts';

type ValueOf<T> = T[keyof T];
type BooleanStorageKeys = NonNullable<ValueOf<{ [I in keyof Storage]: Storage[I] extends (boolean | undefined) ? I : never }>>;
type BooleanStorage = { [I in BooleanStorageKeys]: Storage[I] };

type PrefSwitchProps<K extends keyof BooleanStorage> = Omit<SwitchProps, 'value'> & {
  prefKey: K;
  onValueChange?: (value?: BooleanStorage[K]) => void;
};

export function PrefSwitch<K extends keyof BooleanStorage>({
  prefKey,
  onValueChange,
  ...props
}: PrefSwitchProps<K>) {

  const context = React.useContext(StorageContext);
  const [value, setValue] = React.useState(context[prefKey]);

  return (
    <Switch
      value={ value }
      onValueChange={ (value) => {
        setValue(value);
        context.setStoredValue(prefKey, value);
        onValueChange?.(value);
      } }
      { ...props } />
  );
}