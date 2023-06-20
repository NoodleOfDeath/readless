import React from 'react';

import { 
  SegmentedButtons, 
  SegmentedButtonsProps,
  TablePicker,
} from '~/components';
import { ColorScheme, SessionContext } from '~/contexts';
import { strings } from '~/locales';

type ColorSchemePickerProps = Omit<SegmentedButtonsProps, 'options'> & {
  variant?: 'table' | 'buttons';
  buttons?: boolean;
};

export function ColorSchemePicker({
  buttons,
  variant = buttons ? 'buttons' : 'table',
  ...props
}: ColorSchemePickerProps) {
  
  const { colorScheme, setPreference } = React.useContext(SessionContext);
  
  if (variant === 'table') {
    return (
      <TablePicker
        options={ [
          { label: strings.settings_light, value: 'light' as ColorScheme },
          { label: strings.settings_system, value: 'system' as ColorScheme },
          { label: strings.settings_dark, value: 'dark' as ColorScheme },
        ] }
        initialValue={ colorScheme ?? 'system' }
        onValueChange={ (state) => setPreference('colorScheme', state?.value) } />
    );
  }
  
  return (
    <SegmentedButtons
      { ...props }
      buttonProps={ { 
        justifyCenter: true, 
        outlined: true,
        p: 12,
        textCenter: true,
      } }
      initialValue={ colorScheme ?? 'system' }
      onValueChange={ (value) => setPreference('colorScheme', value) }
      options={ [
        { label: strings.settings_light, value: 'light' as ColorScheme },
        { label: strings.settings_system, value: 'system' as ColorScheme },
        { label: strings.settings_dark, value: 'dark' as ColorScheme },
      ] } />
  );
}