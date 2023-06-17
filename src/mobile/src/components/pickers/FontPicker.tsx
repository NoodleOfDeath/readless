import React from 'react';

import {
  AVAILABLE_FONTS,
  Button,
  ScrollView,
  TablePicker,
  View,
  ViewProps,
} from '~/components';
import { SessionContext } from '~/contexts';
import { useStyles } from '~/hooks';

export type FontPickerProps = ViewProps & {
  variant?: 'horizontal' | 'table';
  horizontal?: boolean;
};

export function FontPicker({
  horizontal,
  variant = horizontal ? 'horizontal' : 'table',
  ...props
}: FontPickerProps = {}) {
  
  const { fontFamily, setPreference } = React.useContext(SessionContext);
  const style = useStyles(props);
  
  return variant === 'table' ? (
    <TablePicker
      options={ AVAILABLE_FONTS }
      initialOption={ fontFamily }
      cellProps={ ({ option }) => ({ titleTextStyle: { fontFamily: option.value } }) }
      onValueChange={ (font) => setPreference('fontFamily', font) } />
  ) : (
    <ScrollView 
      horizontal
      style={ {
        overflow: 'hidden', padding: 8, ...style, 
      } }>
      <View flexRow alignCenter gap={ 8 } mx={ 8 }>
        {AVAILABLE_FONTS.map((font) => (
          <Button 
            flexRow
            caption
            alignCenter
            gap={ 4 }
            key={ font }
            elevated
            p={ 8 }
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