import React from 'react';

import {
  SelectOption,
  SelectOptionState,
  TableIndex,
  TableView,
  TableViewCell,
  TableViewCellProps,
  TableViewProps,
  TableViewSection,
  TableViewSectionProps,
} from '~/components';
  
export type TablePickerProps<
  T extends string = string, 
  Multi extends boolean = false,
  I extends Multi extends true ? T[] : (T | undefined) = Multi extends true ? T[] : (T | undefined),
> = TableViewProps & {
  options: T[] | SelectOption<T>[];
  initialOption?: I;
  onValueChange?: (value?: I) => void;
  multi?: Multi;
  sectionProps?: Partial<TableViewSectionProps> | ((state: Omit<SelectOptionState<T, Pick<TableIndex, 'section'>>, 'option' | 'selected'>) => Partial<TableViewSectionProps>);
  cellProps?: Partial<TableViewCellProps> | ((state: SelectOptionState<T, TableIndex>) => Partial<TableViewCellProps>);
};

export function TablePicker<
  T extends string = string, 
  Multi extends boolean = false,
  I extends Multi extends true ? T[] : (T | undefined) = Multi extends true ? T[] : (T | undefined),
>({
  options: options0,
  initialOption,
  onValueChange,
  multi,
  sectionProps,
  cellProps,
  ...props
}: TablePickerProps<T, Multi>) {

  const options = React.useMemo(() => SelectOption.options(options0), [options0]);
  const [value, setValue] = React.useState<T[]>(Array.isArray(initialOption) ? initialOption : (initialOption ? [initialOption] : []) as T[]);

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
    <TableView { ...props }>
      <TableViewSection { ...(sectionProps instanceof Function ? sectionProps({
        currentValue: value,
        section: 0,
      }) : sectionProps) }>
        {options.map((option, index) => {
          return (
            <TableViewCell
              key={ option.value }
              accessory={ value.includes(option.value) ? 'Checkmark' : undefined }
              title={ option.label }
              { ...(cellProps instanceof Function ? cellProps({
                currentValue: multi ? value : value[0] ? value[0] as T : undefined,
                index,
                option,
                section: 0,
                selected: value.includes(option.value),
              }) : cellProps) }
              onPress={ () => handlePress(option.value) } />
          );
        })}
      </TableViewSection>
    </TableView>
  );
}
