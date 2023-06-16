import React from 'react';

import {
  AVAILABLE_FONTS,
  Button,
  ScrollView,
  TableView,
  TableViewCell,
  TableViewSection,
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
    <TableView>
      <TableViewSection>
        {AVAILABLE_FONTS.map((font) => (
          <TableViewCell
            key={ font }
            accessory={ font === fontFamily ? 'Checkmark' : undefined }
            title={ font }
            titleTextStyle={ { fontFamily: font } }
            onPress={ () => setPreference('fontFamily', font) } />
        ))}
      </TableViewSection>
    </TableView>
  ) : (
    <ScrollView 
      horizontal
      style={ {
        overflow: 'hidden', padding: 8, ...style, 
      } }>
      <View flexRow alignCenter gap={ 8 } mh={ 8 }>
        {AVAILABLE_FONTS.map((font) => (
          <Button 
            flexRow
            caption
            alignCenter
            gap={ 4 }
            key={ font }
            elevated
            p={ 8 }
            startIcon={ fontFamily === font ? 'check' : undefined } 
            fontFamily={ font }
            onPress={ () => setPreference('fontFamily', font) }>
            {font}
          </Button>
        ))}
      </View>
    </ScrollView>
  );
}