import React from 'react';

import {
  mdiBookOpen,
  mdiFormatListBulleted,
  mdiTextLong,
} from '@mdi/js';

import { ReadingFormat } from '~/api';

type Props = {
  format?: ReadingFormat;
  onChange?: (format: ReadingFormat) => void;
};

const FORMAT_ICONS: Record<ReadingFormat, string> = {
  [ReadingFormat.Bullets]: mdiFormatListBulleted,
  [ReadingFormat.FullArticle]: mdiBookOpen,
  [ReadingFormat.Summary]: mdiTextLong,
};

export default function ReadingFormatSelector({ format, onChange }: Props = {}) {
    
  const ReadingFormatButton = React.useCallback((buttonFormat: ReadingFormat) => {
    return (
      <button
        onClick={ () => onChange?.(buttonFormat) }>
        {buttonFormat}
      </button>
    );
  }, [onChange]);
  
  return (
    <div>
      {ReadingFormatButton(ReadingFormat.Summary)}
      {ReadingFormatButton(ReadingFormat.Bullets)}
      {ReadingFormatButton(ReadingFormat.FullArticle)}
    </div>
  );
}
