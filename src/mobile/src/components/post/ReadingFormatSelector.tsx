import React from 'react';

import { ReadingFormat } from '~/api';
import { Button, View } from '~/components';
import { useTheme } from '~/hooks';

type Props = {
  format?: ReadingFormat;
  onChange?: (mode?: ReadingFormat) => void;
};

const FORMAT_ICONS = {
  [ReadingFormat.Concise]: 'text-short',
  [ReadingFormat.Bullets]: 'format-list-bulleted',
  [ReadingFormat.Casual]: 'text-long',
  [ReadingFormat.Detailed]: 'text-box',
  [ReadingFormat.InDepth]: 'text-box-multiple',
} as const;

export function ReadingFormatSelector({
  format,
  onChange,
}: Props = {}) {
  const theme = useTheme();
  const makeButton = React.useCallback((newFormat: ReadingFormat, row = 0) => {
    return (
      <Button
        selectable
        outlined
        row
        center
        alignCenter
        justifyCenter
        color={ 'primary' }
        fontSize={ 16 }
        p={ 8 }
        startIcon={ FORMAT_ICONS[newFormat] }
        width={ row === 0 ? '33.33%' : '50%' }
        selected={ format === newFormat } 
        onPress={ () => onChange?.(newFormat) }>
        {newFormat}
      </Button>
    );
  }, [format, onChange]);

  return (
    <View rounded outlined style={ theme.components.buttonGroup }>
      <View row style={ theme.components.buttonGroupRow }>
        {makeButton(ReadingFormat.Concise)}
        {makeButton(ReadingFormat.Bullets)}
        {makeButton(ReadingFormat.Casual)}
      </View>
      <View row style={ theme.components.buttonGroupRow }>
        {makeButton(ReadingFormat.Detailed, 1)}
        {makeButton(ReadingFormat.InDepth, 1)}
      </View>
    </View>
  );
}
