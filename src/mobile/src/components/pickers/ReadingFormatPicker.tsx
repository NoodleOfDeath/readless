import React from 'react';

import { ReadingFormat } from '~/api';
import { SegmentedButtons, ViewProps } from '~/components';
import { useStyles } from '~/hooks';
import { strings } from '~/locales';

type Props = ViewProps & {
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
  const style = useStyles(props);
  return (
    <SegmentedButtons 
      { ...props }
      style={ style }
      value={ format ?? preferredFormat }
      onValueChange={ (value) => onChange?.(value as ReadingFormat) }
      buttons={ [
        {
          icon: 'text-long',
          label: strings.summary_summary,
          value: 'summary',
        },
        {
          icon: 'view-list',
          label: strings.summary_bullets,
          value: 'bullets',
        },
      ] } />
  );
}
