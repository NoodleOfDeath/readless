import React from 'react';

import { SegmentedButtons } from 'react-native-paper';

import { ReadingFormat } from '~/api';
import { ViewProps } from '~/components';
import { useStyles } from '~/hooks';
import { strings } from '~/locales';

type Props = ViewProps & {
  format?: ReadingFormat;
  preferredFormat?: ReadingFormat;
  onChange?: (mode?: ReadingFormat) => void;
};

export function ReadingFormatSelector({
  format,
  preferredFormat = ReadingFormat.Summary, 
  onChange,
  ...props
}: Props = {}) {
  const style = useStyles(props);
  return (
    <SegmentedButtons 
      style={ style }
      value={ format ?? preferredFormat }
      onValueChange={ (value) => onChange?.(value as ReadingFormat) }
      buttons={ [
        {
          icon: 'text-long',
          label: strings.summary.summary,
          value: 'summary',
        },
        {
          icon: 'view-list',
          label: strings.summary.bullets,
          value: 'bullets',
        },
      ] } />
  );
}
