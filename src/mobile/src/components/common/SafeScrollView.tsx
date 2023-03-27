import React from 'react';
import {
  RefreshControl,
  SafeAreaView,
  ScrollView,
  ScrollViewProps,
} from 'react-native';

import FlexView from './FlexView';
import { useTheme } from '../theme';

type Props = ScrollViewProps & {
  refreshing?: boolean;
  onRefresh?: () => void;
};

export default function SafeScrollView({
  children,
  refreshing = false,
  onRefresh,
  refreshControl = onRefresh && (
    <RefreshControl refreshing={ refreshing } onRefresh={ onRefresh } />
  ),
  ...props
}: Props) {
  const theme = useTheme();
  return (
    <SafeAreaView style={ theme.components.flexCol }>
      <ScrollView refreshControl={ refreshControl } { ...props }>
        <FlexView style={ theme.components.screen }>{children}</FlexView>
      </ScrollView>
    </SafeAreaView>
  );
}
