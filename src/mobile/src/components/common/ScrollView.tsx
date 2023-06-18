import React from 'react';
import {
  ScrollView as RNScrollView,
  ScrollViewProps as RNScrollViewProps,
  RefreshControl,
} from 'react-native';

import { Stylable, ViewProps } from '~/components';
import { useStyles } from '~/hooks';

export type ScrollViewProps = ViewProps & RNScrollViewProps & {
  refreshing?: boolean;
  onRefresh?: () => void;
  ref?: React.RefObject<RNScrollView>;
};

export function ScrollView({
  children,
  refreshing = false,
  onRefresh,
  keyboardDismissMode = 'on-drag',
  keyboardShouldPersistTaps = 'handled',
  scrollEventThrottle = 16,
  refreshControl = onRefresh && (
    <RefreshControl refreshing={ refreshing } onRefresh={ onRefresh } />
  ),
  ref,
  ...props
}: ScrollViewProps) {
  const style = useStyles(props as Stylable);
  return (
    <RNScrollView 
      nestedScrollEnabled
      refreshControl={ refreshControl }
      keyboardDismissMode={ keyboardDismissMode }
      keyboardShouldPersistTaps={ keyboardShouldPersistTaps }
      scrollEventThrottle={ scrollEventThrottle }
      style={ style }
      ref={ ref as React.RefObject<RNScrollView> }
      { ...props }>
      {children}
    </RNScrollView>
  );
}
