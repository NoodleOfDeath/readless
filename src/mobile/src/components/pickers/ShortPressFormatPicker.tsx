import React from 'react';

import analytics from '@react-native-firebase/analytics';

import { ReadingFormat } from '~/api';
import { ChildlessViewProps, TablePicker } from '~/components';
import { SessionContext } from '~/core';
import { getUserAgent } from '~/utils';

type Props = ChildlessViewProps;

export function ShortPressFormatPicker({ ...props }: Props = {}) {
  const { preferredShortPressFormat, setPreference } = React.useContext(SessionContext);
  return (
    <TablePicker
      { ...props }
      options={ [ReadingFormat.Summary, ReadingFormat.Bullets] }
      initialValue={ preferredShortPressFormat ?? ReadingFormat.Summary }
      onValueChange={ (state) => {
        analytics().logEvent('set_preference', {
          key: 'preferredShortPressFormat', 
          userAgent: getUserAgent(), 
          value: state?.value, 
        });
        setPreference('preferredShortPressFormat', state?.value); 
      } }>
    </TablePicker>
  );
}
