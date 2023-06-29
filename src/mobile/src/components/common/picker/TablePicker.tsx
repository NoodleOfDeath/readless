import React from 'react';

import {
  Picker,
  PickerProps,
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
  T extends string,
  P,
  Multi extends true | false = false,
  InitialValue extends Multi extends true ? T[] : (T | undefined) = Multi extends true ? T[] : (T | undefined),
  CurrentValue extends Multi extends true ? SelectOption<T, P>[] : (SelectOption<T, P> | undefined) = Multi extends true ? SelectOption<T, P>[] : (SelectOption<T, P> | undefined)
> = TableViewProps & Omit<PickerProps<T, P, Multi, InitialValue, CurrentValue>, 'render'> & {
  children?: React.ReactNode;
  sectionProps?: Partial<TableViewSectionProps> | ((state: Omit<SelectOptionState<T, Pick<TableIndex, 'section'>>, 'option' | 'selected'>) => Partial<TableViewSectionProps>);
  cellProps?: Partial<TableViewCellProps> | ((state: SelectOptionState<T, TableIndex>) => Partial<TableViewCellProps>);
};

export function TablePicker<
  T extends string,
  P,
  Multi extends true | false = false,
  InitialValue extends Multi extends true ? T[] : (T | undefined) = Multi extends true ? T[] : (T | undefined),
  CurrentValue extends Multi extends true ? SelectOption<T, P>[] : (SelectOption<T, P> | undefined) = Multi extends true ? SelectOption<T, P>[] : (SelectOption<T, P> | undefined)
>({
  children,
  sectionProps: sectionProps0,
  cellProps: cellProps0,
  ...props
}: TablePickerProps<T, P, Multi, InitialValue, CurrentValue>) {

  const sectionProps = React.useCallback((value: T[], section: number) => {
    return sectionProps0 instanceof Function ? sectionProps0({
      currentValue: value,
      section,
    }) : sectionProps0;
  }, [sectionProps0]);

  const cellProps = React.useCallback((option: SelectOption<T, P>, value: T[], index: number, section: number) => {
    return cellProps0 instanceof Function ? cellProps0({
      currentValue: props.multi ? value : value[0] ? value[0] as T : undefined,
      index,
      option,
      section,
      selected: value.includes(option.value),
    }) : cellProps0;
  }, [cellProps0, props.multi]);

  return (
    <Picker
      { ...props }
      render={ (options, value, handlePress) => (
        <TableView { ...props }>
          {children && (
            <TableViewSection { ...sectionProps(value, 0) }>
              <TableViewCell
                cellContentView={ children } />
            </TableViewSection>
          )}
          <TableViewSection { ...sectionProps(value, 1) }>
            {options.map((option, index) => {
              return (
                <TableViewCell
                  key={ option.value }
                  accessory={ value.includes(option.value) ? 'Checkmark' : undefined }
                  title={ option.label }
                  { ...cellProps(option, value, index, 1) }
                  onPress={ () => handlePress(option.value) } />
              );
            })}
          </TableViewSection>
        </TableView>
      ) } />
  );
}