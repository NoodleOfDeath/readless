import React from 'react';

import { ReadingFormat } from '~/api';
import { ChildlessViewProps, SegmentedButtons } from '~/components';
import { strings } from '~/locales';

type Props = ChildlessViewProps & {
  format?: ReadingFormat;
  preferredFormat?: ReadingFormat;
  onChange?: (mode?: ReadingFormat) => void;
};

export function ReadingFormatPicker({
  format,
  preferredFormat = ReadingFormat.Summary, 
  onChange,
  ...props
}: Props = {}) {
  return (
    <SegmentedButtons 
      { ...props }
      buttonProps={ { my: -24 } }
      initialValue={ format ?? preferredFormat }
      onValueChange={ (value) => onChange?.(value) }
      options={ [
        {
          icon: 'text-long',
          label: strings.summary_summary,
          value: ReadingFormat.Summary,
        },
        {
          icon: 'view-list',
          label: strings.summary_bullets,
          value: ReadingFormat.Bullets,
        },
      ] } />
  );
}
