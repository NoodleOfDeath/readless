import React from 'react';

import { 
  SegmentedButtons, 
  SegmentedButtonsProps,
  TablePicker,
} from '~/components';
import { ColorMode, SessionContext } from '~/contexts';
import { strings } from '~/locales';

type DisplayModePickerProps = Omit<SegmentedButtonsProps, 'options'> & {
  variant?: 'table' | 'buttons';
  buttons?: boolean;
};

export function DisplayModePicker({
  buttons,
  variant = buttons ? 'buttons' : 'table',
  ...props
}: DisplayModePickerProps) {
  
  const { displayMode, setPreference } = React.useContext(SessionContext);
  
  if (variant === 'table') {
    return (
      <TablePicker
        options={ [
          { label: strings.settings_light, value: 'light' as ColorMode },
          { label: strings.settings_system, value: 'system' as ColorMode },
          { label: strings.settings_dark, value: 'dark' as ColorMode },
        ] }
        initialValue={ displayMode ?? 'system' }
        onValueChange={ (state) => setPreference('displayMode', state.value) } />
    );
  }
  
  return (
    <SegmentedButtons
      { ...props }
      initialValue={ displayMode ?? 'system' }
      onValueChange={ (value) => setPreference('displayMode', value) }
      options={ [
        { label: strings.settings_light, value: 'light' as ColorMode },
        { label: strings.settings_system, value: 'system' as ColorMode },
        { label: strings.settings_dark, value: 'dark' as ColorMode },
      ] } />
  );
}