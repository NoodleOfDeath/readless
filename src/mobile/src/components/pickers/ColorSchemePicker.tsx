import React from 'react';

import analytics from '@react-native-firebase/analytics';

import { 
  ScrollView,
  SegmentedButtons, 
  SegmentedButtonsProps,
  Summary,
  TablePicker,
} from '~/components';
import { ColorScheme, SessionContext } from '~/contexts';
import { strings } from '~/locales';
import { getUserAgent } from '~/utils';

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
        onValueChange={ (state) => {
          analytics().logEvent('set_preference', {
            key: 'colorScheme', userAgent: getUserAgent(), value: state?.value, 
          });
          setPreference('colorScheme', state?.value); 
        } }>
        <ScrollView my={ 12 } scrollEnabled={ false }>
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
      onValueChange={ (value) => setPreference('colorScheme', value) }
      options={ [
        { label: strings.settings_light, value: 'light' as ColorScheme },
        { label: strings.settings_system, value: 'system' as ColorScheme },
        { label: strings.settings_dark, value: 'dark' as ColorScheme },
      ] } />
  );
}