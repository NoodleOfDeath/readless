import React from 'react';

import { ReadingFormat } from '~/api';
import {
  ChildlessViewProps,
  SegmentedButtons,
  SegmentedButtonsRef,
} from '~/components';
import { StorageContext } from '~/core';
import { strings } from '~/locales';

type Props = ChildlessViewProps & {
  format?: ReadingFormat;
  onChange?: (mode?: ReadingFormat) => void;
  pressOnly?: boolean;
};

const ICONS = {
  [ReadingFormat.Bullets]: 'list.bullet',
  [ReadingFormat.ShortSummary]: 'text.short',
  [ReadingFormat.Summary]: 'text.justify.left',
  [ReadingFormat.FullArticle]: 'book',
};

export function ReadingFormatPicker({
  format,
  onChange,
  pressOnly,
  ...props
}: Props = {}) {
  const { preferredReadingFormat, setStoredValue } = React.useContext(StorageContext);
  const buttonsRef = React.useRef<SegmentedButtonsRef<ReadingFormat>>(null);
  return (
    <SegmentedButtons 
      { ...props }
      ref={ buttonsRef }
      buttonProps={ () => ({
        py: 3, 
        system: true,
      }) }
      buttonMenuItems={ (option) => [
        {
          onPress: () => {
            setStoredValue('preferredReadingFormat', option.value);
            if (option.value !== ReadingFormat.FullArticle) {
              buttonsRef.current?.setValue(option.value);
            }
            onChange?.(option.value);
          },
          systemIcon: ICONS[option.value],
          title: strings.setAsDefault,
        },
      ] }
      initialValue={ format ?? preferredReadingFormat }
      onValueChange={ (value) => onChange?.(value) }
      options={ [
        {
          icon: 'view-list',
          label: strings.bullets,
          value: ReadingFormat.Bullets,
        },
        {
          icon: 'text-long',
          label: strings.summary,
          value: ReadingFormat.Summary,
        },
        {
          icon: 'book-open-variant',
          label: strings.fullArticle,
          pressOnly,
          value: ReadingFormat.FullArticle,
        },
      ] } />
  );
}
