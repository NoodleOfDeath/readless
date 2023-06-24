import React from 'react';
import { StyleSheet } from 'react-native';
import { SafeAreaView, StatusBar } from 'react-native';

import { ViewProps } from '~/components';
import { useTheme } from '~/hooks';

export type ScreenViewProps = ViewProps & {
  refreshing?: boolean;
  onRefresh?: () => void;
};

export function Screen({
  children,
  ...props
}: ViewProps) {
  const theme = useTheme();
  return (
    <React.Fragment>
      <StatusBar barStyle={ theme.isDarkMode ? 'light-content' : 'dark-content' } />
      <SafeAreaView
        style={ styles.SafeAreaView }
        { ...props }>
        {children}
      </SafeAreaView>
    </React.Fragment>
  );
}

const styles = StyleSheet.create({ SafeAreaView: { flex: 1 } });