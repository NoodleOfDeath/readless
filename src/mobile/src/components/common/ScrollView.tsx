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

import { Stylable, ViewProps } from '~/components';
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
  keyboardShouldPersistTaps = 'handled',
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
        <KeyboardAwareScrollView 
          refreshControl={ refreshControl } 
          keyboardShouldPersistTaps={ keyboardShouldPersistTaps }
          keyboardDismissMode="on-drag"
          style={ style }
          { ...props }>
          {children}
        </KeyboardAwareScrollView>
      ) : (
        <RNScrollView 
          refreshControl={ refreshControl }
          keyboardShouldPersistTaps={ keyboardShouldPersistTaps }
          keyboardDismissMode="on-drag"
          style={ style }
          { ...props }>
          {children}
        </RNScrollView>
      )}
    </SafeAreaView>
  );
}
