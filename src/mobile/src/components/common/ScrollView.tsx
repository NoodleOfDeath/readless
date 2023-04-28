import React from 'react';
import { ScrollView as RNScrollView, RefreshControl } from 'react-native';

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
  keyboardAware?: boolean;
};

export function ScrollView({
  children,
  refreshing = false,
  onRefresh,
  refreshControl = onRefresh && (
    <RefreshControl refreshing={ refreshing } onRefresh={ onRefresh } />
  ),
  keyboardAware = true,
  ...props
}: ScrollViewProps) {
  const style = useStyles(props as Stylable);
  return (
    keyboardAware ? (
      <KeyboardAwareScrollView refreshControl={ refreshControl } { ...props }>
        <View style={ style }>{children}</View>
      </KeyboardAwareScrollView>
    ) : (
      <RNScrollView refreshControl={ refreshControl } { ...props }>
        <View style={ style }>{children}</View>
      </RNScrollView>
    ));
}
