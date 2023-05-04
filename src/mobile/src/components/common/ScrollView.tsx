import React from 'react';
import {
  ScrollView as RNScrollView,
  RefreshControl,
  SafeAreaView,
} from 'react-native';

import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewProps,
} from 'react-native-keyboard-aware-scroll-view';

import {
  Stylable,
  View,
  ViewProps,
} from '~/components';
import { useStyles, useTheme } from '~/hooks';

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
  const theme = useTheme();
  const style = useStyles(props as Stylable);
  return (
    <SafeAreaView style={ theme.components.flexCol }>
      {keyboardAware ? (
        <KeyboardAwareScrollView refreshControl={ refreshControl } { ...props }>
          <View style={ style }>{children}</View>
        </KeyboardAwareScrollView>
      ) : (
        <RNScrollView refreshControl={ refreshControl } { ...props }>
          <View style={ style }>{children}</View>
        </RNScrollView>
      )}
    </SafeAreaView>
  );
}
