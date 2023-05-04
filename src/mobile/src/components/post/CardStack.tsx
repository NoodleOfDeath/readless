import React from 'react';

import { View, ViewProps } from '~/components';

export type CardStackProps = Omit<ViewProps, 'children'> & {
  children?: React.ReactNode | React.ReactNode[];
};

export function CardStack({ children }: CardStackProps = {}) {
  return (
    <View>
      {children}
    </View>
  );
}