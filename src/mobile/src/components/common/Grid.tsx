import React from 'react';

import { View, ViewProps } from '~/components';

type GridStyle = {
  tesselate?: boolean;
  table?: boolean;
};

type Props = Omit<ViewProps, 'children'> & {
  row?: number;
  col?: number;
  gridStyle?: GridStyle;
  children?: React.ReactNode | React.ReactNode[];
};

export function Grid({
  children,
  ...props
}: Props) {
  const childArray = React.useMemo(() => Array.isArray(children) ? children : children ? [children] : undefined, [children]);
  return (
    <View { ...props } row flexWrap="wrap">
      { childArray?.map((child, index) => (
        <React.Fragment key={ index }>
          { child }
        </React.Fragment>
      )) }
    </View>
  );
}