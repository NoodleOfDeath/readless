import React from 'react';

import { 
  ScrollView,
  SegmentedButtons, 
  SegmentedButtonsProps,
  Summary,
  TablePicker,
} from '~/components';
import { StorageContext } from '~/contexts';
import { useTheme } from '~/hooks';
import { strings } from '~/locales';

type ColorSchemePickerProps = Omit<SegmentedButtonsProps, 'options'> & {
  variant?: 'buttons' | 'table';
  buttons?: boolean;
};

export function ColorSchemePicker({
  buttons,
  variant = buttons ? 'buttons' : 'table',
  ...props
}: ColorSchemePickerProps) {
  
  const theme = useTheme();
  const { colorScheme, setStoredValue } = React.useContext(StorageContext);

  if (variant === 'table') {
    return (
      <TablePicker
        options={ [
          { label: strings.light, value: 'light' },
          { label: strings.system, value: 'system' },
          { label: strings.dark, value: 'dark' },
        ] }
        baseCellProps={ { style: theme.components.card } }
        initialValue={ colorScheme ?? 'system' }
        onValueChange={ (colorScheme) => {
          setStoredValue('colorScheme', colorScheme); 
        } }>
        <ScrollView
          my={ 12 } 
          scrollEnabled={ false }>
          <Summary
            sample
            disableInteractions 
            disableNavigation /> 
        </ScrollView>
      </TablePicker>
    );
  }
  
  return (
    <SegmentedButtons
      { ...props }
      borderRadius={ 100 }
      overflow='hidden'
      outlined
      buttonProps={ { 
        justifyCenter: true, 
        p: 12,
        system: true,
        textCenter: true,
      } }
      initialValue={ colorScheme ?? 'system' }
      onValueChange={ (value) => setStoredValue('colorScheme', value) }
      options={ [
        { label: strings.light, value: 'light' },
        { label: strings.system, value: 'system' },
        { label: strings.dark, value: 'dark' },
      ] } />
  );
}