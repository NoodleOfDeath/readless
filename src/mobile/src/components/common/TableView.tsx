import React from 'react';
import { StyleProp, ViewStyle } from 'react-native';

// eslint-disable-next-line import-newlines/enforce
import { TableView as RNTableView, THEME_APPEARANCE } from 'react-native-tableview-simple';

import { ChildlessViewProps } from '~/components';
import { useStyles } from '~/hooks';

export type TableViewProps = ChildlessViewProps & {
  children?: React.ReactNode;
  appearance?: 'auto' | 'dark' | 'light' | string;
  customAppearances?: {
      [key: string]: THEME_APPEARANCE;
  };
  style?: StyleProp<ViewStyle>;
};

export function TableView({ children, ...props }: TableViewProps) {
  const style = useStyles(props);
  return (
    <RNTableView
      { ...props }
      style={ [style, { flex: 1, flexGrow: 1 }] }>
      {children}
    </RNTableView>
  );
}   