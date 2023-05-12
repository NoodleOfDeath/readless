import React from 'react';
import {
  RefreshControl,
  SafeAreaView,
  StatusBar,
} from 'react-native';

import {
  KeyboardAwareScrollView,
  KeyboardAwareScrollViewProps,
} from 'react-native-keyboard-aware-scroll-view';

import { Stylable } from '~/components';
import { useStyles, useTheme } from '~/hooks';

export type SafeScrollViewProps = KeyboardAwareScrollViewProps & {
  refreshing?: boolean;
  onRefresh?: () => void;
};

export function Screen({
  children,
  refreshing = false,
  onRefresh,
  refreshControl = onRefresh && (
    <RefreshControl refreshing={ refreshing } onRefresh={ onRefresh } />
  ),
  onScroll,
  scrollEventThrottle = 500,
  ...props
}: SafeScrollViewProps) {
  const theme = useTheme();
  const style = useStyles(props as Stylable);

  return (
    <React.Fragment>
      <StatusBar barStyle={ theme.isLightMode ? 'dark-content' : 'light-content' } />
      <SafeAreaView style={ theme.components.flexCol }>
        <KeyboardAwareScrollView
          refreshControl={ refreshControl }
          onScroll={ onScroll }
          scrollEventThrottle={ scrollEventThrottle }
          style={ style }
          { ...props }>
          {children}
        </KeyboardAwareScrollView>
      </SafeAreaView>
    </React.Fragment>
  );
}
