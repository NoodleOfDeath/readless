import React from 'react';

import { ReadingFormat } from '~/api';
import {
  ChildlessViewProps,
  SegmentedButtons,
  SegmentedButtonsRef,
} from '~/components';
import { SessionContext } from '~/core';
import { strings } from '~/locales';

type Props = ChildlessViewProps & {
  format?: ReadingFormat;
  onChange?: (mode?: ReadingFormat) => void;
  pressOnly?: boolean;
};

const ICONS = {
  [ReadingFormat.Summary]: 'text.justify.left',
  [ReadingFormat.Bullets]: 'list.bullet',
  [ReadingFormat.FullArticle]: 'book',
};

export function ReadingFormatPicker({
  format,
  onChange,
  pressOnly,
  ...props
}: Props = {}) {
  const { preferredReadingFormat, setPreference } = React.useContext(SessionContext);
  const buttonsRef = React.useRef<SegmentedButtonsRef<ReadingFormat>>(null);
  return (
    <SegmentedButtons 
      { ...props }
      ref={ buttonsRef }
      buttonProps={ { py: 3, system: true } }
      buttonMenuItems={ (option) => [
        {
          onPress: () => {
            setPreference('preferredReadingFormat', option.value);
            if (option.value !== ReadingFormat.FullArticle) {
              buttonsRef.current?.setValue(option.value);
            }
            onChange?.(option.value);
          },
          systemIcon: ICONS[option.value],
          title: strings.action_setAsDefault,
        },
      ] }
      initialValue={ format ?? preferredReadingFormat }
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
        {
          icon: 'book-open-variant',
          label: strings.summary_fullArticle,
          pressOnly,
          value: ReadingFormat.FullArticle,
        },
      ] } />
  );
}
