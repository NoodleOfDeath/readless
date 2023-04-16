import React from 'react';

import { ReadingFormat } from '~/api';
import { Button, View } from '~/components';
import { SessionContext } from '~/contexts';
import { useTheme } from '~/hooks';

type Props = {
  format?: ReadingFormat;
  preferredFormat?: ReadingFormat;
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
  preferredFormat = ReadingFormat.Concise, 
  onChange,
}: Props = {}) {
  const theme = useTheme();
  const { preferences: { compactMode } } = React.useContext(SessionContext);
  const makeButton = React.useCallback((newFormat: ReadingFormat, row = 0) => {
    return (
      <Button
        body2
        selectable
        outlined
        row
        center
        alignCenter
        justifyCenter
        color={ 'primary' }
        spacing={ 8 }
        p={ 8 }
        startIcon={ FORMAT_ICONS[newFormat] }
        width={ row === 0 ? '33.33%' : '50%' }
        selected={ format === newFormat }
        bg={ newFormat === preferredFormat ? '#aaaacc' : undefined }
        onPress={ () => onChange?.(newFormat) }>
        {!compactMode && newFormat}
      </Button>
    );
  }, [compactMode, format, preferredFormat, onChange]);

  return (
    compactMode ? (
      <View row rounded outlined style={ theme.components.buttonGroup }>
        {makeButton(ReadingFormat.Concise)}
        {makeButton(ReadingFormat.Bullets)}
        {makeButton(ReadingFormat.Casual)}
        {makeButton(ReadingFormat.Detailed)}
        {makeButton(ReadingFormat.InDepth)}
      </View>
    ) : (  
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
    )
  );
}
