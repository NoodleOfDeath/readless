import React from 'react';
import { RefreshControl, SafeAreaView } from 'react-native';

import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewProps,
} from 'react-native-keyboard-aware-scroll-view';

import { Stylable, View } from '~/components';
import { useStyles, useTheme } from '~/hooks';

export type SafeScrollViewProps = KeyboardAwareScrollViewProps & {
  refreshing?: boolean;
  onRefresh?: () => void;
};

export function SafeScrollView({
  children,
  refreshing = false,
  onRefresh,
  refreshControl = onRefresh && (
    <RefreshControl refreshing={ refreshing } onRefresh={ onRefresh } />
  ),
  ...props
}: SafeScrollViewProps) {
  const theme = useTheme();
  const style = useStyles(props as Stylable);
  return (
    <SafeAreaView style={ theme.components.flexCol }>
      <KeyboardAwareScrollView refreshControl={ refreshControl } { ...props }>
        <View style={ style }>{children}</View>
      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
