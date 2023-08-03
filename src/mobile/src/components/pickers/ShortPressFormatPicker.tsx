import React from 'react';

import { strings } from '../../locales';

import { ReadingFormat } from '~/api';
import {
  ChildlessViewProps,
  SelectOption,
  TablePicker,
} from '~/components';
import { SessionContext } from '~/core';

type Props = ChildlessViewProps;

const OPTIONS: SelectOption<ReadingFormat>[] = [{
  label: strings.summary_shortSummary, 
  value: ReadingFormat.ShortSummary,
}, {
  label: strings.summary_bullets,
  value: ReadingFormat.Bullets,
}];

export function ShortPressFormatPicker({ ...props }: Props = {}) {
  const { preferredShortPressFormat, setPreference } = React.useContext(SessionContext);
  return (
    <TablePicker
      { ...props }
      options={ OPTIONS }
      initialValue={ preferredShortPressFormat ?? ReadingFormat.Bullets }
      onValueChange={ (value) => {
        setPreference('preferredShortPressFormat', value); 
      } }>
    </TablePicker>
  );
}
