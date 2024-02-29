import React from 'react';

import {
  ChildlessViewProps,
  Text,
  TextProps,
} from '~/components';
import { getFnsLocale } from '~/locales';
import { formatTimestamp } from '~/utils';

export type TimestampProps = ChildlessViewProps & TextProps & {
  children?: string;
  format?: string;
  relativeTo?: Date;
};

export function Timestamp({
  children,
  format,
  relativeTo,
  ...props
}: TimestampProps) {
  return (
    children && (
      <Text { ...props }>
        {formatTimestamp(children, {
          format, locale: getFnsLocale(), relativeTo, 
        })}
      </Text>
    )
  );
}