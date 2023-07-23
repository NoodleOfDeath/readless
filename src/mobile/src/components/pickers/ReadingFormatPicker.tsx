import React from 'react';

import { ReadingFormat } from '~/api';
import { ChildlessViewProps, SegmentedButtons } from '~/components';
import { SessionContext } from '~/core';
import { strings } from '~/locales';

type Props = ChildlessViewProps & {
  format?: ReadingFormat;
  onChange?: (mode?: ReadingFormat) => void;
  pressOnly?: boolean;
};

export function ReadingFormatPicker({
  format,
  onChange,
  pressOnly,
  ...props
}: Props = {}) {

  const { preferredReadingFormat, setPreference } = React.useContext(SessionContext);

  return (
    <SegmentedButtons 
      { ...props }
      buttonProps={ { py: 3, system: true } }
      buttonMenuItems={ (option) => [
        {
          onPress: () => {
            setPreference('preferredReadingFormat', option.value);
          },
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
          icon: 'book-open',
          label: strings.summary_fullArticle,
          pressOnly,
          value: ReadingFormat.FullArticle,
        },
      ] } />
  );
}
