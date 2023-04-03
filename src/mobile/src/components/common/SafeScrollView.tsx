import React from 'react';
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  ScrollViewProps,
} from 'react-native';

import { FlexView } from '~/components';
import { useTheme } from '~/hooks';

export type SafeScrollViewProps = ScrollViewProps & {
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
  return (
    <SafeAreaView style={ theme.components.flexCol }>
      <ScrollView refreshControl={ refreshControl } { ...props }>
        <FlexView style={ theme.components.screen }>{children}</FlexView>
      </ScrollView>
    </SafeAreaView>
  );
}
