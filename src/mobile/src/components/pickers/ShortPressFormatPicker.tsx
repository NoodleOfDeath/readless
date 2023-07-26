import React from 'react';

import { ReadingFormat } from '~/api';
import { ChildlessViewProps, TablePicker } from '~/components';
import { SessionContext } from '~/core';
import { strings } from '~/locales';

type Props = ChildlessViewProps;

export function ShortPressFormatPicker({ ...props }: Props = {}) {
  const { preferredShortPressFormat, setPreference } = React.useContext(SessionContext);
  return (
    <TablePicker
      { ...props }
      options={ [ReadingFormat.Summary, ReadingFormat.Bullets] }
      initialValue={ preferredShortPressFormat ?? ReadingFormat.Summary }
      onValueChange={ (state) => setPreference('preferredShortPressFormat', state?.value) }>
    </TablePicker>
  );
}
