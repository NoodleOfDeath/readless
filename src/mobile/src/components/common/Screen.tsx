import React from 'react';
import { SafeAreaView, StatusBar } from 'react-native';

import { ScrollViewProps, Stylable } from '~/components';
import { useStyles, useTheme } from '~/hooks';

export type SafeScrollViewProps = ScrollViewProps & {
  refreshing?: boolean;
  onRefresh?: () => void;
};

export function Screen({
  children,
  ...props
}: SafeScrollViewProps) {
  const theme = useTheme();
  const style = useStyles(props as Stylable);
  return (
    <React.Fragment>
      <StatusBar barStyle={ theme.isLightMode ? 'dark-content' : 'light-content' } />
      <SafeAreaView
        style={ [style, theme.components.flexCol] } 
        { ...props }>
        {children}
      </SafeAreaView>
    </React.Fragment>
  );
}
