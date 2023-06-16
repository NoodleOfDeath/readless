import React from 'react';

import {
  Switch,
  SwitchProps,
  ViewProps,
} from '~/components';
import { Preferences, SessionContext } from '~/contexts';

type ValueOf<T> = T[keyof T];
type BooleanPreferencesKeys = ValueOf<{ [I in keyof Preferences]: Preferences[I] extends boolean ? I : never }>;
type BooleanPreferences = { [I in BooleanPreferencesKeys]: Preferences[I] };

type PrefSwitchProps<K extends keyof BooleanPreferences> = Omit<SwitchProps, 'value'> & ViewProps & {
  prefKey: K;
  onValueChange?: (value?: BooleanPreferences[K]) => void;
};

export function PrefSwitch<K extends keyof BooleanPreferences>({
  prefKey,
  onValueChange,
  ...props
}: PrefSwitchProps<K>) {

  const context = React.useContext(SessionContext);
  const [value, setValue] = React.useState(context[prefKey]);

  return (
    <Switch
      value={ value }
      onValueChange={ (value) => {
        setValue(value);
        context.setPreference(prefKey, value);
        onValueChange?.(value);
      } }
      { ...props } />
  );
}