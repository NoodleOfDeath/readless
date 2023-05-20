import React from 'react';

import { SegmentedButtons } from 'react-native-paper';

import { ReadingFormat } from '~/api';
import { ViewProps } from '~/components';
import { useStyles } from '~/hooks';

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
          label: 'Summary',
          value: 'summary',
        },
        {
          icon: 'view-list',
          label: 'Bullets',
          value: 'bullets',
        },
      ] } />
  );
}
