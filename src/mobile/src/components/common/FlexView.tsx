import React from 'react';
import { View, ViewProps } from 'react-native';

import { Stylable } from '~/components';
import { useStyles } from '~/hooks';

export type FlexViewProps = React.PropsWithChildren<ViewProps & Stylable>;

export function FlexView({ children, ...props }: FlexViewProps) {
  const style = useStyles(props);
  return (
    <View style={ style }>
      {children}
    </View>
  );
}
