import React from 'react';

import {
  AVAILABLE_FONTS,
  Button,
  ChipPicker,
  DEFAULT_PREFERRED_FONT,
  FontFamily,
  ScrollView,
  Summary,
  TablePicker,
  View,
  ViewProps,
} from '~/components';
import { StorageContext } from '~/contexts';
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
  
  const { fontFamily = DEFAULT_PREFERRED_FONT, setStoredValue } = React.useContext(StorageContext);
  const style = useStyles(props);
  
  if (variant === 'grid') {
    return (
      <ChipPicker
        options={ [...AVAILABLE_FONTS] }
        initialValue={ fontFamily as FontFamily }
        buttonProps={ ({ option }) => ({ fontFamily: option.value }) }
        onValueChange={ (font) => {
          setStoredValue('fontFamily', font); 
        } } />
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
              onPress={ () => {
                setStoredValue('fontFamily', font); 
              } }>
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
      onValueChange={ (font) => setStoredValue('fontFamily', font) }>
      <ScrollView my={ 12 } scrollEnabled={ false }>
        <Summary
          sample
          disableInteractions
          disableNavigation /> 
      </ScrollView>
    </TablePicker>
  );
}