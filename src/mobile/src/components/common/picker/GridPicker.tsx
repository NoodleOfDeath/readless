import React from 'react';
import { LayoutRectangle } from 'react-native';

import { FlatGrid } from 'react-native-super-grid';

import {
  Button,
  ButtonProps,
  Picker,
  PickerProps,
  SelectOption,
  SelectOptionState,
} from '~/components';
import { useTheme } from '~/hooks';

export type GridPickerProps<
  T extends string,
  Multi extends true | false = false,
  Value extends Multi extends true ? T[] : (T | undefined) = Multi extends true ? T[] : (T | undefined),
  OptionValue extends Multi extends true ? SelectOption<T>[] : (SelectOption<T> | undefined) = Multi extends true ? SelectOption<T>[] : (SelectOption<T> | undefined)
> = Omit<PickerProps<T, Multi, Value, OptionValue>, 'render'> & {
  cols?: number;
  buttonProps?: Partial<ButtonProps> | ((state: SelectOptionState<T>) => Partial<ButtonProps>);
};

export function GridPicker<
  T extends string,
  Multi extends true | false = false,
  Value extends Multi extends true ? T[] : (T | undefined) = Multi extends true ? T[] : (T | undefined),
  OptionValue extends Multi extends true ? SelectOption<T>[] : (SelectOption<T> | undefined) = Multi extends true ? SelectOption<T>[] : (SelectOption<T> | undefined)
>({
  cols = 2,
  buttonProps: buttonProps0,
  ...props
}: GridPickerProps<T, Multi, Value, OptionValue>) {

  const theme = useTheme();

  const [layout, setLayout] = React.useState<LayoutRectangle>();

  const buttonProps = React.useMemo(() => {
    return (state: SelectOptionState<T>) => ({
      ...(state.selected ? theme.components.chipSelected : theme.components.chipDisabled),
      ...(buttonProps0 instanceof Function ? buttonProps0(state) : buttonProps0),
    });
  }, [buttonProps0, theme.components.chipDisabled, theme.components.chipSelected]);

  const itemWidth = React.useMemo(() => layout?.width ? layout.width / cols : 0, [cols, layout?.width]);

  return (
    <Picker
      { ...props }
      render={ (options, value, handlePress) => (
        <FlatGrid
          onLayout={ ({ nativeEvent: { layout } }) => setLayout(layout) }
          data={ options }
          renderItem={ ({ item }) => {
            const computedButtonProps = buttonProps({ 
              currentValue: props.multi ? value : value[0] != null ? value[0] as T : undefined,
              option: item, 
              selected: value.includes(item.value), 
            });
            return (
              <Button
                key={ item.value }
                system={ !computedButtonProps.fontFamily }
                contained
                adjustsFontSizeToFit
                haptic
                textCenter
                vertical
                gap={ 6 }
                height={ itemWidth / 2 }
                leftIcon={ item.icon }
                { ...computedButtonProps }
                onPress={ () => handlePress(item.value) }>
                {item.label}
              </Button>
            );
          } } />
      ) } />
  );
}
