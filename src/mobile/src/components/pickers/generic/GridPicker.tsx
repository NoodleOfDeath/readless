import React from 'react';

import {
  Button,
  ButtonProps,
  Picker,
  PickerProps,
  ScrollView,
  ScrollViewProps,
  SelectOption,
  SelectOptionState,
  View,
} from '~/components';
import { useTheme } from '~/hooks';

export type GridPickerProps<
  T extends string,
  P,
  Multi extends true | false = false,
  InitialValue extends Multi extends true ? T[] : (T | undefined) = Multi extends true ? T[] : (T | undefined),
  CurrentValue extends Multi extends true ? SelectOption<T, P>[] : (SelectOption<T, P> | undefined) = Multi extends true ? SelectOption<T, P>[] : (SelectOption<T, P> | undefined)
> = Omit<PickerProps<T, P, Multi, InitialValue, CurrentValue>, 'render'> & {
  scrollViewProps?: Partial<ScrollViewProps>;
  buttonProps?: Partial<ButtonProps> | ((state: SelectOptionState<T>) => Partial<ButtonProps>);
};

export function GridPicker<
  T extends string,
  P,
  Multi extends true | false = false,
  InitialValue extends Multi extends true ? T[] : (T | undefined) = Multi extends true ? T[] : (T | undefined),
  CurrentValue extends Multi extends true ? SelectOption<T, P>[] : (SelectOption<T, P> | undefined) = Multi extends true ? SelectOption<T, P>[] : (SelectOption<T, P> | undefined)
>({
  scrollViewProps,
  buttonProps: buttonProps0,
  ...props
}: GridPickerProps<T, P, Multi, InitialValue, CurrentValue>) {

  const theme = useTheme();

  const buttonProps = React.useMemo(() => {
    return (state: SelectOptionState<T>) => ({
      bg: state.selected ? theme.colors.selectedBackground : undefined,
      color: state.selected ? theme.colors.invertText : undefined,
      underline: state.selected,
      ...(buttonProps0 instanceof Function ? buttonProps0(state) : buttonProps0),
    });
  }, [buttonProps0, theme.colors.invertText, theme.colors.selectedBackground]);

  return (
    <Picker
      { ...props }
      render={ (options, value, handlePress) => (
        <ScrollView
          keyboardDismissMode="on-drag"
          keyboardShouldPersistTaps={ 'always' }
          { ...scrollViewProps }>
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
                haptic
                rounded
                gap={ 6 }
                p={ 6 }
                { ...(buttonProps instanceof Function ? buttonProps({ 
                  currentValue: props.multi ? value : value[0] != null ? value[0] as T : undefined,
                  option, 
                  selected: value.includes(option.value), 
                }) : buttonProps) }
                onPress={ () => handlePress(option.value) }>
                {option.label}
              </Button>
            ))}
          </View>
        </ScrollView>
      ) } />
  );
}
