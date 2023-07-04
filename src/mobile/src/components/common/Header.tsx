import React from 'react';

import {
  Icon,
  Text,
  View,
  ViewProps,
} from '~/components';

export type HeaderProps = ViewProps & {
  title?: string;
  subtitle?: string;
  back?: boolean;
  backTitle?: string;
  actions?: React.ReactNode;
};

export function Header({
  title,
  subtitle,
  back,
  backTitle,
  actions,
  children,
  ...props
}: HeaderProps) {
  return (
    <View flexRow { ...props } height={ 56 } px={ 24 } py={ 3 }>
      {back && (
        <View flexRow gap={ 6 } itemsCenter>
          <Icon name='arrow-left' size={ 24 } />
          {backTitle && <Text>{backTitle}</Text>}
        </View>
      )}
      {children}
      {actions}
    </View>
  );
}