import React from 'react';

import { ReadingFormat } from '~/api';
import {
  ChildlessViewProps,
  Icon,
  SegmentedButtons,
} from '~/components';
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
  const [initialFormat, setInitialFormat] = React.useState(format ?? preferredReadingFormat);

  return (
    <SegmentedButtons 
      { ...props }
      buttonProps={ { py: 3, system: true } }
      buttonMenuItems={ (option) => [
        {
          icon: () => typeof option.icon === 'string' ? <Icon name={ option.icon } /> : <React.Fragment>{option.icon}</React.Fragment>,
          key: option.value,
          onPress: () => {
            setPreference('preferredReadingFormat', option.value);
            setInitialFormat(option.value);
          },
          text: strings.action_setAsDefault,
        },
      ] }
      initialValue={ initialFormat }
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
