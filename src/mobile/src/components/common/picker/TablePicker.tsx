import React from 'react';
import { LayoutRectangle } from 'react-native';

import {
  Chip,
  Picker,
  PickerProps,
  ScrollView,
  SelectOption,
  SelectOptionState,
  TableIndex,
  TableView,
  TableViewCell,
  TableViewCellProps,
  TableViewProps,
  TableViewSection,
  TableViewSectionProps,
  TextInput,
  View,
} from '~/components';
import { LayoutContext } from '~/contexts';
  
export type TablePickerProps<
  T extends string,
  Multi extends true | false = false,
  Value extends Multi extends true ? T[] : (T | undefined) = Multi extends true ? T[] : (T | undefined),
  OptionValue extends Multi extends true ? SelectOption<T>[] : (SelectOption<T> | undefined) = Multi extends true ? SelectOption<T>[] : (SelectOption<T> | undefined)
> = TableViewProps & Omit<PickerProps<T, Multi, Value, OptionValue>, 'render'> & {
  children?: React.ReactNode;
  sectionProps?: Partial<TableViewSectionProps> | ((state: Omit<SelectOptionState<T, Pick<TableIndex, 'section'>>, 'option' | 'selected'>) => Partial<TableViewSectionProps>);
  cellProps?: Partial<TableViewCellProps> | ((state: SelectOptionState<T, TableIndex>) => Partial<TableViewCellProps>);
  searchable?: boolean;
};

export function TablePicker<
  T extends string,
  Multi extends true | false = false,
  Value extends Multi extends true ? T[] : (T | undefined) = Multi extends true ? T[] : (T | undefined),
  OptionValue extends Multi extends true ? SelectOption<T>[] : (SelectOption<T> | undefined) = Multi extends true ? SelectOption<T>[] : (SelectOption<T> | undefined)
>({
  children,
  sectionProps: sectionProps0,
  cellProps: cellProps0,
  searchable,
  ...props
}: TablePickerProps<T, Multi, Value, OptionValue>) {

  const { screenHeight } = React.useContext(LayoutContext);

  const [filter, setFilter] = React.useState('');
  const [layout, setLayout] = React.useState<LayoutRectangle>();

  const sectionProps = React.useCallback((value: T[], section: number) => {
    return sectionProps0 instanceof Function ? sectionProps0({
      currentValue: value,
      section,
    }) : sectionProps0;
  }, [sectionProps0]);

  const cellProps = React.useCallback((option: SelectOption<T>, value: T[], index: number, section: number) => {
    return cellProps0 instanceof Function ? cellProps0({
      currentValue: props.multi ? value : value[0] ? value[0] as T : undefined,
      index,
      option,
      section,
      selected: value.includes(option.value),
    }) : cellProps0;
  }, [cellProps0, props.multi]);

  return (
    <View 
      { ...props }
      flex={ 1 }
      onLayout={ (e) => setLayout(e.nativeEvent.layout) }>
      <Picker
        { ...props }
        filter={ filter }
        render={ ({
          options, filteredOptions, value, onSelect, 
        }) => (
          <React.Fragment>
            {searchable && (
              <React.Fragment>
                <TextInput
                  placeholder="Search"
                  value={ filter }
                  onChangeText={ setFilter }
                  clearButtonMode="while-editing" />
                <ScrollView maxHeight={ (layout?.height ?? screenHeight) / 3 }>
                  <View flexRow p={ 6 } flexWrap='wrap' gap={ 6 }>
                    {value.sort().map((value) => {
                      const option = options.find((option) => option.value === value);
                      if (!option) {
                        return null;
                      }
                      return (
                        <Chip
                          key={ value }
                          avatar={ option.icon }
                          onClose={ () => onSelect(value) }>
                          {option.label}
                        </Chip>
                      );
                    })}
                  </View>
                </ScrollView>
              </React.Fragment>
            )}
            <ScrollView flex={ 1 }>
              <TableView>
                {children && (
                  <TableViewSection { ...sectionProps(value, 0) }>
                    <TableViewCell
                      cellContentView={ children } />
                  </TableViewSection>
                )}
                <TableViewSection { ...sectionProps(value, 1) }>
                  {filteredOptions.map((option, index) => {
                    return (
                      <TableViewCell
                        key={ option.value }
                        accessory={ value.includes(option.value) ? 'Checkmark' : undefined }
                        title={ option.label }
                        cellIcon={ option.icon }
                        { ...cellProps(option, value, index, 1) }
                        onPress={ () => onSelect(option.value) } />
                    );
                  })}
                </TableViewSection>
              </TableView>
            </ScrollView>
          </React.Fragment>
        ) } />
    </View>
  );
}
