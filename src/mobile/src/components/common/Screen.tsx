import React from 'react';
import { 
  SafeAreaView,
  StatusBar,
  View,
} from 'react-native';

import { Stylable, ViewProps } from '~/components';
import { 
  useLayout, 
  useStyles, 
  useTheme,
} from '~/hooks';

export type ScreenViewProps = ViewProps & {
  refreshing?: boolean;
  onRefresh?: () => void;
};

export function Screen({
  children,
  ...props
}: ViewProps) {
  const theme = useTheme();
  const style = useStyles(props as Stylable);
  const { orientation } = useLayout();
  return (
    <React.Fragment>
      <StatusBar barStyle={ theme.isLightMode ? 'dark-content' : 'light-content' } />
      {orientation === 'portrait' ? (
        <View
          style={ [style, theme.components.flexCol] } 
          { ...props }>
          {children}
        </View>
      ) : (
        <SafeAreaView
          style={ [style, theme.components.flexCol] } 
          { ...props }>
          {children}
        </SafeAreaView>
      )}
    </React.Fragment>
  );
}
