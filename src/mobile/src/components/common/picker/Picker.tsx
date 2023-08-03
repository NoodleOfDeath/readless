import React from 'react';

import {
  ActivityIndicator,
  Button,
  ButtonProps,
  ChildlessViewProps,
  ScrollViewProps,
  SelectOption,
  SelectOptionState,
  TextInput,
  View,
} from '~/components';
import { strings } from '~/locales';

export type PickerRender<T extends string> = (options: SelectOption<T>[], value: T[], onSelect: (option: T) => void) => React.ReactNode;

export type PickerProps<
  T extends string,
  Multi extends true | false = false,
  Value extends (Multi extends true ? T[] : (T | undefined)) = Multi extends true ? T[] : (T | undefined),
  OptionValue extends (Multi extends true ? SelectOption<T>[] : (SelectOption<T> | undefined)) = Multi extends true ? SelectOption<T>[] : (SelectOption<T> | undefined)
> = ChildlessViewProps & {
  options: T[] | SelectOption<T>[] | (() => Promise<T[] | SelectOption<T>[]>);
  render: PickerRender<T>;
  multi?: Multi;
  initialValue?: Value;
  scrollViewProps?: Partial<ScrollViewProps>;
  buttonProps?: Partial<ButtonProps> | ((state: SelectOptionState<T>) => Partial<ButtonProps>);
  searchable?: boolean;
  onValueChange?: (value?: Value, option?: OptionValue) => void;
  onSave?: (value?: OptionValue) => void;
};

export function Picker<
  T extends string,
  Multi extends true | false = false,
  Value extends (Multi extends true ? T[] : (T | undefined)) = Multi extends true ? T[] : (T | undefined),
  OptionValue extends (Multi extends true ? SelectOption<T>[] : (SelectOption<T> | undefined)) = Multi extends true ? SelectOption<T>[] : (SelectOption<T> | undefined)
>({
  options: options0,
  render,
  initialValue,
  multi,
  searchable,
  onValueChange,
  onSave,
  ...props
}: PickerProps<T, Multi, Value, OptionValue>) {

  const [loading, setLoading] = React.useState(options0 instanceof Function);

  const [options, setOptions] = React.useState(SelectOption.options<T>(options0 instanceof Function ? [] as T[] : options0));
  const [value, setValue] = React.useState<T[]>((Array.isArray(initialValue) ? initialValue : initialValue != null ? [initialValue] : []) as T[]);
  const [state, setState] = React.useState<OptionValue>();

  const [filter, setFilter] = React.useState('');

  const filteredOptions = React.useMemo(() => {
    if (!filter) {
      return options;
    }
    return options.filter((option) => RegExp(filter, 'ig').test(option.value) || (typeof option.label === 'string' && RegExp(filter, 'ig').test(option.label)));
  }, [options, filter]);

  const loadOptions = React.useCallback(async () => {
    if (options.length > 0) {
      return;
    }
    if (options0 instanceof Function) {
      setLoading(true);
      const options = await options0();
      setLoading(false);
      setOptions(SelectOption.options<T>(options));
    }
  }, [options, options0]);

  React.useEffect(() => {
    loadOptions();
  }, [loadOptions]);

  const handleSelect = React.useCallback((option: T) => {
    setValue((prev) => {
      let newValue = prev.map((v) => options.find((o) => o.value === v)).filter(Boolean) as SelectOption<T>[];
      const newOption = options.find((o) => o.value === option);
      if (!newOption) {
        return prev;
      }
      if (multi) {
        if (newValue.some((v) => v.value === option)) {
          newValue = newValue.filter((v) => v.value !== option);
        } else {
          newValue = [...newValue, newOption];
        }
      } else {
        newValue = [newOption];
      }
      const value = newValue.map((v) => v.value) as T[];
      setState((multi ? SelectOption.options<T>(newValue) : SelectOption.from(option)) as OptionValue);
      onValueChange?.((multi ? value : option) as Value, (multi ? SelectOption.options<T>(newValue) : SelectOption.from(option)) as OptionValue);
      return (prev = value);
    });
  }, [multi, onValueChange, options]);

  const content = React.useMemo(() => render(filteredOptions, value, handleSelect), [render, filteredOptions, value, handleSelect]);

  if (!searchable && !onSave) {
    return loading ? (
      <ActivityIndicator />
    ) : content;
  }

  return (
    <View 
      itemsCenter
      col
      gap={ 12 }
      { ...props }>
      <React.Fragment>
        {searchable && (
          <TextInput
            width='100%'
            disabled={ loading }
            value={ filter }
            clearButtonMode='while-editing'
            onChangeText={ setFilter }
            label={ strings.action_search } />
        )}
        {loading ? (
          <ActivityIndicator />
        ) : content }
        {onSave && (
          <Button
            elevated
            p={ 8 }
            beveled
            haptic
            disabled={ loading }
            onPress={ () => onSave(state) }>
            {strings.action_save}
          </Button>
        )}
      </React.Fragment>
    </View>
  );
}