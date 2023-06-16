import React from 'react';

import {
  TableView,
  TableViewCell,
  TableViewCellProps,
  TableViewProps,
  TableViewSection,
  TableViewSectionProps,
} from '~/components';

type SelectOption<T extends string | number = string> = {
  value: T;
  label: string;
};
  
export type TablePickerProps<T extends string | number = string> = TableViewProps & {
  options: T[] | SelectOption<T>[];
  initialOption: T;
  onValueChange?: (value?: T) => void;
  conditionalProps?: (option: T, currentValue?: T) => Partial<TableViewCellProps>;
  sectionProps?: TableViewSectionProps;
  cellProps?: TableViewCellProps;
};

export function TablePicker<T extends string | number = string>({
  options,
  initialOption,
  onValueChange,
  conditionalProps,
  sectionProps,
  cellProps,
  ...props
}: TablePickerProps<T>) {
  const [value, setValue] = React.useState(initialOption);
  return (
    <TableView { ...props }>
      <TableViewSection { ...sectionProps }>
        {options.map((opt) => {
          const option = typeof opt === 'object' ? opt.value : opt;
          const label = typeof opt === 'object' ? opt.label : opt;
          return (
            <TableViewCell
              key={ option }
              accessory={ option === value ? 'Checkmark' : undefined }
              title={ label }
              { ...cellProps }
              { ...conditionalProps?.(option, value) }
              onPress={ () => {
                setValue(option);
                onValueChange?.(option);
              } } />
          );
        })}
      </TableViewSection>
    </TableView>
  );
}
