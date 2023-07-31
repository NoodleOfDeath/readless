import React from 'react';

import { ReadingFormat } from '~/api';
import { ChildlessViewProps, TablePicker } from '~/components';
import { SessionContext } from '~/core';

type Props = ChildlessViewProps;

export function ShortPressFormatPicker({ ...props }: Props = {}) {
  const { preferredShortPressFormat, setPreference } = React.useContext(SessionContext);
  return (
    <TablePicker
      { ...props }
      options={ [ReadingFormat.Summary, ReadingFormat.Bullets] }
      initialValue={ (preferredShortPressFormat ?? ReadingFormat.Summary) as ReadingFormat.Summary | ReadingFormat.Bullets | undefined }
      onValueChange={ (state) => {
        setPreference('preferredShortPressFormat', state?.value); 
      } }>
    </TablePicker>
  );
}
