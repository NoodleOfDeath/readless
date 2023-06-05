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
  scrollEventThrottle = 16,
  refreshControl = onRefresh && (
    <RefreshControl refreshing={ refreshing } onRefresh={ onRefresh } />
  ),
  keyboardAware = false,
  ...props
}: ScrollViewProps) {
  const theme = useTheme();
  const style = useStyles(props as Stylable);
  return (
    <View style={ theme.components.flexCol }>
      {keyboardAware ? (
        <KeyboardAwareScrollView 
          refreshControl={ refreshControl } 
          keyboardShouldPersistTaps={ keyboardShouldPersistTaps }
          scrollEventThrottle={ scrollEventThrottle }
          keyboardDismissMode="on-drag"
          style={ style }
          { ...props }>
          {children}
        </KeyboardAwareScrollView>
      ) : (
        <RNScrollView 
          refreshControl={ refreshControl }
          keyboardShouldPersistTaps={ keyboardShouldPersistTaps }
          scrollEventThrottle={ scrollEventThrottle }
          keyboardDismissMode="on-drag"
          style={ style }
          { ...props }>
          {children}
        </RNScrollView>
      )}
    </View>
  );
}
