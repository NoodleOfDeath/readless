import React from 'react';
import {
  View as RNView,
  ViewProps as RNViewProps,
  StyleSheet,
  TouchableHighlight,
  TouchableHighlightProps,
} from 'react-native';

import { Stylable } from '~/components';
import { useStyles, useTheme } from '~/hooks';

export type ViewProps = React.PropsWithChildren<TouchableHighlightProps & RNViewProps & Stylable> & {
  title?: string;
  pressable?: boolean;
};

export function View({ 
  children,
  pressable,
  inactive,
  ...props
}: ViewProps) {
  const style = useStyles(props);
  const theme = useTheme();
  const overlay = React.useMemo(() => {
    if (inactive) {
      return (
        <View style={ {
          ...StyleSheet.absoluteFillObject, 
          backgroundColor: theme.colors.inactive, 
          borderRadius: style.borderRadius ?? 0,
          opacity: 0.3,
        } } />
      );
    }
  }, [inactive, style.borderRadius, theme.colors.inactive]);
  return (pressable || props.onPress) ? (
    <TouchableHighlight { ...props } style={ style } underlayColor="transparent">
      <React.Fragment>
        {inactive && overlay}
        {children}
      </React.Fragment>
    </TouchableHighlight>
  ) : (
    <RNView { ...props } style={ style }>
      {inactive && overlay}
      {children}
    </RNView>
  );
}
