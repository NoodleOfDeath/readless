import React from 'react';
import {
  View as RNView,
  ViewProps as RNViewProps,
  TouchableHighlight,
  TouchableHighlightProps,
} from 'react-native';

import { Stylable } from '~/components';
import { useStyles } from '~/hooks';

export type ViewProps = React.PropsWithChildren<TouchableHighlightProps & RNViewProps & Stylable> & {
  pressable?: boolean;
};

export function View({ 
  children,
  pressable,
  ...props
}: ViewProps) {
  const style = useStyles(props);
  return (pressable || props.onPress) ? (
    <TouchableHighlight { ...props } style={ style } underlayColor="transparent">
      <React.Fragment>
        {children}
      </React.Fragment>
    </TouchableHighlight>
  ) : (
    <RNView { ...props } style={ style }>
      {children}
    </RNView>
  );
}
