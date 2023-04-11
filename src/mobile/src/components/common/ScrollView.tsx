import React from 'react';
import { RefreshControl } from 'react-native';

import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewProps,
} from 'react-native-keyboard-aware-scroll-view';

import {
  Stylable,
  View,
  ViewProps,
} from '~/components';
import { useStyles } from '~/hooks';

export type ScrollViewProps = ViewProps & KeyboardAwareScrollViewProps & {
  refreshing?: boolean;
  onRefresh?: () => void;
};

export function ScrollView({
  children,
  refreshing = false,
  onRefresh,
  refreshControl = onRefresh && (
    <RefreshControl refreshing={ refreshing } onRefresh={ onRefresh } />
  ),
  ...props
}: ScrollViewProps) {
  const style = useStyles(props as Stylable);
  return (
    <KeyboardAwareScrollView refreshControl={ refreshControl } { ...props }>
      <View style={ style }>{children}</View>
    </KeyboardAwareScrollView>
  );
}
