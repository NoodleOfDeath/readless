import React from 'react';
import {
  ScrollView as RNScrollView,
  ScrollViewProps as RNScrollViewProps,
  RefreshControl,
} from 'react-native';

import {
  Stylable,
  View,
  ViewProps,
} from '~/components';
import { useStyles, useTheme } from '~/hooks';

export type ScrollViewProps = ViewProps & RNScrollViewProps & {
  refreshing?: boolean;
  onRefresh?: () => void;
  ref?: React.RefObject<RNScrollView>;
};

export function ScrollView({
  children,
  refreshing = false,
  onRefresh,
  keyboardShouldPersistTaps = 'handled',
  scrollEventThrottle = 16,
  refreshControl = onRefresh && (
    <RefreshControl refreshing={ refreshing } onRefresh={ onRefresh } />
  ),
  ref,
  ...props
}: ScrollViewProps) {
  const theme = useTheme();
  const style = useStyles(props as Stylable);
  return (
    <RNScrollView 
      refreshControl={ refreshControl }
      keyboardShouldPersistTaps={ keyboardShouldPersistTaps }
      scrollEventThrottle={ scrollEventThrottle }
      keyboardDismissMode="on-drag"
      style={ style }
      ref={ ref as React.RefObject<RNScrollView> }
      { ...props }>
      {children}
    </RNScrollView>
  );
}
