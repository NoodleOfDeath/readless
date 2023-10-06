import React from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
} from 'react-native';

import { View, ViewProps } from '~/components';
import { useTheme } from '~/hooks';

export type ScreenProps = ViewProps & {
  safeArea?: boolean;
};

export function Screen({
  children,
  safeArea = true,
  ...props
}: ScreenViewProps) {
  const theme = useTheme();
  return (
    <React.Fragment>
      <StatusBar barStyle={ theme.isDarkMode ? 'light-content' : 'dark-content' } />
      {safeArea ? (
        <SafeAreaView
          style={ styles.ContentView }
          { ...props }>
          {children}
        </SafeAreaView>
      ) : (
        <View
          style={ styles.ContentView }
          { ...props }>
          {children}
        </View>
      )}
    </React.Fragment>
  );
}

const styles = StyleSheet.create({ ContentView: { flex: 1 } });