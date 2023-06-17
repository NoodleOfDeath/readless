import React from 'react';

import {
  Button,
  ButtonProps,
  ChildlessViewProps,
  ScrollView,
  SelectOption,
  SelectOptionState,
  View,
} from '~/components';

export type GridPickerProps<
  T extends string = string,
  Multi extends true | false = false,
  I extends Multi extends true ? T[] : (T | undefined) = Multi extends true ? T[] : (T | undefined),
> = ChildlessViewProps & {
  options: T[] | SelectOption<T>[];
  multi?: Multi;
  initialValue?: I;
  onValueChange?: (value?: I) => void;
  buttonProps?: Partial<ButtonProps> | ((state: SelectOptionState<T>) => Partial<ButtonProps>);
};

export function GridPicker<
  T extends string = string,
  Multi extends boolean = false,
  I extends Multi extends true ? T[] : (T | undefined) = Multi extends true ? T[] : (T | undefined),
>({
  options: options0,
  initialValue,
  onValueChange,
  multi,
  buttonProps = (state) => ({ 
    bold: state.selected,
    leftIcon: state.selected ? 'check' : undefined,
  }),
  ...props
}: GridPickerProps<T, Multi>) {

  const options = React.useMemo(() => SelectOption.options(options0), [options0]);
  const [value, setValue] = React.useState<T[]>(Array.isArray(initialValue) ? initialValue : (initialValue ? [initialValue] : []) as T[]);

  const handlePress = React.useCallback((option: T) => {
    setValue((prev) => {
      let state = [ ...prev ];
      if (multi) {
        if (state.includes(option)) {
          state = state.filter((v) => v !== option);
        } else {
          state = [...state, option];
        }
      }
      onValueChange?.(state as I);
      return (prev = state);
    });
  }, [multi, onValueChange]);

  return (
    <ScrollView { ...props }>
      <View
        flexRow
        flexGrow={ 1 }
        flexWrap="wrap"
        p={ 8 }
        colGap={ 8 }
        rowGap={ 8 }>
        {options.map((option) => (
          <Button
            key={ option.value }
            elevated
            horizontal
            rounded
            gap={ 6 }
            p={ 6 }
            { ...(buttonProps instanceof Function ? buttonProps({ 
              currentValue: multi ? value : value[0] ? value[0] as T : undefined,
              option, 
              selected: value.includes(option.value), 
            }) : buttonProps) }
            onPress={ () => handlePress(option.value) }>
            {option.label}
          </Button>
        ))}
      </View>
    </ScrollView>
  );
}
