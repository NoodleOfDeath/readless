import React from 'react';

import {
  AVAILABLE_FONTS,
  Button,
  DEFAULT_PREFERRED_FONT,
  FontFamily,
  GridPicker,
  ScrollView,
  Summary,
  TablePicker,
  View,
  ViewProps,
} from '~/components';
import { SessionContext } from '~/contexts';
import { useStyles } from '~/hooks';

export type FontPickerProps = ViewProps & {
  variant?: 'grid' | 'horizontal' | 'table';
  grid?: boolean;
  horizontal?: boolean;
};

export function FontPicker({
  grid,
  horizontal,
  variant = grid ? 'grid' : horizontal ? 'horizontal' : 'table',
  ...props
}: FontPickerProps = {}) {
  
  const { fontFamily = DEFAULT_PREFERRED_FONT, setPreference } = React.useContext(SessionContext);
  const style = useStyles(props);
  
  if (variant === 'grid') {
    return (
      <GridPicker
        centered
        options={ [...AVAILABLE_FONTS] }
        initialValue={ fontFamily as FontFamily }
        buttonProps={ ({ option }) => ({ fontFamily: option.value }) }
        onValueChange={ (state) => setPreference('fontFamily', state?.value) } />
    );
  } else
  if (variant === 'horizontal') {
    return (
      <ScrollView 
        horizontal
        style={ {
          overflow: 'hidden', padding: 8, ...style, 
        } }>
        <View flexRow itemsCenter gap={ 8 } mx={ 8 }>
          {AVAILABLE_FONTS.map((font) => (
            <Button 
              caption
              contained
              gap={ 4 }
              key={ font }
              leftIcon={ fontFamily === font ? 'check' : undefined } 
              fontFamily={ font }
              onPress={ () => setPreference('fontFamily', font) }>
              {font}
            </Button>
          ))}
        </View>
      </ScrollView>
    );
  }
  
  return (
    <TablePicker
      options={ [...AVAILABLE_FONTS] }
      initialValue={ fontFamily as FontFamily }
      cellProps={ ({ option }) => ({ titleTextStyle: { fontFamily: option.value } }) }
      onValueChange={ (state) => setPreference('fontFamily', state?.value) }>
      <ScrollView my={ 12 } scrollEnabled={ false }>
        <Summary
          sample
          disableInteractions
          disableNavigation /> 
      </ScrollView>
    </TablePicker>
  );
}